/* eslint-disable camelcase, no-console */

import {
  takeLatest,
  takeEvery,
  put,
  call,
  take,
  select,
} from 'redux-saga/effects';
import * as R from 'ramda';
import { REHYDRATE } from 'redux-persist';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { AppReduxState } from '$shared/types/app';
import { ReturnPromisedType } from '$shared/types';
import * as Actions from '$redux/project/actions';
import * as screenSaga from '$redux/project/sagas/screen';
import {
  getListProjectSaga,
  addProject,
  delProjectSaga,
  getProjectSaga,
  changeScreensOrderSaga,
  renameProjectSaga,
  exportProjectSaga,
  updateProject,
  updateProjectSaga,
} from '$redux/project/sagas/project';
import {
  wrapIntoContainerSaga,
  addChildToElementSaga,
  createElementsSaga,
  createElements,
  updateElementsTree,
  renameElementSaga,
  unwrapFromContainerSaga,
  softDeleteSaga,
  restoreElementSaga,
  redoWrapIntoContainerSaga,
} from '$redux/project/sagas/scenario';
import {
  apiGetLibraryElements,
  apiSaveElements,
  parseImgUsingNN,
  apiChangeElement,
  apiChangeRecursiveElement,
} from '$api/element';
import {
  convertElementToRequest,
  convertElementToPatchRequest,
} from '$api/converters/toRequest';
import { LibraryElement, LibraryElementUnion } from '$api/types';
import { Entity } from '$domain/core';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { addScreenSaga } from '$redux/project/sagas/screen';
import { refreshUserTokenPair } from '$redux/user/sagas';
import { openSignScreen, openProjects } from '$utils/history';
import { getSavedValue } from '$utils/getSavedValue';
import {
  findChildByID,
  updateElementParameters as updateParameters,
  moveElement,
  updateElementStyles as updateStyles,
  removeElementStyles as removeStyles,
  getElementsArray,
  getTreeWithDefaultStylesAndParams,
  addElementClassName,
  removeElementClassName,
  replaceElementStyles,
} from '$utils/ElementsTreeHelper';
import { generateUniqueName } from '$utils/generateUniqueName';
import { CssLikeStyles } from '$utils/StyleHelper';
import {
  updateProjectClasses,
  removeProjectStyles,
  addProjectStyles,
} from '$utils/ProjectClassesHelper';
import * as PATH_NAMES from '$constants/pathNames';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { LibraryEntities } from '$domain/libraryElements/libraryElements';

import { ItemToCopyInfo } from '../types';
import { selectors, actionsCreators } from '..';
import { TYPES } from '$constants/actions';

