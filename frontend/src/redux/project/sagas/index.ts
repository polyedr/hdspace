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
} from '$redux/project/sagas/project';
import {
  deleteActiveItemSaga,
  wrapIntoContainerSaga,
  addChildToElementSaga,
  deleteChildFromElementSaga,
  createElementsSaga,
  createElements,
  addElementToElement,
  updateElementsTree,
  renameElementSaga,
} from '$redux/project/sagas/scenario';
import {
  apiGetLibraryElements,
  apiSaveElements,
  parseImgUsingNN,
  apiChangeElement,
  apiChangeRecursiveElement,
} from '$api/element';
import { apiSaveScenarios } from '$api/scenario';
import { convertElementToRequest, convertElementToPatchRequest, convertProjectToPatchRequest } from '$api/converters/toRequest';
import { LibraryElement, LibraryElementUnion } from '$api/types';
import { Entity } from '$domain/core';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { setScreenLoader } from '$redux/project/actions';
import { addScreenSaga } from '$redux/project/sagas/screen';
import { refreshUserTokenPair } from '$redux/user/sagas';
import { openSignScreen, openProjects } from '$utils/history';
import { getSavedValue } from '$utils/getSavedValue';
import {
  findChildByID,
  updateElementParameters as updateParameters,
  moveElement,
  updateElementStyles as updateStyles,
  getElementsArray,
  getTreeWithDefaultStylesAndParams,
} from '$utils/ElementsTreeHelper';
import { CssLikeStyles } from '$utils/StyleHelper';
import * as PATH_NAMES from '$constants/pathNames';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { LibraryEntities } from '$domain/libraryElements/libraryElements';
import { apiSaveProject } from '$api/project';

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

function* moveElementSaga(action: ReturnType<typeof Actions.moveElement>) {
  const { elementID, elementIndex, parentID } = action.payload;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const targetParent = findChildByID(root, parentID);

  if (!targetParent) {
    console.error(`Can not find targetParent ${parentID} in tree`);
  } else {
    const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
    const elementToMove = findChildByID(root, elementID);

    if (!elementToMove) {
      console.error(`Can not find changedElement ${elementID} in tree`);
      return;
    }

    const updatedTree = moveElement(targetParent.id, elementToMove, root, elementIndex);
    yield put(Actions.updateElementsTree(updatedTree));

    const updatedParent = findChildByID(updatedTree, parentID);

    if (!updatedParent) {
      console.error(`Can not find updatedParent ${parentID} in tree`);
      return;
    }

    const convertedElements = updatedParent.children.map(child => convertElementToPatchRequest(child));
    yield call(reqWrapper, apiSaveElements, { data: convertedElements });

    const elementData = {
      name: targetParent.name,
      children: [...targetParent.children.map(child => child.id), elementID],
    };

    yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: targetParent.id });
  }
}

export function* updateScenariosOnServerSaga(scenarios: ProjectT.IScenarios) {
  yield call(reqWrapper, apiSaveScenarios, { data: R.values(scenarios) });
}

export function* updateElementsOnServerSaga(elements: ProjectT.IScenarioElements) {
  yield call(reqWrapper, apiSaveElements, { data: R.values(elements).map(element => R.omit(['children'], element)) });
}

function* removeSharedStylesSaga(action: ReturnType<typeof Actions.removeSharedStyles>) {
  const { className, ruleName: removedRuleName } = action.payload;

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const newProject = {
    ...currentProject,
    projectData: {
      ...currentProject.projectData,
      classes: currentProject.projectData.classes.map((cssClass) => {
        
        return cssClass.name === className
          ? {
              ...cssClass,
              rules: (R.toPairs(cssClass.rules) as [string, string])
                .filter(([ruleName]) => ruleName !== removedRuleName)
                .reduce(
                  (acc, [ruleName, rule]) => ({ ...acc, [ruleName]: rule }),
                  {} as CssLikeStyles
                ),
            }
          : cssClass;
      }),
    },
  };

  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);

  const newListProject = listProject.map((project) => {
    if (project.id === currentProject.id) {
      return {
        ...project,
        name: name,
      };
    }

    return project;
  });

  yield put(Actions.setListProject(newListProject));
  yield put(Actions.setProject(newProject));
  

  const convertedProject = convertProjectToPatchRequest(newProject);
  yield call(reqWrapper, apiSaveProject, { data: convertedProject });
}

function* updateSharedStylesSaga(action: ReturnType<typeof Actions.updateSharedStyles>) {
  const { className, styles } = action.payload;

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const newProject = {
    ...currentProject,
    projectData: {
      ...currentProject.projectData,
      classes: currentProject.projectData.classes.map(cssClass => (
        cssClass.name === className ? { ...cssClass, rules: { ...cssClass.rules, ...styles } } : cssClass)),
  }};

  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);

  const newListProject = listProject.map((project) => {
    if (project.id === currentProject.id) {
      return {
        ...project,
        name: name,
      };
    }

    return project;
  });

  yield put(Actions.setListProject(newListProject));
  yield put(Actions.setProject(newProject));
  

  const convertedProject = convertProjectToPatchRequest(newProject);
  yield call(reqWrapper, apiSaveProject, { data: convertedProject });
}

