/* eslint-disable camelcase, no-console */
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects';
import * as Actions from '../actions';
import {
  removeProjectStyles,
  updateProjectClasses,
} from '../../../utils/ProjectClassesHelper';
import {
  addChildToElementSaga,
  createElements,
  createElementsSaga,
  redoWrapIntoContainerSaga,
  restoreElementChildrenSaga,
  restoreElementSaga,
  softDeleteSaga,
  unwrapFromContainerSaga,
  updateElementSaga,
  wrapIntoContainerSaga,
} from './scenario';
import {
  createProjectSaga,
  deleteProjectSaga,
  getProjectListSaga,
  getProjectSaga,
  renameProjectSaga,
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
  updateElementImageSaga,
  updateElementParameters,
  uploadFileSaga,
  loadCustomElementsSaga,
  setActiveElementSaga,
} from './element';
import { convertElementToRequest } from '../../../api/converters/toRequest';
import TYPES from '../../actionTypes';
import {
  selectActiveElement,
  selectActiveElementId,
  selectAllElements,
  selectCurrentProject,
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
  createScreenSaga,
  changeScreensOrderSaga,
  deleteScreenSaga,
  renameScreenSaga,
  restoreScreenSaga,
  saveScreenImageSaga,
} from './screen';
import { activateScreen } from '../actions';
import {
  Entity,
  ItemToCopyInfo,
  LibraryElement,
  Normalized,
  StateElement,
} from '../../../types';
import { projectUpdateHelperSaga } from './shared';
import { ElementHistoryMeta } from '../../types';
import { enqueueSnackbar } from '../../notification/actions';

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

  yield call(projectUpdateHelperSaga, newProject);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const state: Normalized<StateElement> = yield select(selectAllElements);

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

  yield call(projectUpdateHelperSaga, newProject);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const state: Normalized<StateElement> = yield select(selectAllElements);

  yield put(
    Actions.updateElementsTree(state, { ...action.meta, sourceAction: action }),
  );
}

