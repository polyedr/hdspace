/* eslint-disable camelcase, no-console */

import {
  takeLatest,
  takeEvery,
  put,
  call,
  take,
  select,
  takeLeading,
} from 'redux-saga/effects';
import * as R from 'ramda';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import * as Actions from '../actions';
import { AppReduxState } from '../../../shared/types/app';
import {
  removeProjectStyles,
  updateProjectClasses,
} from '../../../utils/ProjectClassesHelper';
import { Entity } from '../../../domain/core';
import {
  addChildToElementSaga,
  createElements,
  createElementsSaga,
  redoWrapIntoContainerSaga,
  renameElementSaga,
  restoreElementChildrenSaga,
  restoreElementSaga,
  softDeleteSaga,
  unwrapFromContainerSaga,
  wrapIntoContainerSaga,
} from './scenario';
import {
  addProject,
  changeScreensOrderSaga,
  delProjectSaga,
  exportProjectSaga,
  getProjectListSaga,
  getProjectSaga,
  renameProjectSaga,
  updateProject,
  updateProjectSaga,
} from './project';
import {
  moveElementSaga,
  removeElementStylesSaga,
  updateElementStyles,
  replaceElementStylesSaga,
  copyElementStylesSaga,
  addElementClassNameSaga,
  removeElementClassNameSaga,
  updateElementImage,
  updateElementParameters,
  uploadFileSaga,
  saveCustomLibraryElement,
} from './element';
import { convertElementToRequest } from '../../../api/converters/toRequest';
import { MAX_TOKEN_TRIALS } from '../../../../config/settings';
import TYPES from '../../../constants/actions';
import { setLoadedToken, setTokenPair } from '../../user/actions';
import {
  ElementHistoryMeta,
  ItemToCopyInfo,
  Map,
  StateElement,
} from '../types';

import { LibraryElement } from '../../../api/types';
import { openProjects, openSignScreen } from '../../../utils/history';
import { refreshUserTokenPair } from '../../user/sagas';
import { DEFAULT_AUTHORISATION_TOKEN } from '../../../constants/defaultParams';
import {
  selectActiveElement,
  selectActiveElementId,
  selectAllElements,
  selectCurrentProject,
  selectCurrentRootId,
  selectCurrentScreen,
  selectElementAsTree,
  selectHistory,
  selectItemToCopyInfo,
  selectRedoActions,
  selectScreenRootElement,
  selectUndoActions,
} from '../selectors';

import {
  activateScreenSaga,
  addScreenSaga,
  delScreenSaga,
  getScreenNNSaga,
  renameScreenSaga,
  restoreScreenSaga,
  saveScreenImageSaga,
} from './screen';

import { PATH_NAMES } from '../../../constants/pathNames';

function* LocationChange({ payload: { location } }: LocationChangeAction) {
  const {
    user: { tokenPair },
  }: AppReduxState = yield select();

  if (
    tokenPair.access === '' &&
    location.pathname !== PATH_NAMES.user.signup &&
    location.pathname !== PATH_NAMES.user.signin &&
    !location.pathname.match(PATH_NAMES.user.activate) &&
    !location.pathname.match(PATH_NAMES.user.password)
  ) {
    openSignScreen('signin');
  }

  if (
    tokenPair.access !== '' &&
    (location.pathname === PATH_NAMES.user.signin ||
      location.pathname === PATH_NAMES.user.signup)
  ) {
    openProjects();
  }
}