function* LocationChange({ payload: { location } }: LocationChangeAction) {
  const {
    user: { tokenPair },
  }: AppReduxState = yield select();

  if (
    tokenPair.access === '' &&
    location.pathname !== PATH_NAMES.user.signup &&
    location.pathname !== PATH_NAMES.user.signin &&
    location.pathname !== PATH_NAMES.passwordRestore
  ) {
    openSignScreen('signin');
  } else if (
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

function* authCheckSaga() {
  // TODO: temporary realisation
  const result: ReturnPromisedType<typeof apiGetLibraryElements> = yield call(
    reqWrapper,
    apiGetLibraryElements,
  );

  if (!result) return;

  // TODO: potentially inject default properties right here
  const libraryElements = result.reduce(
    (acc, x) => ({
      ...acc,
      [x.struct_type]: x.func_type.reduce(
        (innerAcc, funcType, idx) => ({
          ...innerAcc,
          [funcType]: {
            buoyancy: x.buoyancy[idx],
            func_type: funcType,
            struct_type: x.struct_type,
            parameters: x.parameters[idx] || {},
            styles: x.styles[idx] || {},
            name: x.struct_type,
          },
        }),
        {},
      ),
    }),
    {},
  ) as LibraryEntities;

  yield put(Actions.setLibraryElements(libraryElements));
}

function* moveElementSaga(action: ReturnType<typeof Actions.moveElement>): any {
  const {
    indices: { newIndex, oldIndex },
    elementID,
    parentID,
    isRemote,
    screenId,
  } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { undo, redo } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenElement(screenId),
  );
  const targetParent = findChildByID(root, parentID);

  if (!targetParent) {
    console.error(`Can not find targetParent ${parentID} in tree`);
    return;
  }

  const elementToMove = findChildByID(root, elementID);

  if (!elementToMove) {
    console.error(`Can not find changedElement ${elementID} in tree`);
    return;
  }

  // we can get rid of this code block when we will get better Sortable.js implementation
  if (!undo) {
    if (isRemote) {
      yield put(
        Actions.setUndoActions(
          Actions.moveElement(
            { newIndex: oldIndex, oldIndex: newIndex },
            elementID,
            parentID,
            false,
            screenId,
          ),
        ),
      );

      yield put(Actions.setRemoteMove(true));
    } else {
      const add = yield select(selectors.selectRemoteMove);

      yield put(
        Actions.setUndoActions(
          Actions.moveElement(
            { newIndex: oldIndex, oldIndex: newIndex },
            elementID,
            parentID,
            add,
            screenId,
          ),
        ),
      );
      yield put(Actions.setRemoteMove(false));
    }
  }

  const updatedTree = moveElement(
    targetParent.id,
    elementToMove,
    root,
    newIndex,
  );
  yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));

  yield put(Actions.setGroupActionsUp(isRemote));

  const updatedParent = findChildByID(updatedTree, parentID);

  if (!updatedParent) {
    console.error(`Can not find updatedParent ${parentID} in tree`);
    return;
  }

  const convertedElements = updatedParent.children.map((child) =>
    convertElementToPatchRequest(child),
  );
  yield call(reqWrapper, apiSaveElements, { data: convertedElements });

  if (isRemote) return;

  if (!undo) {
    document.querySelector<HTMLElement>(`[data-ls-id='${elementID}']`)?.focus();
  }

  const elementData = {
    name: targetParent.name,
    children: [...targetParent.children.map((child) => child.id), elementID],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: elementData,
    id: targetParent.id,
  });
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

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const newProject = removeProjectStyles(
    currentProject,
    className,
    cssPropertiesNames,
  );

  yield call(updateProject, newProject);

  const { undo, redo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(
    selectors.selectRootElement,
  );

  yield put(Actions.updateElementsTree(root, action, { redo, undo }));
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

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const newProject = updateProjectClasses(currentProject, className, styles);

  yield call(updateProject, newProject);

  const { undo, redo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(
    selectors.selectRootElement,
  );

  yield put(Actions.updateElementsTree(root, action, { redo, undo }));
}

function* updateElementClassNames(
  elementID: string,
  newClassName: string,
  action: ReturnType<
    | typeof Actions.addElementClassName
    | typeof Actions.removeElementClassName
    | typeof Actions.copyElementStyles
  >,
  type: 'add' | 'remove',
) {
  const { screenId } = action.payload;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenElement(screenId),
  );

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { undo, redo } = action.meta;

  if (!undo) {
    if (type === 'add') {
      yield put(
        Actions.setUndoActions(
          Actions.removeElementClassName(elementID, newClassName, screenId),
        ),
      );
    } else {
      yield put(
        Actions.setUndoActions(
          Actions.addElementClassName(elementID, newClassName, screenId),
        ),
      );
    }
  }

  const updatedTree =
    type === 'add'
      ? addElementClassName(elementID, newClassName, root)
      : removeElementClassName(elementID, newClassName, root);

  const updatedElement = findChildByID(updatedTree, elementID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${elementID} in tree`);
  } else {
    yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));
    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, {
      data: convertedElement,
      id: elementID,
    });
  }
}

function* removeElementStyles(
  id: string,
  cssPropertiesNames: string[],
  action: ReturnType<
    typeof Actions.removeElementStyles | typeof Actions.copyElementStyles
  >,
) {
  const { screenId } = action.payload;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenElement(screenId),
  );

  const updatedTree = removeStyles(id, cssPropertiesNames, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
  } else {
    yield put(Actions.updateElementsTree(updatedTree, action, action.meta));
    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
  }
}

function* copyElementStylesSaga(
  action: ReturnType<typeof Actions.copyElementStyles>,
) {
  const { elementType, elementID, styles, screenId } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );

  const sharedClassNames = currentProject.projectData.classes.map(
    (cssClass) => cssClass.className,
  );
  const uniqueClassName = generateUniqueName(
    `${elementType} group 1`,
    sharedClassNames,
  );

  yield call(
    updateElementClassNames,
    elementID,
    uniqueClassName,
    action,
    'add',
  );

  const newProject = addProjectStyles(
    currentProject,
    uniqueClassName,
    elementType,
    styles as Required<CssLikeStyles>,
  );
  yield call(updateProject, newProject);

  yield call(removeElementStyles, elementID, Object.keys(styles), action);

  const { undo } = action.meta;

  if (!undo) {
    yield put(
      Actions.setUndoActions([
        Actions.removeElementClassName(elementID, uniqueClassName, screenId),
        Actions.updateProject(currentProject),
        Actions.updateElementStyles(elementID, styles, screenId),
      ]),
    );
  }
}

function* addElementClassNameSaga(
  action: ReturnType<typeof Actions.addElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'add');
}

function* removeElementClassNameSaga(
  action: ReturnType<typeof Actions.removeElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'remove');
}

function* updateOrReplaceElementStyles(
  action: ReturnType<
    typeof Actions.updateElementStyles | typeof Actions.replaceElementStyles
  >,
  type: 'replace' | 'update',
) {
  const { id, styles, screenId } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { undo, redo } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenElement(screenId),
  );

  if (!undo) {
    const oldStyles = yield select(selectors.selectElementStyles(screenId, id));
    yield put(
      Actions.setUndoActions(
        Actions.replaceElementStyles(id, oldStyles, screenId),
      ),
    );
  }

  const updatedTree =
    type === 'replace'
      ? replaceElementStyles(id, styles, root)
      : updateStyles(id, styles, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
    return;
  }
  yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));

  const convertedElement = convertElementToPatchRequest(updatedElement);
  yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
}

function* updateElementStyles(
  action: ReturnType<typeof Actions.updateElementStyles>,
) {
  yield call(updateOrReplaceElementStyles, action, 'update');
}

function* replaceElementStylesSaga(
  action: ReturnType<typeof Actions.replaceElementStyles>,
) {
  yield call(updateOrReplaceElementStyles, action, 'replace');
}

function* removeElementStylesSaga(
  action: ReturnType<typeof Actions.removeElementStyles>,
) {
  const { id, cssPropertiesNames, screenId } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { undo } = action.meta;

  if (!undo) {
    const oldStyles = yield select(selectors.selectElementStyles(screenId, id));
    yield put(
      Actions.setUndoActions(
        Actions.updateElementStyles(id, oldStyles, screenId),
      ),
    );
  }

  yield call(removeElementStyles, id, cssPropertiesNames, action);
}

function* updateElementImage(
  action: ReturnType<typeof Actions.updateElementImage>,
) {
  const { itemID, image, screenId } = action.payload;

  const parsedID = parseInt(itemID);
  const formData = new FormData();
  formData.append('image', new Blob([image]), image.name);

  const changedElement: ReturnPromisedType<typeof apiChangeElement> = yield call(
    reqWrapper,
    apiChangeElement,
    { data: formData, id: parsedID },
  );

  yield put(
    Actions.updateElementParameters(
      itemID,
      {
        ...changedElement.parameters,
        imageURL: changedElement.image,
      },
      screenId,
    ),
  );
}

function* updateElementParameters(
  action: ReturnType<typeof Actions.updateElementParameters>,
) {
  const { itemID, parameters, screenId } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { undo, redo } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenElement(screenId),
  );

  if (!undo) {
    const oldParameters = yield select(
      selectors.selectElementParameters(screenId, itemID),
    );
    yield put(
      Actions.setUndoActions(
        Actions.updateElementParameters(itemID, oldParameters, screenId),
      ),
    );
  }

  const updatedTree = updateParameters(itemID, parameters, root);
  const updatedElement = findChildByID(updatedTree, itemID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${itemID} in tree`);
  } else {
    const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
    yield put(Actions.updateSavedElementValues(itemID, savedValue));
    yield call(updateElementsTree, updatedTree, action, { redo, undo });

    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, {
      data: convertedElement,
      id: itemID,
    });
  }
}

