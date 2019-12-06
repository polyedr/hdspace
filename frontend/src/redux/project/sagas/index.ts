import { SagaIterator } from 'redux-saga';
import {
  takeLatest,
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
  setProjectScreensSaga,
  renameProjectSaga,
} from '$redux/project/sagas/project';
import {
  changeScenarioSaga,
  changeScenariosSaga,
  createScenarioSaga,
  addScenarioSaga,
  delScenarioSaga,
  renameScenarioSaga,
  runLayoutAlgorithm,
  addContainerSaga,
} from '$redux/project/sagas/scenario';
import {
  apiGetLibraryElements,
  apiGetElements,
  apiDelElement,
  uploadImageForNN,
} from '$api/element';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { refreshUserTokenPair } from '$redux/user/sagas';
import { openSignScreen, openProjects } from '$utils/history';
import {
  IScenarios,
  IScenarioElements,
  IScenarioItem,
  IScenarioElement,
  ILibraryElements,
} from '$redux/project/types';
import * as ProjectT from '$redux/project/types';
import * as PATH_NAMES from '$constants/pathNames';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { findParentType, getParams } from '$utils/parseScenario';
import { apiSaveScenarios } from '$api/scenario';

import { selectors } from '../';

const runLayoutAlgorithmFinishedType: ProjectT.RunLayoutAlgorithmFinished['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED';

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

  const libraryElements = result.reduce((obj: ILibraryElements, item) => ({
    ...obj,
    ...(item.func_type.length && item.func_type.reduce((objOfType, type, idx) => ({
      ...objOfType,
      [type]: {
        buoyancy: item.buoyancy[idx],
        func_type: typeof type === 'string' ? type : undefined,
        struct_type: item.struct_type,
        parameters: item.parameters[idx],
        styles: item.styles[idx] || {},
        name: type,
      },
    }), {})) || {
      [item.struct_type]: {
        buoyancy: item.buoyancy[0] || 0,
        func_type: typeof item.func_type === 'string' ? item.func_type : undefined,
        struct_type: item.struct_type,
        parameters: item.parameters[0] || 0,
        styles: item.styles[0] || {},
        name: item.struct_type,
      },
    },
  }), {});

  yield put(Actions.setLibraryElements(libraryElements));
}