export function* reqWrapper(
  requestAction: (props: any) => Promise<any>,
  props: any = {},
  tries = 0,
): any {
  const {
    user: {
      tokenPair: { access },
    },
  }: AppReduxState = yield select();
  const result = yield call(requestAction as any, { access, ...props });

  if (R.path(['response', 'data', 'code'], result) === 'token_not_valid') {
    const {
      user: { isLoadedToken },
    }: AppReduxState = yield select();

    if (isLoadedToken) {
      yield put(setLoadedToken(false));
    } else {
      yield take('SET_LOADED_TOKEN');

      return yield call(reqWrapper, requestAction, props, tries + 1);
    }

    const token_result = yield call(refreshUserTokenPair);

    if (!token_result || token_result.msg || tries >= MAX_TOKEN_TRIALS - 1) {
      yield put(setTokenPair(DEFAULT_AUTHORISATION_TOKEN));
      yield call(openSignScreen, 'signin');

      return null;
    }

    yield put(setTokenPair(token_result));
    yield put(setLoadedToken(true));

    return yield call(reqWrapper, requestAction, props, tries + 1);
  }

  if (R.path(['response', 'statusText'], result) === 'Unauthorized') {
    openSignScreen('signin');

    return null;
  }

  if (R.path(['response', 'status'], result)) {
    return null;
  }

  return result;
}

function* removeSharedStylesSaga(
  action: ReturnType<typeof Actions.removeSharedStyles>,
) {
  const { className, cssPropertiesNames } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );
  const newProject = removeProjectStyles(
    currentProject,
    className,
    cssPropertiesNames,
  );

  yield call(updateProject, newProject);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const state: Map<StateElement> = yield select(selectAllElements);

  yield put(
    Actions.updateElementsTree(state, { ...action.meta, sourceAction: action }),
  );
}

function* updateSharedStylesSaga(
  action: ReturnType<typeof Actions.updateSharedStyles>,
) {
  const { className, styles } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );
  const newProject = updateProjectClasses(currentProject, className, styles);

  yield call(updateProject, newProject);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const state: Map<StateElement> = yield select(selectAllElements);

  yield put(
    Actions.updateElementsTree(state, { ...action.meta, sourceAction: action }),
  );
}

function* copyActiveItemSaga() {
  const {
    id: activeItemID,
  }: ReturnType<typeof selectActiveElement> = yield select(selectActiveElement);
  const currentScreen: ReturnType<typeof selectCurrentScreen> = yield select(
    selectCurrentScreen,
  );
  if (activeItemID !== 'none') {
    yield put(Actions.setItemToCopy(activeItemID, currentScreen.id));
  }
}

function* duplicateElements(
  itemsToCopyInfo: ItemToCopyInfo[],
  targetParent: LibraryElement<Entity>,
  { screenId, undo }: ElementHistoryMeta,
) {
  const elements: LibraryElement<any>[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const el of itemsToCopyInfo) {
    const element = yield select(selectElementAsTree(el.id));
    elements.push(element);
  }

  const convertedItemsToDuplicate = elements.map((item) =>
    convertElementToRequest(item!),
  );

  yield call(createElements, convertedItemsToDuplicate, targetParent, {
    screenId,
    undo,
  });
}

function* duplicateScreenSaga(
  action: ReturnType<typeof Actions.duplicateScreen>,
) {
  const { name, screenID } = action.payload;

  const sourceRoot: LibraryElement<'root'> = yield select(
    selectScreenRootElement(screenID),
  );

  const sourceCurrentScreen: ReturnType<typeof selectCurrentScreen> = yield select(
    selectCurrentScreen,
  );

  const duplicatedItems = sourceRoot.children.map((child) => ({
    id: child.id,
    screenID: sourceCurrentScreen.id,
  }));

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );
  const projectID = currentProject.id;
  const screensNumber = currentProject.projectscreen.length;

  const { id: newScreenId } = yield call(
    addScreenSaga,
    Actions.addScreen(projectID, name, screensNumber),
  );
  yield put(Actions.setScreenLoader(true));

  const targetRoot: LibraryElement<'root'> = yield select(
    selectScreenRootElement(newScreenId),
  );
  const targetRootID = targetRoot.id;

  yield put(Actions.setActiveElement(targetRootID));

  yield call(duplicateElements, duplicatedItems, targetRoot, {
    screenId: newScreenId,
    undo: true,
  });
  yield put(Actions.setScreenLoader(false));
}