function* updateElementStyles(action: ReturnType<typeof Actions.updateElementStyles>) {
  const { id, styles } = action.payload;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  
  const updatedTree = updateStyles(id, styles, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
  } else {
    yield put(Actions.updateElementsTree(updatedTree));
    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
  }
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

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  
  const updatedTree = updateParameters(itemID, parameters, root);
  const updatedElement = findChildByID(updatedTree, itemID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${itemID} in tree`);
  } else {
    const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
    yield put(Actions.updateSavedElementValues(itemID, savedValue));
    yield call(updateElementsTree, updatedTree);
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

    yield call(updateElementsTree, updatedElements);
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
  yield call(duplicateItems, sourceRoot, duplicatedItems, targetRoot);
  yield put(setScreenLoader(false));
}

function* duplicateItems(
  sourceRoot: LibraryElement<Entity>,
  itemsToCopyInfo: ItemToCopyInfo[],
  targetParent: LibraryElement<Entity>,
) {
  const itemsToDuplicate = itemsToCopyInfo.map(item => findChildByID(sourceRoot, item.id));
  const isItemsToDuplicateInTree = itemsToDuplicate.every(item => !!item);

  if (!isItemsToDuplicateInTree) {
    console.error(`Can not find duplicated items ${JSON.stringify(itemsToCopyInfo.map(item => item.id))} in tree`);
  } else {
    const convertedItemsToDuplicate = itemsToDuplicate.map(item => convertElementToRequest(item!));
    yield call(createElements, convertedItemsToDuplicate, targetParent);
  }
}

function* pasteCopiedItemSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const targetContainer = findChildByID(root, activeItem.itemId);

  if (!targetContainer) {
    console.error(`Can not find updated element ${activeItem.itemId} in tree`);
  } else {
    const itemToCopyInfo: ReturnType<typeof selectors.selectItemToCopyInfo> = yield select(selectors.selectItemToCopyInfo);

    if (activeItem.itemType !== 'none' && itemToCopyInfo !== null) {
      yield call(duplicateItems, root, [itemToCopyInfo], targetContainer);
    }
  }
}

const loadProjectsType: ProjectT.LoadProjects['type'] = 'PROJECTS:LOAD_PROJECTS';
const addProjectType: ProjectT.AddProject['type'] = 'PROJECTS:ADD_PROJECT';
const deleteProjectType: ProjectT.DeleteProject['type'] = 'PROJECTS:DELETE_PROJECT';
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
const updateElementStylesType: ProjectT.UpdateElementStyles['type'] = 'PROJECTS:UPDATE_ELEMENT_STYLES';
const updateElementParametersType: ProjectT.UpdateElementParameters['type'] = 'PROJECTS:UPDATE_ELEMENT_PARAMETERS';
const updateElementImageType: ProjectT.UpdateElementImage['type'] = 'PROJECTS:UPDATE_ELEMENT_IMAGE';
const createElementsType: ProjectT.CreateElements['type'] = 'PROJECTS:CREATE_ELEMENTS';
const renameElementType: ProjectT.RenameElement['type'] = 'PROJECTS:RENAME_ELEMENT';
const addChildToElementType: ProjectT.AddChildToElement['type'] = 'PROJECTS:ADD_CHILD_TO_ELEMENT';
const deleteChildFromElementType: ProjectT.DeleteChildFromElement['type'] = 'PROJECTS:DELETE_CHILD_FROM_ELEMENT';
const wrapIntoContainerType: ProjectT.WrapIntoContainer['type'] = 'PROJECTS:WRAP_INTO_CONTAINER';
const deleteActiveItemType: ProjectT.DeleteActiveItem['type'] = 'PROJECTS:DELETE_ACTIVE_ITEM';
const uploadFileType: ProjectT.UploadFile['type'] = 'PROJECTS:UPLOAD_FILE';
const getScreenNNType: ProjectT.GetScreenNN['type'] = 'PROJECTS:GET_SCREEN_NN';
const copyActiveItemType: ProjectT.CopyActiveItem['type'] = 'PROJECTS:COPY_ACTIVE_ITEM';
const pasteCopiedItemType: ProjectT.PasteCopiedItem['type'] = 'PROJECTS:PASTE_COPIED_ITEM';

export default function* projectSaga() {
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(loadProjectsType, getListProjectSaga);
  yield takeLatest(addProjectType, addProject);
  yield takeLatest(deleteProjectType, delProjectSaga);
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
  yield takeLatest(moveElementType, moveElementSaga);

  yield takeLatest(removeSharedStylesType, removeSharedStylesSaga);
  yield takeLatest(updateSharedStylesType, updateSharedStylesSaga);
  yield takeLatest(updateElementStylesType, updateElementStyles);
  yield takeLatest(updateElementImageType, updateElementImage);
  yield takeLatest(updateElementParametersType, updateElementParameters);

  yield takeEvery(createElementsType, createElementsSaga);
  yield takeEvery(renameElementType, renameElementSaga);

  yield takeEvery(addChildToElementType, addChildToElementSaga);
  yield takeEvery(deleteChildFromElementType, deleteChildFromElementSaga);
  yield takeEvery(wrapIntoContainerType, wrapIntoContainerSaga);

  yield takeLatest(deleteActiveItemType, deleteActiveItemSaga);

  yield takeLatest(copyActiveItemType, copyActiveItemSaga);
  yield takeEvery(pasteCopiedItemType, pasteCopiedItemSaga);

  yield takeLatest(uploadFileType, uploadFileSaga);
  yield takeLatest(getScreenNNType, screenSaga.getScreenNNSaga);
}
