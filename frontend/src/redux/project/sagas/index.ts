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
import { TYPES } from '$constants/actions';
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
} from '$redux/project/reducer';
import * as PATH_NAMES from '$constants/pathNames';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { findParentType, getParams, getScenarioId } from '$utils/parseScenario';
import { apiSaveScenarios } from '$api/scenario';

function* LocationChange({ payload: { location } }: LocationChangeAction) {
  const { user: { tokenPair } } = yield select(state => state);

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
    parentId: rawParentID,
  } = action.payload;
  const { project: { scenarios, scenarioElements } }: AppReduxState = yield select();
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

    yield call(runLayoutAlgorithm, clearScenarios, updateElements);
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

  yield call(runLayoutAlgorithm, clearScenarios, updateElements);
  yield put(Actions.setScenarioElements(updateElements));
  yield put(Actions.setScenarios(clearScenarios));
  // yield call(apiSaveScenarios, updateScenarios);
  const { project: { modifyElements = [] } } = yield select(state => state);
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

export function* delScenarioItemSaga(
  { id }: ReturnType<typeof Actions.delScenario>,
): SagaIterator {
  const { project: { scenarios, scenarioElements } } = yield select(state => state);

  if (id.slice(-1) === 's') {
    yield put(Actions.delScenario(id));

    return;
  }

  const parseId = parseInt(id, 10);
  const updateElements = R.omit([String(parseId)], scenarioElements);
  const { parent_id } = getParams(id, scenarioElements, scenarios);
  const { scenario } = scenarioElements[parseId];
  const updateScenarios: IScenarios = {
    ...scenarios,
    [parent_id]: {
      ...scenarios[parent_id],
      parameters: {
        ...R.path([parent_id, 'parameters'], scenarios),
        children: R.without([id], R.path([parent_id, 'parameters', 'children'], scenarios) || []),
      },
    },
    [scenario]: {
      ...scenarios[scenario],
      elements: R.without([parseId], R.prop('elements', scenarios[scenario])),
    },
  };

  yield put(Actions.setScenarioElements(updateElements));
  yield put(Actions.setScenarios(updateScenarios));
  yield call(runLayoutAlgorithm, scenarios, updateElements);

  const listScenario = Object.keys(updateScenarios).reduce((arr: IScenarioItem[], key) => (
    scenarios[key] ? arr.concat(scenarios[key]) : arr
  ), []);

  if (listScenario.length === 0) return;

  const resultScenarios = yield call(reqWrapper, apiSaveScenarios, { data: listScenario });
  const resultElements = yield call(reqWrapper, apiDelElement, { id: parseId });
  console.log('SAVE', resultElements, resultScenarios);
}

function* updateRootStyles(
  { payload: { styles } }: ReturnType<typeof Actions.updateRootStyles>,
): SagaIterator {
  const { project: { currentScreen } } = yield select(state => state);

  const updatedRootStyles: IScenarios = {
    ...currentScreen.styles_root,
    ...styles,
  };

  const newScreen = {
    ...currentScreen,
    styles_root: {
      ...updatedRootStyles,
    },
  };

  yield put(Actions.setScreen(newScreen));
  /* const {
    project: { currentScreen },
  } = yield select(state => state);

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
  const { project: { scenarios } } = yield select(state => state);
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
  const {
    project: { scenarioElements, modifyElements },
  } = yield select(state => state);
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

function* updateElementParameters(
  { payload: { itemId, parameters } }: ReturnType<typeof Actions.updateElementParameters>,
): SagaIterator {
  const {
    project: { scenarioElements, modifyElements },
  } = yield select(state => state);

  const parseId = parseInt(itemId, 10);

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

function* setAlign(
  { payload: { itemId, type } }: ReturnType<typeof Actions.setAlign>,
): SagaIterator {
  const { project: { currentScreen } } = yield select(state => state);
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

function* changeElementTypeSaga(
  { payload: { type, itemId } }: ReturnType<typeof Actions.changeElementType>,
): SagaIterator {
  // update elements
  const {
    project: {
      scenarioElements,
      libraryElements,
      currentScreen: { listSortable },
    },
  } = yield select(state => state);
  const { elementId } = listSortable[itemId];
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
    const state: AppReduxState = yield select();
    const currentScreenID = state.project.currentScreen.id;
  
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

export default function* projectSaga() {
  // yield fork(loadInitStart);
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(TYPES.GET_LIST_PROJECT, getListProjectSaga);
  yield takeLatest(TYPES.ADD_PROJECT, addProject);
  yield takeLatest(TYPES.DEL_PROJECT, delProjectSaga);
  yield takeLatest(TYPES.GET_PROJECT, getProjectSaga);
  yield takeLatest(TYPES.SET_PROJECT_SCREENS, setProjectScreensSaga);
  yield takeLatest(TYPES.RENAME_PROJECT, renameProjectSaga);

  yield takeLatest(TYPES.ACTIVATE_SCREEN, screenSaga.activateScreenSaga);
  yield takeLatest(TYPES.ADD_SCREEN, screenSaga.addScreenSaga);
  yield takeLatest(TYPES.SAVE_SCREEN, screenSaga.saveScreenSaga);
  yield takeLatest(TYPES.DEL_SCREEN, screenSaga.delScreenSaga);
  yield takeLatest(TYPES.RENAME_SCREEN, screenSaga.renameScreenSaga);
  yield takeLatest(TYPES.SET_LIST_SORTABLE, setListSortableSaga);

  yield takeLatest(TYPES.UPDATE_ELEMENT_STYLES, updateElementStyles);
  yield takeLatest(TYPES.UPDATE_ROOT_STYLES, updateRootStyles);
  yield takeLatest(TYPES.UPDATE_SCENARIO_STYLES, updateScenarioStyles);
  yield takeLatest(TYPES.UPDATE_ELEMENT_PARAMETERS, updateElementParameters);
  yield takeLatest(TYPES.SET_ALIGN, setAlign);

  yield takeLatest(TYPES.CHANGE_SCENARIO, changeScenarioSaga);
  yield takeLatest(TYPES.CHANGE_SCENARIOS, changeScenariosSaga);
  yield takeLatest(TYPES.CREATE_SCENARIO, createScenarioSaga);
  yield takeLatest(TYPES.ADD_SCENARIO, addScenarioSaga);
  yield takeLatest(TYPES.DEL_SCENARIO, delScenarioSaga);
  yield takeLatest(TYPES.RENAME_SCENARIO, renameScenarioSaga);
  yield takeLatest(TYPES.ADD_CONTAINER, addContainerSaga);

  yield takeLatest(TYPES.GET_ELEMENTS, getElements);
  yield takeLatest(TYPES.DEL_SCENARIO_ITEM, delScenarioItemSaga);
  yield takeLatest(TYPES.CHANGE_ELEMENT_TYPE, changeElementTypeSaga);

  yield takeLatest(TYPES.UPLOAD_FILE, uploadFileSaga);
  yield takeLatest(TYPES.GET_SCREEN_NN, screenSaga.getScreenNNSaga);
}