function* setListSortableSaga(action: ReturnType<typeof Actions.setListSortable>) {
  const {
    id: rawActiveItemID,
    itemIndex: movedItemIndexInCurrentSortableGroup,
    items: itemsInCurrentSortableGroup,
    parentID: rawParentID,
  } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements
  );

  const activeItemID = parseInt(rawActiveItemID, 10);
  const parentID = rawParentID === 'root' ? 0 : parseInt(rawParentID, 10);

  let updateScenarios = scenarios;
  let updateElements = scenarioElements;

  console.log('Update LS');
  if (itemsInCurrentSortableGroup.indexOf(rawActiveItemID) === -1) {
    if (rawActiveItemID.slice(-1) === 's') {
      // Remove Scenario
      if (!parentID) return;
      const itemType = scenarios[activeItemID].struct_type;
      const parentType = R.path([parentID, 'struct_type'], scenarios);
      const mainType = findParentType(parentID, scenarios);
      console.log({itemType, parentType, mainType});

      if (rawParentID && rawParentID !== 'root') {
        console.log('Remove Scenario');
        updateScenarios = {
          ...scenarios,
          [parentID]: R.assocPath(['parameters', 'children'], itemsInCurrentSortableGroup, scenarios[parentID]),
        };
      }
    } else {
      if (scenarios[parentID].struct_type === 'block') {
        return;
      }
      if (scenarios[parentID].struct_type === 'container') {
        const parentType = findParentType(parentID, scenarios);

        if (parentType !== 'group') return;

        console.log('Remove Element');
        updateScenarios = {
          ...scenarios,
          [parentID]: R.assocPath(['parameters', 'children'], itemsInCurrentSortableGroup, scenarios[parentID]),
        };
      }
    }

    const clearScenarios: IScenarios = R.omit(['0'], updateScenarios);

    yield put(Actions.runLayoutAlgorithm(clearScenarios, updateElements));
    yield take(runLayoutAlgorithmFinishedType);

    yield put(Actions.setScenarios(clearScenarios));

    return;
  }

  if (rawActiveItemID.slice(-1) === 's') {
    // Add scenario
    const itemType: string = scenarios[activeItemID].struct_type;
    const parentType = R.path([parentID, 'struct_type'], scenarios);
    const mainType = findParentType(parentID, scenarios);
    const oldScenarioId = scenarios[activeItemID].parent_id;
    const childParentId: string = R.remove(movedItemIndexInCurrentSortableGroup, 1, itemsInCurrentSortableGroup)[0];
    console.log({ id: rawActiveItemID, itemType, parentType, mainType });

    if (parentType === 'container' && itemType === 'block') {
      if (mainType !== 'root') return;
      console.log('Block -> Container');
    } else if (parentType === 'container' && itemType === 'group') {
      if (mainType !== 'block') {
        console.log('Cancel Block -> Container');
      }
      console.log('Group -> Container');
    }

    if (scenarios[activeItemID].struct_type === 'group' && parentType === 'root') {
      console.log('Cancel move Group -> Root/ContainerRoot');
      const oldParentChildrenIDs = scenarios[oldScenarioId].parameters.children;
      updateScenarios = {
        ...scenarios,
        [oldScenarioId]: R.assocPath(
          ['parameters', 'children'],
          [...oldParentChildrenIDs, rawActiveItemID],
          scenarios[oldScenarioId],
        ),
      };
    } else if (itemType === 'block' && mainType !== 'root') {
      console.log('block -> ??');
    } else if (itemType === 'group') {
      console.log('Group -> Block', scenarios);
      updateScenarios = {
        ...scenarios,
        [activeItemID]: R.assoc('parent_id', parentID, scenarios[activeItemID]),
        [parentID]: R.assocPath(['parameters', 'children'], itemsInCurrentSortableGroup, scenarios[parentID]),
      };
    } else if (itemType === 'container') {
      console.log('Cancel move ContainerElement -> Root/Block');
      console.log('Cancel move ContainerGroup -> Root/Group');
    } else if (rawParentID === 'root' && parentID !== oldScenarioId) {
      console.log('Scenario -> Root');
      updateScenarios = {
        ...scenarios,
        [activeItemID]: R.assoc('parent_id', parentID, scenarios[activeItemID]),
      };
    } else if (!childParentId) {
      console.log('Scenario -> empty Parent');
      updateScenarios = {
        ...scenarios,
        [activeItemID]: R.assoc('parent_id', parentID, scenarios[activeItemID]),
        [parentID]: R.assocPath(['parameters', 'children'], itemsInCurrentSortableGroup, scenarios[parentID]),
      };
    } else if (parentID !== oldScenarioId) {
      console.log('Scenario_A -> Scenario_B');
      updateScenarios = {
        ...scenarios,
        [activeItemID]: R.assoc('parent_id', parentID, scenarios[activeItemID]),
        [parentID]: R.assocPath(['parameters', 'children'], itemsInCurrentSortableGroup, scenarios[parentID]),
      };
    } else {
      console.log('Change Buoyancy');
      updateScenarios = itemsInCurrentSortableGroup.reduce((result, key, idx) => {
        const currId = parseInt(key, 10);

        return {
          ...result,
          [currId]: R.assoc('buoyancy', itemsInCurrentSortableGroup.length - idx, result[currId]),
        };
      }, scenarios);
    }
  } else {
    // Elements
    const parentType = findParentType(parentID, scenarios);
    const oldParentId = scenarioElements[activeItemID].parameters.parent_id;

    console.log({ parentType, parentID, oldParentId });

    if (parentType === 'group' && parentID !== oldParentId) {
      // Replace element
      console.log('Replace element');
      const oldParent = scenarios[oldParentId];

      updateElements = R.assocPath(
        [activeItemID, 'parameters', 'parent_id'],
        parentID,
        scenarioElements,
      );
      // remove from old parent's children
      updateScenarios = R.assocPath(
        [oldParentId, 'parameters', 'children'],
        oldParent.parameters.children.filter(i => i !== rawActiveItemID),
        updateScenarios,
      );
      // add to new parent's children
      updateScenarios = R.assocPath(
        [parentID, 'parameters', 'children'],
        itemsInCurrentSortableGroup,
        updateScenarios,
      );
    }

    // Elements change buoyancy
    console.log('Change elements Buoyancy');
    updateElements = itemsInCurrentSortableGroup.reduce((result, key, idx) => {
      const keyParsed = parseInt(key, 10);
      const buoyancy = itemsInCurrentSortableGroup.length - idx;
      return {
        ...result,
        [keyParsed]: {
          ...result[keyParsed],
          buoyancy,
          dynamic_buoyancy: buoyancy,
        },
      };
    }, updateElements);
  }

  const clearScenarios: IScenarios = R.omit(['0'], updateScenarios);

  yield put(Actions.runLayoutAlgorithm(clearScenarios, updateElements));
  yield take(runLayoutAlgorithmFinishedType);

  yield put(Actions.setScenarioElements(updateElements));
  yield put(Actions.setScenarios(clearScenarios));
  // yield call(apiSaveScenarios, updateScenarios);
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(selectors.selectModifyElements);
  const modifiedElements = R
    .values(updateElements)
    .filter(element => (
      !R.values(scenarioElements).some((el) => {
        try {
          return JSON.stringify(el) === JSON.stringify(element);
        } catch {
          return true;
        }
      })
    ))
    .map(el => el.id);
  yield put(Actions.setModifyElements(R.union(modifyElements, modifiedElements)));
}