function* copyActiveElementSaga() {
  try {
    const { id: activeItemID, name }: StateElement = yield select(
      selectActiveElement,
    );
    const currentScreen: ReturnType<typeof selectCurrentScreen> = yield select(
      selectCurrentScreen,
    );
    if (activeItemID !== 'none') {
      yield put(Actions.setElementToCopy(activeItemID, currentScreen.id));
    }
    yield put(
      enqueueSnackbar({
        message: `Copied element "${name}"`,
        options: { variant: 'success' },
      }),
    );
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

// eslint-disable-next-line consistent-return
function* duplicateElements(
  itemsToCopyInfo: ItemToCopyInfo[],
  targetParent: LibraryElement<Entity>,
  { screenId, undo }: ElementHistoryMeta,
) {
  try {
    const elements: LibraryElement<any>[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const el of itemsToCopyInfo) {
      const element = yield select(selectElementAsTree(el.id));
      elements.push(element);
    }

    const convertedItemsToDuplicate = elements.map((item) =>
      convertElementToRequest(item!),
    );

    return yield call(
      createElements,
      { elements: convertedItemsToDuplicate },
      targetParent,
      {
        screenId,
        undo,
      },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

function* duplicateScreenSaga(
  action: ReturnType<typeof Actions.duplicateScreen>,
) {
  try {
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

    const screen = yield call(
      createScreenSaga,
      Actions.createScreen(projectID, name, screensNumber),
    );

    if (!screen) {
      throw new Error('Failed to create screen');
    }

    yield put(Actions.setScreenLoader(true));

    const targetRoot: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screen.id),
    );
    const targetRootID = targetRoot.id;

    yield put(Actions.setActiveElement(targetRootID));

    if (duplicatedItems.length) {
      yield call(duplicateElements, duplicatedItems, targetRoot, {
        screenId: screen.id,
        undo: true,
      });
    }

    yield put(Actions.setScreenLoader(false));
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

function* pasteCopiedElementSaga({
  type,
  meta,
}: ReturnType<typeof Actions.pasteCopiedElement>) {
  try {
    if (!meta) {
      console.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    const { screenId } = meta;

    const activeElementId: string = yield select(selectActiveElementId);

    const activeElement: LibraryElement<any> = yield select(
      selectElementAsTree(activeElementId),
    );

    const itemToCopyInfo: ItemToCopyInfo | null = yield select(
      selectItemToCopyInfo,
    );

    if (!itemToCopyInfo) {
      yield put(
        enqueueSnackbar({
          message: 'Nothing to paste',
          options: { variant: 'warning' },
        }),
      );
      return;
    }

    if (activeElement.type !== 'none') {
      const result = yield call(
        duplicateElements,
        [itemToCopyInfo],
        activeElement,
        {
          screenId,
        },
      );
      if (result) {
        yield put(
          enqueueSnackbar({
            message: 'Element pasted',
            options: { variant: 'success' },
          }),
        );
      }
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

function* undoSaga() {
  try {
    const history = yield select(selectHistory);
    const redos = yield select(selectRedoActions);
    const undos = yield select(selectUndoActions);

    if (!undos.length) {
      yield put(
        enqueueSnackbar({
          message: 'Nothing to undo.',
          options: { variant: 'info' },
        }),
      );
      return;
    }

    const last = undos[undos.length - 1];

    if (Array.isArray(last)) {
      if (last[0].meta?.screenId) {
        yield put(activateScreen(last[0].meta.screenId));
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
        yield put(activateScreen(last.meta.screenId));
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
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

function* redoSaga() {
  try {
    const redos = yield select(selectRedoActions);

    if (!redos.length) {
      yield put(
        enqueueSnackbar({
          message: 'Nothing to redo.',
          options: { variant: 'info' },
        }),
      );
      return;
    }

    const first = redos[0];

    if (Array.isArray(first)) {
      if (first[0].meta?.screenId) {
        yield put(activateScreen(first[0].meta.screenId));
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
        yield put(activateScreen(first.meta.screenId));
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
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

export default function* projectSaga() {
  yield takeLatest(TYPES.LOAD_PROJECTS, getProjectListSaga);
  yield takeLatest(TYPES.CREATE_PROJECT, createProjectSaga);
  yield takeLatest(TYPES.DELETE_PROJECT, deleteProjectSaga);
  yield takeLatest(TYPES.UPDATE_PROJECT, updateProjectSaga);
  yield takeLatest(TYPES.GET_PROJECT, getProjectSaga);
  yield takeLatest(TYPES.CHANGE_SCREENS_ORDER, changeScreensOrderSaga);
  yield takeLatest(TYPES.RENAME_PROJECT, renameProjectSaga);

  yield takeLatest(TYPES.ACTIVATE_SCREEN, activateScreenSaga);
  yield takeLatest(TYPES.CREATE_SCREEN, createScreenSaga);
  yield takeEvery(TYPES.DUPLICATE_SCREEN, duplicateScreenSaga);
  yield takeLatest(TYPES.SAVE_SCREEN, saveScreenImageSaga);
  yield takeLatest(TYPES.DELETE_SCREEN, deleteScreenSaga);
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
  yield takeLatest(TYPES.UPDATE_ELEMENT_IMAGE, updateElementImageSaga);
  yield takeLatest(TYPES.UPDATE_ELEMENT_PARAMETERS, updateElementParameters);

  yield takeEvery(TYPES.CREATE_ELEMENTS, createElementsSaga);

  yield takeEvery(TYPES.ADD_CHILD_TO_ELEMENT, addChildToElementSaga);
  yield takeEvery(TYPES.WRAP_INTO_CONTAINER, wrapIntoContainerSaga);

  yield takeEvery(TYPES.DELETE_ITEM, softDeleteSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT_CHILDREN, restoreElementChildrenSaga);
  yield takeEvery(TYPES.RESTORE_ELEMENT, restoreElementSaga);

  yield takeLatest(TYPES.COPY_ACTIVE_ELEMENT, copyActiveElementSaga);
  yield takeEvery(TYPES.PASTE_COPIED_ELEMENT, pasteCopiedElementSaga);

  yield takeLatest(TYPES.UPLOAD_FILE, uploadFileSaga);

  yield takeEvery(TYPES.UNDO_ACTION, undoSaga);
  yield takeEvery(TYPES.REDO_ACTION, redoSaga);
  yield takeEvery(TYPES.UNWRAP_FROM_CONTAINER, unwrapFromContainerSaga);
  yield takeEvery(TYPES.REDO_WRAP_INTO_CONTAINER, redoWrapIntoContainerSaga);
  yield takeEvery(TYPES.UPDATE_ELEMENT, updateElementSaga);
  yield takeLatest(TYPES.LOAD_CUSTOM_ELEMENTS, loadCustomElementsSaga);
  yield takeEvery(TYPES.SET_ACTIVE_ELEMENT_SAGA, setActiveElementSaga);
}