function* uploadFileSaga({
  payload: { file, screenId },
}: ReturnType<typeof Actions.uploadFile>) {
  try {
    // TODO: show loader in addModalElements
    const root: LibraryElement<'root'> = yield select(
      selectors.selectScreenElement(screenId),
    );

    const formData = new FormData();
    formData.append('image', new Blob([file]), file.name);
    formData.append('parent_id', root.id);
    formData.append('struct_type', 'container');
    formData.append('func_type', 'container');
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', screenId.toString());
    formData.append('parameters', JSON.stringify({}));
    formData.append('styles', JSON.stringify({}));

    const nnRootElement: LibraryElement<'root'> = yield call(
      reqWrapper,
      parseImgUsingNN,
      {
        data: formData,
        contentType: 'multipart/form-data',
      },
    );

    const nnRootWithDefaultParams = getTreeWithDefaultStylesAndParams(
      nnRootElement,
    );

    const convertedElements = getElementsArray(
      nnRootWithDefaultParams,
    ).map((element) => convertElementToPatchRequest(element));

    yield call(reqWrapper, apiSaveElements, { data: convertedElements });

    const updatedElements = moveElement(
      root.id,
      nnRootWithDefaultParams,
      root,
      0,
    );
    const childrenIds = updatedElements.children.map((child) => child.id);
    yield put(
      Actions.setUndoActions(
        Actions.deleteItem(nnRootWithDefaultParams.id, screenId),
      ),
    );

    yield call(
      updateElementsTree,
      updatedElements,
      Actions.restoreElementChildren(root.id, childrenIds, screenId),
    );
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
  }
}