export function* delScenarioItemSaga(action: ReturnType<typeof Actions.delScenario>) {
  const { id } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements
  );

  if (id.slice(-1) === 's') {
    yield put(Actions.delScenario(id));

    return;
  }

  const elementID = parseInt(id, 10);
  const elementsWithoutDeleted = R.omit([String(elementID)], scenarioElements);
  const { parent_id } = getParams(id, scenarioElements, scenarios);
  const { scenario } = scenarioElements[elementID];

  const updatedScenarios: IScenarios = {
    ...scenarios,
    [parent_id]: {
      ...scenarios[parent_id],
      parameters: {
        ...scenarios[parent_id].parameters,
        children: R.without([id], scenarios[parent_id].parameters.children),
      },
    },
    [scenario]: {
      ...scenarios[scenario],
      elements: R.without([elementID], scenarios[scenario].elements),
    },
  };

  yield put(Actions.setScenarioElements(elementsWithoutDeleted));
  yield put(Actions.setScenarios(updatedScenarios));

  yield put(Actions.runLayoutAlgorithm(updatedScenarios, elementsWithoutDeleted));
  yield take(runLayoutAlgorithmFinishedType);

  // TODO: clean listSortable accordingly
  const resultScenarios = yield call(reqWrapper, apiSaveScenarios, { data: R.values(R.pick([parent_id, scenario].map(String), updatedScenarios)) });
  const resultElements = yield call(reqWrapper, apiDelElement, { id: elementID });
  console.log('SAVE', resultElements, resultScenarios);
}

