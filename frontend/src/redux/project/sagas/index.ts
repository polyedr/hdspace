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
  restoreElementSaga, redoWrapIntoContainerSaga,
} from '$redux/project/sagas/scenario';
import {
  apiGetLibraryElements,
  apiSaveElements,
  parseImgUsingNN,
  apiChangeElement,
  apiChangeRecursiveElement,
} from '$api/element';
import { convertElementToRequest, convertElementToPatchRequest } from '$api/converters/toRequest';
import { LibraryElement, LibraryElementUnion } from '$api/types';
import { Entity } from '$domain/core';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { setRedoActions, setScreenLoader, setUndoActions } from '$redux/project/actions';
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
import { updateProjectClasses, removeProjectStyles, addProjectStyles } from '$utils/ProjectClassesHelper';
import * as PATH_NAMES from '$constants/pathNames';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { LibraryEntities } from '$domain/libraryElements/libraryElements';

import { ItemToCopyInfo } from '../types';
import { selectors, T as ProjectT, actionsCreators, T } from '../';

function* LocationChange({ payload: { location } }: LocationChangeAction) {
  const { user: { tokenPair } }: AppReduxState = yield select();

  if (tokenPair.access === ''
    && location.pathname !== PATH_NAMES.user.signup
    && location.pathname !== PATH_NAMES.user.signin
    && location.pathname !== PATH_NAMES.passwordRestore) {
    openSignScreen('signin');
  } else if (tokenPair.access !== ''
    && (location.pathname === PATH_NAMES.user.signin
    || location.pathname === PATH_NAMES.user.signup)) {
    openProjects();
  }
}

export function* reqWrapper(
  requestAction: (props: any) => Promise<any>,
  props: any = {},
  tries = 0,
): any {
  const { user: { tokenPair: { access } } }: AppReduxState = yield select();
  const result = yield call(requestAction as any, { access, ...props });

  if (R.path(['response', 'data', 'code'], result) === 'token_not_valid') {
    const { user: { isLoadedToken } }: AppReduxState = yield select();

    if (isLoadedToken) {
      yield put(setLoadedToken(false));
    } else {
      yield take('SET_LOADED_TOKEN');

      return yield call(reqWrapper, requestAction, props, tries + 1);
    }

    const token_result = yield call(refreshUserTokenPair);

    if (!token_result || token_result.msg || tries >= (MAX_TOKEN_TRIALS - 1)) {
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
  const result: ReturnPromisedType<typeof apiGetLibraryElements> = yield call(reqWrapper, apiGetLibraryElements);

  if (!result) return;

  // TODO: potentially inject default properties right here
  const libraryElements = result.reduce((acc, x) => ({
    ...acc,
    [x.struct_type]: x.func_type.reduce((innerAcc, funcType, idx) => ({
      ...innerAcc,
      [funcType]: {
        buoyancy: x.buoyancy[idx],
        func_type: funcType,
        struct_type: x.struct_type,
        parameters: x.parameters[idx] || {},
        styles: x.styles[idx] || {},
        name: x.struct_type,
      }
    }), {}),
  }), {}) as LibraryEntities;

  yield put(Actions.setLibraryElements(libraryElements));
}

function* moveElementSaga(action: ReturnType<typeof Actions.moveElement>): any {
  const { indices: { newIndex, oldIndex }, elementID, parentID, isRemote } = action.payload;
  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }
  const { undo, redo } = action.meta;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
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
      yield put(Actions.setUndoActions(Actions.moveElement({newIndex: oldIndex, oldIndex: newIndex}, elementID, parentID, false)));

      yield put(Actions.setRemoteMove(true))
    } else {
      const add = yield select(selectors.selectRemoteMove);

      yield put(Actions.setUndoActions(
        Actions.moveElement({newIndex: oldIndex, oldIndex: newIndex}, elementID, parentID, add),
      ));
      yield put(Actions.setRemoteMove(false))
    }
  }

  const updatedTree = moveElement(targetParent.id, elementToMove, root, newIndex);
  yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));

  yield put(Actions.setGroupActionsUp(!!isRemote));

  const updatedParent = findChildByID(updatedTree, parentID);

  if (!updatedParent) {
    console.error(`Can not find updatedParent ${parentID} in tree`);
    return;
  }

  const convertedElements = updatedParent.children.map(child => convertElementToPatchRequest(child));
  yield call(reqWrapper, apiSaveElements, { data: convertedElements });

  if (isRemote) return;

  !undo && document.querySelector<HTMLElement>(`[data-ls-id='${elementID}']`)?.focus();

  const elementData = {
    name: targetParent.name,
    children: [...targetParent.children.map(child => child.id), elementID],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: targetParent.id });
}