function* pasteCopiedElementSaga({
  type,
  meta,
}: ReturnType<typeof Actions.pasteCopiedElement>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  const { screenId } = meta;
  const activeElementId: string = yield select(selectActiveElementId);
  const activeElement: LibraryElement<any> = yield select(
    selectElementAsTree(activeElementId),
  );

  const itemToCopyInfo: ReturnType<typeof selectItemToCopyInfo> = yield select(
    selectItemToCopyInfo,
  );
  if (!itemToCopyInfo) return;

  if (activeElement.type !== 'none') {
    yield call(duplicateElements, [itemToCopyInfo], activeElement, {
      screenId,
    });
  }
}

function* undoSaga() {
  const history = yield select(selectHistory);
  const redos = yield select(selectRedoActions);
  const undos = yield select(selectUndoActions);

  if (!undos.length) {
    yield put(Actions.setNotification('Nothing to undo.'));
    return;
  }

  const last = undos[undos.length - 1];

  if (Array.isArray(last)) {
    if (last[0].meta?.screenId) {
      yield put(Actions.activateScreen(last[0].meta.screenId));
    }
    yield put(Actions.setGroupActionsUp(true));

    // eslint-disable-next-line no-restricted-syntax
    for (const undo of last.reverse()) {
      yield put({
        ...undo,
        meta: {
          ...undo.meta,
          undo: true,
        },
      });
    }

    yield put(Actions.setGroupActionsUp(false));
  } else {
    if (last.meta?.screenId) {
      yield put(Actions.activateScreen(last.meta.screenId));
    }

    yield put({
      ...last,
      meta: {
        ...last.meta,
        undo: true,
      },
    });
  }

  yield put(Actions.popUndoAction());
  yield put(Actions.popHistory());

  yield put(Actions.setRedoActions([history[history.length - 1], ...redos]));
}

function* redoSaga() {
  const redos = yield select(selectRedoActions);

  if (!redos.length) {
    yield put(Actions.setNotification('Nothing to redo.'));
    return;
  }

  const first = redos[0];

  if (Array.isArray(first)) {
    if (first[0].meta?.screenId) {
      yield put(Actions.activateScreen(first[0].meta.screenId));
    }

    yield put(Actions.setGroupActionsUp(true));

    // eslint-disable-next-line no-restricted-syntax
    for (const redo of first) {
      yield put({
        ...redo,
        meta: {
          ...redo.meta,
          redo: true,
        },
      });
    }

    yield put(Actions.setGroupActionsUp(false));
  } else {
    if (first.meta?.screenId) {
      yield put(Actions.activateScreen(first.meta.screenId));
    }

    yield put({
      ...first,
      meta: {
        ...first.meta,
        redo: true,
      },
    });
  }

  yield put(Actions.setRedoActions([...redos.slice(1)]));
}

export function* setActiveElementSaga(
  action: ReturnType<typeof Actions.setActiveElementId>,
) {
  const prevActiveElementId = yield select(selectActiveElementId);
  const rootID = yield select(selectCurrentRootId);
  if (
    prevActiveElementId !== action.payload &&
    prevActiveElementId !== rootID
  ) {
    yield put(Actions.removeBorderedElementRect(prevActiveElementId));
  }
  yield put(Actions.setActiveElementId(action.payload));
}

export function* setCurrentDropTargetSaga(
  action: ReturnType<typeof Actions.setCurrentDropTarget>,
) {
  yield put(Actions.setCurrentDropTargetId(action.payload.id));
}