function* updateRootStyles(
  { payload: { styles } }: ReturnType<typeof Actions.updateRootStyles>,
) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  const updatedRootStyles = {
    ...currentScreen.styles_root,
    ...styles,
  };

  const newScreen = {
    ...currentScreen,
    styles_root: {
      ...updatedRootStyles,
    },
  };

  yield put(Actions.setScreen(newScreen as ProjectT.IProjectScreen));
  /* const {
    project: { currentScreen },
  }: AppReduxState = yield select();

  const styles_root = {
    ...currentScreen.styles_root,
    ...styles,
  };

  const listSortableItem: ISortableItemTemp = currentScreen.listSortable[itemId];

  const listSortable = {
    ...currentScreen.listSortable,
    [itemId]: {
      ...listSortableItem,
      props: {
        ...listSortableItem.props,
        ...styles,
      },
    },
  };

  const newScreen: IProjectScreen = {
    ...currentScreen,
    styles_root,
    listSortable,
    screenData: getListReverse(listSortable),
  };

  yield put(Actions.setScreen(newScreen)); */
}

function* updateScenarioStyles(
  { payload: { id, styles } }: ReturnType<typeof Actions.updateScenarioStyles>,
): SagaIterator {
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const parseId = parseInt(id, 10);
  const updateScenarios: IScenarios = {
    ...scenarios,
    [parseId]: {
      ...scenarios[parseId],
      styles: {
        ...R.path([parseId, 'styles'], scenarios),
        ...styles,
      },
    },
  };

  yield put(Actions.setScenarios(updateScenarios));
}

function* updateElementStyles(
  { payload: { id, styles } }: ReturnType<typeof Actions.updateElementStyles>,
): SagaIterator {
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(selectors.selectModifyElements);
  const parseId = parseInt(id, 10);

  const updateScenarioElements: IScenarioElements = {
    ...scenarioElements,
    [parseId]: {
      ...scenarioElements[parseId],
      styles: {
        ...R.path([parseId, 'styles'], scenarioElements),
        ...styles,
      },
    },
  };

  yield put(Actions.setScenarioElements(updateScenarioElements));

  if (modifyElements.indexOf(parseId) === -1) {
    yield put(Actions.setModifyElements(R.append(parseId, modifyElements)));
  }
}

function* updateElementParameters(action: ReturnType<typeof Actions.updateElementParameters>) {
  const { itemID, parameters } = action.payload;

  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(selectors.selectModifyElements);

  const parseId = parseInt(itemID, 10);

  const updateScenarioElements: IScenarioElements = {
    ...scenarioElements,
    [parseId]: {
      ...scenarioElements[parseId],
      parameters: {
        ...R.path([parseId, 'parameters'], scenarioElements),
        ...parameters,
      },
    },
  };

  yield put(Actions.setScenarioElements(updateScenarioElements));

  if (modifyElements.indexOf(parseId) === -1) {
    yield put(Actions.setModifyElements(R.append(parseId, modifyElements)));
  }
  /* const listSortableItem: ISortableItemTemp = currentScreen.listSortable[itemId];

  const listSortable = {
    ...currentScreen.listSortable,
    [itemId]: {
      ...listSortableItem,
      props: {
        ...listSortableItem.props,
        ...parameters,
      },
    },
  };

  const newScreen: IProjectScreen = {
    ...currentScreen,
    listSortable,
    screenData: getListReverse(listSortable),
  };

  yield put(Actions.setScreen(newScreen));
  // ----- update scenario -----
  const { elementId } = currentScreen.listSortable[itemId];

  if (!elementId || !scenarioElements[elementId]) return;

  const newScenarioElements = {
    ...scenarioElements,
    [elementId]: {
      ...scenarioElements[elementId],
      parameters: {
        ...scenarioElements[elementId].parameters,
        ...parseParameters(parameters),
      },
    },
  };

  yield put(Actions.setScenarioElements(newScenarioElements));

  if (modifyElements.indexOf(elementId) === -1) {
    yield put(Actions.setModifyElements(R.append(elementId, modifyElements)));
  } */
}