function* removeSharedStylesSaga(action: ReturnType<typeof Actions.removeSharedStyles>) {
  const { className, cssPropertiesNames } = action.payload;

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const newProject = removeProjectStyles(currentProject, className, cssPropertiesNames);

  yield call(updateProject, newProject);

  const { undo, redo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  yield put(Actions.updateElementsTree(root, action, { redo, undo }));
}

function* updateSharedStylesSaga(action: ReturnType<typeof Actions.updateSharedStyles>) {
  const { className, styles } = action.payload;

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const newProject = updateProjectClasses(currentProject, className, styles);

  yield call(updateProject, newProject);

  const { undo, redo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  yield put(Actions.updateElementsTree(root, action, { redo, undo }));
}

function* copyElementStylesSaga(action: ReturnType<typeof Actions.copyElementStyles>) {
  const { elementType, elementID, styles } = action.payload;

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const sharedClassNames = currentProject.projectData.classes.map(cssClass => cssClass.className);
  const uniqueClassName = generateUniqueName(`${elementType} group 1`, sharedClassNames);

  yield call(updateElementClassNames, elementID, uniqueClassName, action, 'add');

  const newProject = addProjectStyles(currentProject, uniqueClassName, elementType, styles as Required<CssLikeStyles>);
  yield call(updateProject, newProject);

  yield call(removeElementStyles, elementID, Object.keys(styles), action);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions([
      Actions.removeElementClassName(elementID, uniqueClassName),
      Actions.updateProject(currentProject),
      Actions.updateElementStyles(elementID, styles),
    ]));
  }
}

function* addElementClassNameSaga(action: ReturnType<typeof Actions.addElementClassName>) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'add');
}

function* removeElementClassNameSaga(action: ReturnType<typeof Actions.removeElementClassName>) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'remove');
}

function* updateElementClassNames(
  elementID: string,
  newClassName: string,
  action: ReturnType<typeof Actions.addElementClassName | typeof Actions.removeElementClassName | typeof Actions.copyElementStyles>,
  type: 'add' | 'remove',
) {
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const { undo, redo } = action.meta;

  if (!undo) {
    if (type === 'add') {
      yield put(Actions.setUndoActions(Actions.removeElementClassName(elementID, newClassName)));
    } else {
      yield put(Actions.setUndoActions(Actions.addElementClassName(elementID, newClassName)));
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
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id: elementID });
  }
}

function* updateElementStyles(action: ReturnType<typeof Actions.updateElementStyles>) {
  yield call(updateOrReplaceElementStyles, action, 'update');
}

function* replaceElementStylesSaga(action: ReturnType<typeof Actions.replaceElementStyles>) {
  yield call(updateOrReplaceElementStyles, action, 'replace');
}

function* updateOrReplaceElementStyles(
  action: ReturnType<typeof Actions.updateElementStyles | typeof Actions.replaceElementStyles>,
  type: 'replace' | 'update',
) {
  const { id, styles } = action.payload;

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const { undo, redo } = action.meta;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  if (!undo) {
    const oldStyles = yield select(selectors.selectElementStyles(id));
    yield put(Actions.setUndoActions(Actions.replaceElementStyles(id, oldStyles)));
  }

  const updatedTree = type === 'replace' ? replaceElementStyles(id, styles, root) : updateStyles(id, styles, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
    return;
  }
  yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));
  const convertedElement = convertElementToPatchRequest(updatedElement);
  yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
}