export default function* projectSaga() {
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(TYPES.LOAD_PROJECTS, getProjectListSaga);
  yield takeLatest(TYPES.ADD_PROJECT, addProject);
  yield takeLatest(TYPES.DELETE_PROJECT, delProjectSaga);
  yield takeLatest(TYPES.UPDATE_PROJECT, updateProjectSaga);
  yield takeLatest(TYPES.GET_PROJECT, getProjectSaga);
  yield takeLatest(TYPES.EXPORT_PROJECT, exportProjectSaga);
  yield takeLatest(TYPES.CHANGE_SCREENS_ORDER, changeScreensOrderSaga);
  yield takeLatest(TYPES.RENAME_PROJECT, renameProjectSaga);

  yield takeLatest(TYPES.ACTIVATE_SCREEN, activateScreenSaga);
  yield takeLatest(TYPES.ADD_SCREEN, addScreenSaga);
  yield takeEvery(TYPES.DUPLICATE_SCREEN, duplicateScreenSaga);
  yield takeLatest(TYPES.SAVE_SCREEN, saveScreenImageSaga);
  yield takeLatest(TYPES.DELETE_SCREEN, delScreenSaga);
  yield takeEvery(TYPES.RESTORE_SCREEN, restoreScreenSaga);
  yield takeLatest(TYPES.RENAME_SCREEN, renameScreenSaga);
  yield takeEvery(TYPES.MOVE_ELEMENT, moveElementSaga);

  yield takeLatest(TYPES.REMOVE_SHARED_STYLES, removeSharedStylesSaga);
  yield takeLatest(TYPES.UPDATE_SHARED_STYLES, updateSharedStylesSaga);
  yield takeLatest(TYPES.REMOVE_ELEMENT_STYLES, removeElementStylesSaga);
  yield takeLatest(TYPES.UPDATE_ELEMENT_STYLES, updateElementStyles);
  yield takeLatest(TYPES.REPLACE_ELEMENT_STYLES, replaceElementStylesSaga);
  yield takeLatest(TYPES.COPY_ELEMENT_STYLES, copyElementStylesSaga);
  yield takeLatest(TYPES.ADD_ELEMENT_CLASSNAME, addElementClassNameSaga);
  yield takeLatest(TYPES.REMOVE_ELEMENT_CLASSNAME, removeElementClassNameSaga);
  yield takeLatest(TYPES.UPDATE_ELEMENT_IMAGE, updateElementImage);
  yield takeLatest(TYPES.UPDATE_ELEMENT_PARAMETERS, updateElementParameters);

  yield takeEvery(TYPES.CREATE_ELEMENTS, createElementsSaga);
  yield takeEvery(TYPES.RENAME_ELEMENT, renameElementSaga);

  yield takeEvery(TYPES.ADD_CHILD_TO_ELEMENT, addChildToElementSaga);
  yield takeEvery(TYPES.WRAP_INTO_CONTAINER, wrapIntoContainerSaga);

  yield takeEvery(TYPES.DELETE_ITEM, softDeleteSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT_CHILDREN, restoreElementChildrenSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT, restoreElementSaga);

  yield takeLatest(TYPES.COPY_ACTIVE_ITEM, copyActiveItemSaga);
  yield takeEvery(TYPES.PASTE_COPIED_ELEMENT, pasteCopiedElementSaga);

  yield takeLatest(TYPES.UPLOAD_FILE, uploadFileSaga);
  yield takeLatest(TYPES.GET_SCREEN_NN, getScreenNNSaga);

  yield takeEvery(TYPES.UNDO_ACTION, undoSaga);
  yield takeEvery(TYPES.REDO_ACTION, redoSaga);
  yield takeEvery(TYPES.UNWRAP_FROM_CONTAINER, unwrapFromContainerSaga);
  yield takeEvery(TYPES.REDO_WRAP_INTO_CONTAINER, redoWrapIntoContainerSaga);
  yield takeEvery(TYPES.SAVE_LIBRARY_ELEMENT, saveCustomLibraryElement);
  yield takeEvery(TYPES.SET_ACTIVE_ELEMENT, setActiveElementSaga);
  yield takeLeading(TYPES.SET_CURRENT_DROP_TARGET, setCurrentDropTargetSaga);
}