function* setAlign(action: ReturnType<typeof Actions.setAlign>) {
  const { itemID, type } = action.payload;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  /* const currElement: IListSortable = currentScreen.listSortable[itemId];
  const listSortable = {
    ...currentScreen.listSortable,
    [itemId]: {
      ...currElement,
      props: {
        ...currElement.props,
        align: type,
      },
    },
  };

  const newScreen: IProjectScreen = {
    ...currentScreen,
    listSortable,
    screen_data_json: getListReverse(listSortable),
  };

  yield put(Actions.setScreen(newScreen)); */
}

function* changeElementTypeSaga(action: ReturnType<typeof Actions.changeElementType>) {
  const { type, itemID } = action.payload;
  // update elements

  console.error('attempt to changeElementTypeSaga!');
  return;

  const libraryElements: ReturnType<typeof selectors.selectLibraryElements> = yield select(selectors.selectLibraryElements);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const { listSortable }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  // @ts-ignore
  const { elementId } = listSortable[itemID];
  const currElement = scenarioElements[elementId];
  const baseElement = libraryElements[type];

  const convertElement = {
    ...baseElement,
    id: elementId,
    scenario: currElement.scenario,
    parameters: {
      ...baseElement.parameters,
      ...currElement.parameters,
    },
    styles: {
      ...baseElement.styles,
      ...currElement.styles,
    },
  };

  const updateScenarioEl = {
    ...scenarioElements,
    [elementId]: convertElement,
  };

  yield put(Actions.setScenarioElements(updateScenarioEl));

  // yield call(scenarioSaga.runLayoutAlgorithm, updateScenarioEl);
}

function* getElements() {
  const result: IScenarioElement[] = yield call(reqWrapper, apiGetElements);
  console.log(result);
}

function* uploadFileSaga(
  { payload: { file: { file } } }: ReturnType<typeof Actions.uploadFile>
) {
  try {
    const { id: currentScreenID }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
      selectors.selectCurrentScreen,
    );
  
    const formData = new FormData();
    formData.append('image', new Blob([file]), file.name);
  
    const { image: imageURL } = yield call(reqWrapper, uploadImageForNN, {
      screenID: currentScreenID,
      data: formData,
      contentType: 'multipart/form-data',
    });

    yield put(Actions.uploadImageForNNSuccess({ imageURL, screenID: currentScreenID }));
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
  }
}