function* removeElementStyles(
  id: string,
  cssPropertiesNames: string[],
  action?: ReturnType<typeof Actions.removeElementStyles | typeof Actions.copyElementStyles>,
) {
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(
    selectors.selectRootElement
  );

  const updatedTree = removeStyles(id, cssPropertiesNames, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
  } else {
    const { undo, redo } = action?.meta;

    yield put(Actions.updateElementsTree(updatedTree, action, { redo, undo }));
    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
  }
}

function* removeElementStylesSaga(action: ReturnType<typeof Actions.removeElementStyles>) {
  const { id, cssPropertiesNames } = action.payload;

  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }

  const { undo } = action.meta;

  if (!undo) {
    const oldStyles = yield select(selectors.selectElementStyles(id));
    yield put(Actions.setUndoActions(Actions.updateElementStyles(id, oldStyles)));
  }

  yield call(removeElementStyles, id, cssPropertiesNames, action);
}

function* updateElementImage(action: ReturnType<typeof Actions.updateElementImage>) {
  const { itemID, image } = action.payload;

  const parsedID = parseInt(itemID, 10);
  const formData = new FormData();
  formData.append('image', new Blob([image]), image.name);

  const changedElement: ReturnPromisedType<typeof apiChangeElement> = yield call(reqWrapper, apiChangeElement, { data: formData, id: parsedID });

  yield put(Actions.updateElementParameters(itemID, {
    ...changedElement.parameters,
    imageURL: changedElement.image,
  }));
}