function* copyActiveItemSaga() {
  const {
    itemId: activeItemID,
  }: ReturnType<typeof selectors.selectActiveItem> = yield select(
    selectors.selectActiveItem,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );
  if (activeItemID !== 'none') {
    yield put(actionsCreators.setItemToCopy(activeItemID, currentScreen.id));
  }
}

function* duplicateItems(
  sourceRoot: LibraryElement<Entity>,
  itemsToCopyInfo: ItemToCopyInfo[],
  targetParent: LibraryElement<Entity>,
  screenId: number,
  undo: boolean = false,
) {
  const itemsToDuplicate = itemsToCopyInfo.map((item) =>
    findChildByID(sourceRoot, item.id),
  );
  const isItemsToDuplicateInTree = itemsToDuplicate.every((item) => !!item);

  if (!isItemsToDuplicateInTree) {
    console.error(
      `Can not find duplicated items ${JSON.stringify(
        itemsToCopyInfo.map((item) => item.id),
      )} in tree`,
    );
    return;
  }

  const convertedItemsToDuplicate = itemsToDuplicate.map((item) =>
    convertElementToRequest(item!),
  );

  yield call(
    createElements,
    convertedItemsToDuplicate,
    targetParent,
    screenId,
    undo,
  );
}

function* duplicateScreenSaga(
  action: ReturnType<typeof Actions.duplicateScreen>,
) {
  const { name, screenID } = action.payload;

  const sourceRoot = yield select(selectors.selectScreenElement(screenID));

  const sourceCurrentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const duplicatedItems = sourceRoot.children.map((child: any) => ({
    // TODO: fix types
    id: child.id,
    screenID: sourceCurrentScreen.id,
  }));

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const projectID = currentProject.id;
  const screensNumber = currentProject.projectscreen.length;

  const { id: newScreenId } = yield call(
    addScreenSaga,
    Actions.addScreen(projectID, name, screensNumber),
  );
  yield put(Actions.setScreenLoader(true));

  const targetRoot = yield select(selectors.selectScreenElement(newScreenId));
  const targetRootID = targetRoot.id;

  yield put(
    Actions.setActiveItem({
      itemId: targetRootID,
      itemType: 'root',
      name: 'Root',
    }),
  );

  yield call(
    duplicateItems,
    sourceRoot,
    duplicatedItems,
    targetRoot,
    newScreenId,
    true,
  );
  yield put(Actions.setScreenLoader(false));
}

function* pasteCopiedItemSaga({
  payload: { screenId },
}: ReturnType<typeof Actions.pasteCopiedItem>) {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(
    selectors.selectActiveItem,
  );
  const root = yield select(selectors.selectScreenElement(screenId));
  const targetContainer = findChildByID(root, activeItem.itemId);

  if (!targetContainer) {
    console.error(`Can not find updated element ${activeItem.itemId} in tree`);
    return;
  }
  const itemToCopyInfo: ReturnType<typeof selectors.selectItemToCopyInfo> = yield select(
    selectors.selectItemToCopyInfo,
  );

  if (activeItem.itemType !== 'none' && itemToCopyInfo !== null) {
    yield call(
      duplicateItems,
      root,
      [itemToCopyInfo],
      targetContainer,
      screenId,
    );
  }
}