const loadProjectsType: ProjectT.LoadProjects['type'] = 'PROJECTS:LOAD_PROJECTS';
const addProjectType: ProjectT.AddProject['type'] = 'PROJECTS:ADD_PROJECT';
const deleteProjectType: ProjectT.DeleteProject['type'] = 'PROJECTS:DELETE_PROJECT';
const getProjectType: ProjectT.GetProject['type'] = 'PROJECTS:GET_PROJECT';
const setProjectScreensType: ProjectT.SetProjectScreens['type'] = 'PROJECTS:SET_PROJECT_SCREENS';
const renameProjectType: ProjectT.RenameProject['type'] = 'PROJECTS:RENAME_PROJECT';
const activateScreenType: ProjectT.ActivateScreen['type'] = 'PROJECTS:ACTIVATE_SCREEN';
const addScreenType: ProjectT.AddScreen['type'] = 'PROJECTS:ADD_SCREEN';
const saveScreenType: ProjectT.SaveScreen['type'] = 'PROJECTS:SAVE_SCREEN';
const deleteScreenType: ProjectT.DeleteScreen['type'] = 'PROJECTS:DELETE_SCREEN';
const renameScreenType: ProjectT.RenameScreen['type'] = 'PROJECTS:RENAME_SCREEN';
const setListSortableType: ProjectT.SetListSortable['type'] = 'PROJECTS:SET_LIST_SORTABLE';
const updateElementStylesType: ProjectT.UpdateElementStyles['type'] = 'PROJECTS:UPDATE_ELEMENT_STYLES';
const updateRootStylesType: ProjectT.UpdateRootStyles['type'] = 'PROJECTS:UPDATE_ROOT_STYLES';
const updateScenarioStylesType: ProjectT.UpdateScenarioStyles['type'] = 'PROJECTS:UPDATE_SCENARIO_STYLES';
const updateElementParametersType: ProjectT.UpdateElementParameters['type'] = 'PROJECTS:UPDATE_ELEMENT_PARAMETERS';
const setAlignType: ProjectT.SetAlign['type'] = 'PROJECTS:SET_ALIGN';
const changeScenarioType: ProjectT.ChangeScenario['type'] = 'PROJECTS:CHANGE_SCENARIO';
const changeScenariosType: ProjectT.ChangeScenarios['type'] = 'PROJECTS:CHANGE_SCENARIOS';
const addScenarioType: ProjectT.AddScenario['type'] = 'PROJECTS:ADD_SCENARIO';
const deleteScenarioType: ProjectT.DeleteScenario['type'] = 'PROJECTS:DELETE_SCENARIO';
const renameScenarioType: ProjectT.RenameScenario['type'] = 'PROJECTS:RENAME_SCENARIO';
const addContainerType: ProjectT.AddContainer['type'] = 'PROJECTS:ADD_CONTAINER';
const delScenarioItemType: ProjectT.DeleteScenarioItem['type'] = 'PROJECTS:DELETE_SCENARIO_ITEM';
const changeElementTypeType: ProjectT.ChangeElementType['type'] = 'PROJECTS:CHANGE_ELEMENT_TYPE';
const uploadFileType: ProjectT.UploadFile['type'] = 'PROJECTS:UPLOAD_FILE';
const getScreenNNType: ProjectT.GetScreenNN['type'] = 'PROJECTS:GET_SCREEN_NN';
const runLayoutAlgorithmType: ProjectT.RunLayoutAlgorithm['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM';


export default function* projectSaga() {
  // yield fork(loadInitStart);
  yield takeLatest(runLayoutAlgorithmType, runLayoutAlgorithm);
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(loadProjectsType, getListProjectSaga);
  yield takeLatest(addProjectType, addProject);
  yield takeLatest(deleteProjectType, delProjectSaga);
  yield takeLatest(getProjectType, getProjectSaga);
  yield takeLatest(setProjectScreensType, setProjectScreensSaga);
  yield takeLatest(renameProjectType, renameProjectSaga);

  yield takeLatest(activateScreenType, screenSaga.activateScreenSaga);
  yield takeLatest(addScreenType, screenSaga.addScreenSaga);
  yield takeLatest(saveScreenType, screenSaga.saveScreenSaga);
  yield takeLatest(deleteScreenType, screenSaga.delScreenSaga);
  yield takeLatest(renameScreenType, screenSaga.renameScreenSaga);
  yield takeLatest(setListSortableType, setListSortableSaga);

  yield takeLatest(updateElementStylesType, updateElementStyles);
  yield takeLatest(updateRootStylesType, updateRootStyles);
  yield takeLatest(updateScenarioStylesType, updateScenarioStyles);
  yield takeLatest(updateElementParametersType, updateElementParameters);
  yield takeLatest(setAlignType, setAlign);

  yield takeLatest(changeScenarioType, changeScenarioSaga);
  yield takeLatest(changeScenariosType, changeScenariosSaga);
  // yield takeLatest(TYPES.CREATE_SCENARIO, createScenarioSaga);
  yield takeLatest(addScenarioType, addScenarioSaga);
  yield takeLatest(deleteScenarioType, delScenarioSaga);
  yield takeLatest(renameScenarioType, renameScenarioSaga);
  yield takeLatest(addContainerType, addContainerSaga);

  // yield takeLatest(TYPES.GET_ELEMENTS, getElements);
  yield takeLatest(delScenarioItemType, delScenarioItemSaga);
  yield takeLatest(changeElementTypeType, changeElementTypeSaga);

  yield takeLatest(uploadFileType, uploadFileSaga);
  yield takeLatest(getScreenNNType, screenSaga.getScreenNNSaga);
}