function* updateElementParameters(action: ReturnType<typeof Actions.updateElementParameters>) {
  const { itemID, parameters } = action.payload;
  if (!action.meta) {
    console.error(`You have to provide metainformation for action ${action.type}`);
    return;
  }
  const { undo, redo } = action.meta;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  if (!undo) {
    const oldParameters = yield select(selectors.selectElementParameters(itemID));
    yield put(Actions.setUndoActions(Actions.updateElementParameters(itemID, oldParameters)));
  }

  const updatedTree = updateParameters(itemID, parameters, root);
  const updatedElement = findChildByID(updatedTree, itemID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${itemID} in tree`);
  } else {
    const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
    yield put(Actions.updateSavedElementValues(itemID, savedValue));
    yield call(updateElementsTree, updatedTree, undo, action, { redo, undo });

    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id: itemID });
  }
}

function* uploadFileSaga({ payload: { file: { file } } }: ReturnType<typeof Actions.uploadFile>) {
  try {
    // TODO: show loader in addModalElements
    const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
      selectors.selectCurrentScreen,
    );
    const { id: currentScreenID } = currentScreen;

    const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

    const formData = new FormData();
    formData.append('image', new Blob([file]), file.name);
    formData.append('parent_id', root.id);
    formData.append('struct_type', 'container');
    formData.append('func_type', 'container');
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', currentScreenID.toString());
    formData.append('parameters', JSON.stringify({}));
    formData.append('styles', JSON.stringify({}));

    const nnRootElement: LibraryElement<'root'> = yield call(reqWrapper, parseImgUsingNN, {
      data: formData,
      contentType: 'multipart/form-data',
    });

    const nnRootWithDefaultParams = getTreeWithDefaultStylesAndParams(nnRootElement);

    const convertedElements = getElementsArray(nnRootWithDefaultParams)
      .map((element) => convertElementToPatchRequest(element));

    yield call(reqWrapper, apiSaveElements, { data: convertedElements });

    const updatedElements = moveElement(root.id, nnRootWithDefaultParams, root, 0);
    const childrenIds = updatedElements.children.map(child => child.id);
    yield put(Actions.setUndoActions(
      Actions.deleteItem(nnRootWithDefaultParams.id),
    ));

    yield call(updateElementsTree, updatedElements, false, Actions.restoreElementChildren(root.id, childrenIds));
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
  }
}

function* copyActiveItemSaga() {
  const { itemId: activeItemID }: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  if (activeItemID !== 'none') {
    yield put(actionsCreators.setItemToCopy(activeItemID, currentScreen.id));
  }
}

function* duplicateScreenSaga(action: ReturnType<typeof Actions.duplicateScreen>) {
  const { name } = action.payload;

  const sourceRoot: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  
  const sourceCurrentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const duplicatedItems = sourceRoot.children.map(child => ({ id: child.id, screenID: sourceCurrentScreen.id }));

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const projectID = currentProject.id;
  const screensNumber = currentProject.projectscreen.length;

  yield call(addScreenSaga, Actions.addScreen(projectID, name, screensNumber));
  yield put(setScreenLoader(true));
  
  const targetRoot: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const targetRootID = targetRoot.id;

  yield put(Actions.setActiveItem({ itemId: targetRootID, itemType: 'root', name: 'Root' }));
  yield call(duplicateItems, sourceRoot, duplicatedItems, targetRoot, true);
  yield put(setScreenLoader(false));
}

function* duplicateItems(
  sourceRoot: LibraryElement<Entity>,
  itemsToCopyInfo: ItemToCopyInfo[],
  targetParent: LibraryElement<Entity>,
  undo: boolean = false,
) {
  const itemsToDuplicate = itemsToCopyInfo.map(item => findChildByID(sourceRoot, item.id));
  const isItemsToDuplicateInTree = itemsToDuplicate.every(item => !!item);

  if (!isItemsToDuplicateInTree) {
    console.error(`Can not find duplicated items ${JSON.stringify(itemsToCopyInfo.map(item => item.id))} in tree`);
  } else {
    const convertedItemsToDuplicate = itemsToDuplicate.map(item => convertElementToRequest(item!));
    return yield call(createElements, convertedItemsToDuplicate, targetParent, undo);
  }
}

function* pasteCopiedItemSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const targetContainer = findChildByID(root, activeItem.itemId);

  if (!targetContainer) {
    console.error(`Can not find updated element ${activeItem.itemId} in tree`);
    return
  }
  const itemToCopyInfo: ReturnType<typeof selectors.selectItemToCopyInfo> = yield select(selectors.selectItemToCopyInfo);

  if (activeItem.itemType !== 'none' && itemToCopyInfo !== null) {
    yield call(duplicateItems, root, [itemToCopyInfo], targetContainer);
  }
}

function* undoSaga() {
  const history = yield select(selectors.selectHistory);
  const redos = yield select(selectors.selectRedoActions);
  const undos = yield select(selectors.selectUndoActions);

  if (!undos.length) {
    yield put(Actions.setNotification('Nothing to undo.'));
    return
  }

  const last = undos[undos.length - 1];

  if (Array.isArray(last)) {
    yield put(Actions.setGroupActionsUp(true));

    for (let undo of last.reverse()) {
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

  yield put(setRedoActions([
    history[history.length - 1],
    ...redos,
  ]));

  const { itemType, itemId }: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  document.querySelector<HTMLElement>(`[data-ls-id='${itemType === 'root' ? 'root' : itemId}']`)?.focus();
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

    for (let redo of first) {
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

  yield put(setRedoActions([
    ...redos.slice(1),
  ]));

  const { itemType, itemId }: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  document.querySelector<HTMLElement>(`[data-ls-id='${itemType === 'root' ? 'root' : itemId}']`)?.focus();
}

const loadProjectsType: ProjectT.LoadProjects['type'] = 'PROJECTS:LOAD_PROJECTS';
const addProjectType: ProjectT.AddProject['type'] = 'PROJECTS:ADD_PROJECT';
const deleteProjectType: ProjectT.DeleteProject['type'] = 'PROJECTS:DELETE_PROJECT';
const updateProjectType: ProjectT.UpdateProject['type'] = 'PROJECTS:UPDATE_PROJECT';
const getProjectType: ProjectT.GetProject['type'] = 'PROJECTS:GET_PROJECT';
const exportProjectType: ProjectT.ExportProject['type'] = 'PROJECTS:EXPORT_PROJECT';
const changeScreensOrderType: ProjectT.ChangeScreensOrder['type'] = 'PROJECTS:CHANGE_SCREENS_ORDER';
const renameProjectType: ProjectT.RenameProject['type'] = 'PROJECTS:RENAME_PROJECT';
const activateScreenType: ProjectT.ActivateScreen['type'] = 'PROJECTS:ACTIVATE_SCREEN';
const addScreenType: ProjectT.AddScreen['type'] = 'PROJECTS:ADD_SCREEN';
const duplicateScreenType: ProjectT.DuplicateScreen['type'] = 'PROJECTS:DUPLICATE_SCREEN';
const saveScreenType: ProjectT.SaveScreen['type'] = 'PROJECTS:SAVE_SCREEN';
const deleteScreenType: ProjectT.DeleteScreen['type'] = 'PROJECTS:DELETE_SCREEN';
const renameScreenType: ProjectT.RenameScreen['type'] = 'PROJECTS:RENAME_SCREEN';
const moveElementType: ProjectT.MoveElement['type'] = 'PROJECTS:MOVE_ELEMENT';
const removeSharedStylesType: ProjectT.RemoveSharedStyles['type'] = 'PROJECTS:REMOVE_SHARED_STYLES';
const updateSharedStylesType: ProjectT.UpdateSharedStyles['type'] = 'PROJECTS:UPDATE_SHARED_STYLES';
const removeElementStylesType: ProjectT.RemoveElementStyles['type'] = 'PROJECTS:REMOVE_ELEMENT_STYLES';
const updateElementStylesType: ProjectT.UpdateElementStyles['type'] = 'PROJECTS:UPDATE_ELEMENT_STYLES';
const replaceElementStylesType: ProjectT.ReplaceElementStyles['type'] = 'PROJECTS:REPLACE_ELEMENT_STYLES';
const copyElementStylesType: ProjectT.CopyElementStyles['type'] = 'PROJECTS:COPY_ELEMENT_STYLES';
const addElementClassNameType: ProjectT.AddElementClassName['type'] = 'PROJECTS:ADD_ELEMENT_CLASSNAME';
const removeElementClassNameType: ProjectT.RemoveElementClassName['type'] = 'PROJECTS:REMOVE_ELEMENT_CLASSNAME';
const updateElementParametersType: ProjectT.UpdateElementParameters['type'] = 'PROJECTS:UPDATE_ELEMENT_PARAMETERS';
const updateElementImageType: ProjectT.UpdateElementImage['type'] = 'PROJECTS:UPDATE_ELEMENT_IMAGE';
const createElementsType: ProjectT.CreateElements['type'] = 'PROJECTS:CREATE_ELEMENTS';
const renameElementType: ProjectT.RenameElement['type'] = 'PROJECTS:RENAME_ELEMENT';
const addChildToElementType: ProjectT.AddChildToElement['type'] = 'PROJECTS:ADD_CHILD_TO_ELEMENT';
const deleteChildFromElementType: ProjectT.DeleteChildFromElement['type'] = 'PROJECTS:DELETE_CHILD_FROM_ELEMENT';
const wrapIntoContainerType: ProjectT.WrapIntoContainer['type'] = 'PROJECTS:WRAP_INTO_CONTAINER';
const deleteItemType: ProjectT.DeleteItem['type'] = 'PROJECTS:DELETE_ITEM';
const uploadFileType: ProjectT.UploadFile['type'] = 'PROJECTS:UPLOAD_FILE';
const getScreenNNType: ProjectT.GetScreenNN['type'] = 'PROJECTS:GET_SCREEN_NN';
const copyActiveItemType: ProjectT.CopyActiveItem['type'] = 'PROJECTS:COPY_ACTIVE_ITEM';
const pasteCopiedItemType: ProjectT.PasteCopiedItem['type'] = 'PROJECTS:PASTE_COPIED_ITEM';
const unwrapFromContainerType: ProjectT.UnwrapFromContainer['type'] = 'PROJECTS:UNWRAP_FROM_CONTAINER';
const undoActionType: ProjectT.UndoAction['type'] = 'UNDO_ACTION';
const redoActionType: ProjectT.RedoAction['type'] = 'REDO_ACTION';
const restoreElementType: ProjectT.RestoreElementChildren['type'] = 'PROJECTS:RESTORE_ELEMENT_CHILDREN';
const redoWrapIntoContainerType: ProjectT.RedoWrapIntoContainer['type'] = 'PROJECTS:REDO_WRAP_INTO_CONTAINER';

export default function* projectSaga() {
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(loadProjectsType, getListProjectSaga);
  yield takeLatest(addProjectType, addProject);
  yield takeLatest(deleteProjectType, delProjectSaga);
  yield takeLatest(updateProjectType, updateProjectSaga);
  yield takeLatest(getProjectType, getProjectSaga);
  yield takeLatest(exportProjectType, exportProjectSaga);
  yield takeLatest(changeScreensOrderType, changeScreensOrderSaga);
  yield takeLatest(renameProjectType, renameProjectSaga);

  yield takeLatest(activateScreenType, screenSaga.activateScreenSaga);
  yield takeLatest(addScreenType, screenSaga.addScreenSaga);
  yield takeEvery(duplicateScreenType, duplicateScreenSaga);
  yield takeLatest(saveScreenType, screenSaga.saveScreenSaga);
  yield takeLatest(deleteScreenType, screenSaga.delScreenSaga);
  yield takeLatest(renameScreenType, screenSaga.renameScreenSaga);
  yield takeEvery(moveElementType, moveElementSaga);

  yield takeLatest(removeSharedStylesType, removeSharedStylesSaga);
  yield takeLatest(updateSharedStylesType, updateSharedStylesSaga);
  yield takeLatest(removeElementStylesType, removeElementStylesSaga);
  yield takeLatest(updateElementStylesType, updateElementStyles);
  yield takeLatest(replaceElementStylesType, replaceElementStylesSaga);
  yield takeLatest(copyElementStylesType, copyElementStylesSaga);
  yield takeLatest(addElementClassNameType, addElementClassNameSaga);
  yield takeLatest(removeElementClassNameType, removeElementClassNameSaga);
  yield takeLatest(updateElementImageType, updateElementImage);
  yield takeLatest(updateElementParametersType, updateElementParameters);

  yield takeEvery(createElementsType, createElementsSaga);
  yield takeEvery(renameElementType, renameElementSaga);

  yield takeEvery(addChildToElementType, addChildToElementSaga);
  yield takeEvery(deleteChildFromElementType, softDeleteSaga);
  yield takeEvery(wrapIntoContainerType, wrapIntoContainerSaga);

  yield takeEvery(deleteItemType, softDeleteSaga);
  yield takeEvery(restoreElementType, restoreElementSaga);

  yield takeLatest(copyActiveItemType, copyActiveItemSaga);
  yield takeEvery(pasteCopiedItemType, pasteCopiedItemSaga);

  yield takeLatest(uploadFileType, uploadFileSaga);
  yield takeLatest(getScreenNNType, screenSaga.getScreenNNSaga);

  yield takeEvery(undoActionType, undoSaga);
  yield takeEvery(redoActionType, redoSaga);
  yield takeEvery(unwrapFromContainerType, unwrapFromContainerSaga);
  yield takeEvery(redoWrapIntoContainerType, redoWrapIntoContainerSaga);
}