function* undoSaga() {
  const history = yield select(selectors.selectHistory);
  const redos = yield select(selectors.selectRedoActions);
  const undos = yield select(selectors.selectUndoActions);

  if (!undos.length) {
    yield put(Actions.setNotification('Nothing to undo.'));
    return;
  }

  const last = undos[undos.length - 1];

  if (Array.isArray(last)) {
    yield put(Actions.setGroupActionsUp(true));

    // eslint-disable-next-line no-restricted-syntax
    for (const undo of last.reverse()) {
      yield put({
        ...undo,
        meta: {
          undo: true,
        },
      });
    }

    yield put(Actions.setGroupActionsUp(false));
  } else {
    yield put({
      ...last,
      meta: {
        undo: true,
      },
    });
  }

  yield put(Actions.popUndoAction());
  yield put(Actions.popHistory());

  yield put(Actions.setRedoActions([history[history.length - 1], ...redos]));

  const {
    itemType,
    itemId,
  }: ReturnType<typeof selectors.selectActiveItem> = yield select(
    selectors.selectActiveItem,
  );
  document
    .querySelector<HTMLElement>(
      `[data-ls-id='${itemType === 'root' ? 'root' : itemId}']`,
    )
    ?.focus();
}

function* redoSaga() {
  const redos = yield select(selectors.selectRedoActions);

  if (!redos.length) {
    yield put(Actions.setNotification('Nothing to redo.'));
    return;
  }
  const first = redos[0];

  if (Array.isArray(first)) {
    yield put(Actions.setGroupActionsUp(true));

    // eslint-disable-next-line no-restricted-syntax
    for (const redo of first) {
      yield put({
        ...redo,
        meta: {
          redo: true,
        },
      });
    }

    yield put(Actions.setGroupActionsUp(false));
  } else {
    yield put({
      ...first,
      meta: {
        redo: true,
      },
    });
  }

  yield put(Actions.setRedoActions([...redos.slice(1)]));

  const {
    itemType,
    itemId,
  }: ReturnType<typeof selectors.selectActiveItem> = yield select(
    selectors.selectActiveItem,
  );
  document
    .querySelector<HTMLElement>(
      `[data-ls-id='${itemType === 'root' ? 'root' : itemId}']`,
    )
    ?.focus();
}

export default function* projectSaga() {
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(TYPES.LOAD_PROJECTS, getListProjectSaga);
  yield takeLatest(TYPES.ADD_PROJECT, addProject);
  yield takeLatest(TYPES.DELETE_PROJECT, delProjectSaga);
  yield takeLatest(TYPES.UPDATE_PROJECT, updateProjectSaga);
  yield takeLatest(TYPES.GET_PROJECT, getProjectSaga);
  yield takeLatest(TYPES.EXPORT_PROJECT, exportProjectSaga);
  yield takeLatest(TYPES.CHANGE_SCREENS_ORDER, changeScreensOrderSaga);
  yield takeLatest(TYPES.RENAME_PROJECT, renameProjectSaga);

  yield takeLatest(TYPES.ACTIVATE_SCREEN, screenSaga.activateScreenSaga);
  yield takeLatest(TYPES.ADD_SCREEN, screenSaga.addScreenSaga);
  yield takeEvery(TYPES.DUPLICATE_SCREEN, duplicateScreenSaga);
  yield takeLatest(TYPES.SAVE_SCREEN, screenSaga.saveScreenImageSaga);
  yield takeLatest(TYPES.DELETE_SCREEN, screenSaga.delScreenSaga);
  yield takeEvery(TYPES.RESTORE_SCREEN, screenSaga.restoreScreenSaga);
  yield takeLatest(TYPES.RENAME_SCREEN, screenSaga.renameScreenSaga);
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
  yield takeEvery(TYPES.RESTORE_ELEMENT_CHILDREN, restoreElementSaga);

  yield takeLatest(TYPES.COPY_ACTIVE_ITEM, copyActiveItemSaga);
  yield takeEvery(TYPES.PASTE_COPIED_ITEM, pasteCopiedItemSaga);

  yield takeLatest(TYPES.UPLOAD_FILE, uploadFileSaga);
  yield takeLatest(TYPES.GET_SCREEN_NN, screenSaga.getScreenNNSaga);

  yield takeEvery(TYPES.UNDO_ACTION, undoSaga);
  yield takeEvery(TYPES.REDO_ACTION, redoSaga);
  yield takeEvery(TYPES.UNWRAP_FROM_CONTAINER, unwrapFromContainerSaga);
  yield takeEvery(TYPES.REDO_WRAP_INTO_CONTAINER, redoWrapIntoContainerSaga);
}
