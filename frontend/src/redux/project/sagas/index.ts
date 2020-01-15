import {
  takeLatest,
  takeEvery,
  put,
  call,
  take,
  select,
  fork,
  actionChannel,
} from 'redux-saga/effects';
import { buffers } from 'redux-saga';
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
} from '$redux/project/sagas/project';
import {
  delScenarioSaga,
  renameScenarioSaga,
  runLayoutAlgorithm,
  wrapIntoContainerSaga,
  addScenarioSaga,
} from '$redux/project/sagas/scenario';
import {
  apiGetScenarios,
} from '$api/scenario';
import {
  apiGetLibraryElements,
  apiSaveElements,
  parseImgUsingNN,
  apiGetElements,
} from '$api/element';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { refreshUserTokenPair } from '$redux/user/sagas';
import { openSignScreen, openProjects } from '$utils/history';
import { CssLikeStyles } from '$utils/StyleHelper';
import {
  IScenarios,
  IScenarioElements,
  ILibraryElements,
} from '$redux/project/types';
import * as ProjectT from '$redux/project/types';
import * as PATH_NAMES from '$constants/pathNames';
import { apiSaveScenarios, apiSaveScenario } from '$api/scenario';
import { DEFAULT_AUTHORISATION_TOKEN, DEFAULT_INDENTS } from '$constants/defaultParams';

import { selectors, T } from '../';

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
    id: affectedItemRawID,
    itemIndex: affectedItemIndex,
    items: sortableGroupItems,
    parentID: _affectedParentRawID,
  } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements
  );
  const { listSortable }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  let updatedScenarios = scenarios;
  let updatedElements = scenarioElements;

  const affectedItemID = parseInt(affectedItemRawID, 10);
  const affectedParentRawID = _affectedParentRawID === 'root' ? `${listSortable.root.id}s` : _affectedParentRawID;
  const affectedParentID = _affectedParentRawID === 'root' ? listSortable.root.id : parseInt(_affectedParentRawID, 10);

  const containerWasAffected = affectedItemRawID.slice(-1) === 's';
  const elementWasAffected = affectedItemRawID.slice(-1) === 'e';

  const makeContainerChildrenLens = (scenarioID: number) => R.lensPath([scenarioID, 'parameters', 'children']);
  const makeContainerParentLens = (scenarioID: number) => R.lensPath([scenarioID, 'parent_id']);
  const makeContainerElementsLens = (scenarioID: number) => R.lensPath([scenarioID, 'elements']);
  const makeElementParentLens = (elementID: R.Path[0]) => R.lensPath([elementID, 'parameters', 'parent_id']);
  const makeElementScenarioLens = (elementID: R.Path[0]) => R.lensPath([elementID, 'scenario']);

  const parentBefore = listSortable[_affectedParentRawID];

  const symmetricDifference = R.symmetricDifference(sortableGroupItems, parentBefore.children);
  const needToUpdateItemPositionInParent = symmetricDifference.length === 0;
  const itemMovedFromContainer = R.not(R.includes(affectedItemRawID, sortableGroupItems));
  const itemMovedIntoContainer = R.not(R.includes(affectedItemRawID, parentBefore.children));

  if (needToUpdateItemPositionInParent) {
    const childrenLens = makeContainerChildrenLens(affectedParentID);
    updatedScenarios = R.set(childrenLens, sortableGroupItems, updatedScenarios);
    yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
  } else if (itemMovedFromContainer) {
    if (containerWasAffected) {
      const parentChildrenLens = makeContainerChildrenLens(affectedParentID);

      updatedScenarios = R.set(parentChildrenLens, sortableGroupItems, updatedScenarios);
      yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
    } else if (elementWasAffected) {
      // const nowContainerHasNoChildren = sortableGroupItems.length === 0;
      const containerParentID = scenarios[affectedParentID].parent_id;
      const parentChildrenLens = makeContainerChildrenLens(affectedParentID);
      const parentElementsLens = makeContainerElementsLens(affectedParentID);
      // const containerParentChildrenLens = makeContainerChildrenLens(containerParentID);
      // а если это елемент то и из elemenst его надо дропнуть
      // нужно убрать у родителя из children этого чувака и из elements тоже походу
      // if (nowContainerHasNoChildren) {
      //   updatedScenarios = R.over(
      //     containerParentChildrenLens,
      //     (x: string[]) => R.without([affectedParentRawID], x),
      //     updatedScenarios // R.omit([affectedParentID.toString()], updatedScenarios)
      //   );
      //   console.log('updatedScenarios after empty container removing', updatedScenarios);
      //   yield fork(updateScenariosOnServerSaga, R.pick([containerParentID.toString()], updatedScenarios));
      //   // yield fork(reqWrapper, apiDelScenarioCascade, { list: [affectedParentID] });
      // }

      updatedScenarios = R.pipe(
        R.over(parentElementsLens, (x: number[]) => R.without([affectedItemID], x)),
        R.over(parentChildrenLens, (x: string[]) => R.without([affectedItemRawID], x))
      )(updatedScenarios);
      yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
    }
  } else if (itemMovedIntoContainer) {
    if (containerWasAffected) {
      const parentChildrenLens = makeContainerChildrenLens(affectedParentID);
      const itemParentIdLens = makeContainerParentLens(affectedItemID);

      updatedScenarios = R.pipe(
        R.set(parentChildrenLens, sortableGroupItems),
        R.set(itemParentIdLens, affectedParentID),
      )(updatedScenarios);

      yield fork(updateScenariosOnServerSaga, R.pick(
        [affectedParentID.toString(), affectedItemID.toString()], updatedScenarios
      ));
    } else if (elementWasAffected) {
      const containerChildrenLens = makeContainerChildrenLens(affectedParentID);
      const containerElementsLens = makeContainerElementsLens(affectedParentID);
      const elementScenarioLens = makeElementScenarioLens(affectedItemID);
      const elementParentLens = makeElementParentLens(affectedItemID);

      updatedScenarios = R.pipe(
        R.set(containerChildrenLens, sortableGroupItems),
        R.over(containerElementsLens, (x: number[]) => x.concat(affectedItemID)),
      )(updatedScenarios);

      updatedElements = R.pipe(
        R.set(elementScenarioLens, affectedParentID),
        R.set(elementParentLens, affectedParentID)
      )(updatedElements);

      // remove empty container only after success moving

      yield fork(updateScenariosOnServerSaga, R.pick(
        [affectedParentID.toString(), affectedItemID.toString()], updatedScenarios
      ));
      yield fork(updateElementsOnServerSaga, R.pick([affectedItemID.toString()], updatedElements));
    }
  }

  yield put(Actions.runLayoutAlgorithm(updatedScenarios, updatedElements));
  yield take(runLayoutAlgorithmFinishedType);
}

export function* updateScenariosOnServerSaga(scenarios: T.IScenarios) {
  yield call(reqWrapper, apiSaveScenarios, { data: R.values(scenarios) });
}

export function* updateElementsOnServerSaga(elements: T.IScenarioElements) {
  yield call(reqWrapper, apiSaveElements, { data: R.values(elements) });
}

export function* delScenarioItemSaga(action: ReturnType<typeof Actions.delScenario>) {
  yield put(Actions.delScenario(action.payload.id));
}

function* updateScenarioStyles(action: ReturnType<typeof Actions.updateScenarioStyles>) {
  const { id, styles } = action.payload;
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

// TODO: make one saga to update scenario/element
function* updateScenarioStylesOnServer(action: ReturnType<typeof Actions.updateScenarioStyles>) {
  const { id, styles } = action.payload;
  const scenarioID = parseInt(id, 10);
  const scenarioToUpdate: ReturnType<typeof selectors.selectScenario> = yield select(selectors.selectScenario, scenarioID);

  yield call(
    reqWrapper, apiSaveScenario,
    { data: { ...scenarioToUpdate, styles: { ...scenarioToUpdate.styles, ...styles } } },
  );
}

function* updateElementStylesOnServer(action: ReturnType<typeof Actions.updateElementStyles>) {
  const { id, styles } = action.payload;
  const elementID = parseInt(id, 10);
  const elementToUpdate: ReturnType<typeof selectors.selectScenarioElement> = yield select(
    selectors.selectScenarioElement, elementID,
  );

  yield call(
    updateElementsOnServerSaga,
    { [elementID]: { ...elementToUpdate, styles: { ...elementToUpdate.styles, ...styles }} },
  );
}

function* updateElementParametersOnServer(action: ReturnType<typeof Actions.updateElementParameters>) {
  const { itemID, parameters } = action.payload;
  const elementID = parseInt(itemID, 10);
  const elementToUpdate: ReturnType<typeof selectors.selectScenarioElement> = yield select(
    selectors.selectScenarioElement, elementID,
  );

  yield call(
    updateElementsOnServerSaga,
    { [elementID]: { ...elementToUpdate, parameters: { ...elementToUpdate.parameters, ...parameters }} },
  );
}

function* updateElementStyles(action: ReturnType<typeof Actions.updateElementStyles>) {
  const { id, styles } = action.payload;
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
}

function* uploadFileSaga(
  { payload: { file: { file } } }: ReturnType<typeof Actions.uploadFile>
) {
  try {
    // TODO: show loader in addModalElements
    const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
      selectors.selectCurrentScreen,
    );
    const { id: currentScreenID } = currentScreen;
    const currentScenarios: ReturnType<typeof selectors.selectScenarios> = yield select(
      selectors.selectScenarios,
    );
    const currentScenariosElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
      selectors.selectScenariosElements,
    );
    const rootScenario: ReturnType<typeof selectors.selectRootScenario> = yield select(
      selectors.selectRootScenario,
    );

    if (rootScenario === undefined) return;

    const formData = new FormData();
    formData.append('image', new Blob([file]), file.name);
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', currentScreenID.toString());
    formData.append('parameters', JSON.stringify({}));
    formData.append('styles', JSON.stringify({}));

    type NNScenario = {
      id: number;
      buoyancy: null;
      direction: 'vertical' | 'horizontal';
      elements: number[];
      name: string;
      parameters: { children?: string[] };
      parent_id: number;
      screen: number;
      struct_type: 'container';
      styles: '' | CssLikeStyles;
      type: string; // login
    };

    const nnScenarioToContainer = (x: NNScenario): T.IScenarioItem => ({
      ...x,
      buoyancy: 0,
      parameters: {
        ...x.parameters,
        children: x.parameters.children ? x.parameters.children : [],
      },
      styles: x.styles === '' ? {
        ...DEFAULT_INDENTS,
        display: 'flex',
        'flex-direction': x.direction === 'horizontal' ? 'row' : 'column',
        'justify-content': 'flex-start',
        'align-items': 'stretch',
      } : x.styles,
    });

    const nnChildScenarioToContainer = (x: any): T.IScenarioItem => ({
      ...x,
      buoyancy: 0,
      styles: {
        ...DEFAULT_INDENTS,
        display: 'flex',
        'flex-direction': x.direction === 'horizontal' ? 'row' : 'column',
        'justify-content': 'flex-start',
        'align-items': 'stretch',
      },
    });

    const nnServerRootScenario: NNScenario = yield call(reqWrapper, parseImgUsingNN, {
      data: formData,
      contentType: 'multipart/form-data',
    });
    const screenScenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
      reqWrapper, apiGetScenarios, { screenID: currentScreenID }
    );
    const scenariosElements: ReturnPromisedType<typeof apiGetElements> = yield call(reqWrapper, apiGetElements, {
      scenariosIDs: [screenScenarios.map(x => x.id)],
    });

    const nnRootScenario = nnScenarioToContainer(nnServerRootScenario);

    const finalRootScenario = {
      ...rootScenario,
      parameters: {
        ...rootScenario.parameters,
        children: rootScenario.parameters.children.concat(`${nnRootScenario.id}s`),
      }
    };

    type CollectChildrenAcc = { scenariosIDs: string[], elementsIDs: string[] };
    const collectChildren = (children: string[]) => children.reduce((acc: CollectChildrenAcc, x): CollectChildrenAcc => {
      const isScenario = x.slice(-1) === 's';
      const scenario = isScenario ? screenScenarios.find(s => s.id === parseInt(x)) : null;
      const { elementsIDs, scenariosIDs } = scenario
        ? collectChildren(scenario.parameters.children)
        : { elementsIDs: [], scenariosIDs: [] };
      return { elementsIDs: acc.elementsIDs.concat(elementsIDs), scenariosIDs: acc.scenariosIDs.concat(scenariosIDs)};
    }, { scenariosIDs: children.filter(x => x.slice(-1) === 's'), elementsIDs: children.filter(x => x.slice(-1) !== 's')});

    const { scenariosIDs, elementsIDs: rawElementsIDs } = collectChildren(nnRootScenario.parameters.children);

    const rootChildrenScenarios = scenariosIDs
      .map(x => parseInt(x, 10))
      .map(x => screenScenarios.find(s => s.id === x) as ProjectT.IScenarioItem)
      .map(nnChildScenarioToContainer);

    const addParentId = (x: any) => ({ ...x, parameters: { ...x.parameters, parent_id: x.scenario }});

    const actualScenarios = {
      ...currentScenarios,
      [finalRootScenario.id]: finalRootScenario,
      [nnRootScenario.id]: nnRootScenario,
      ...rootChildrenScenarios.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
    };

    const elementsIDs = rawElementsIDs.map(x => parseInt(x, 10));
    const actualScenariosElements = {
      ...currentScenariosElements,
      ...elementsIDs
        .map(x => scenariosElements.find(se => se.id === x) as ProjectT.IScenarioElement)
        .map(addParentId)
        .reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
    };


    yield put(Actions.runLayoutAlgorithm(actualScenarios, actualScenariosElements, {
      ...currentScreen.listSortable.root,
      children: finalRootScenario.parameters.children,
    }));
    yield take(runLayoutAlgorithmFinishedType);
    yield put(Actions.setIsAddElementsModalOpened(false));

    yield call(
      reqWrapper, apiSaveElements,
      { data: R.values(R.pick(elementsIDs.map(String), actualScenariosElements)) },
    );
    yield call(
      reqWrapper, apiSaveScenarios,
      {
        data: R.values(
          R.pick([finalRootScenario.id, nnRootScenario.id, ...rootChildrenScenarios.map(x => x.id)].map(String),
          actualScenarios
          )
        )
      },
    );
    
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
  }
}

const loadProjectsType: ProjectT.LoadProjects['type'] = 'PROJECTS:LOAD_PROJECTS';
const addProjectType: ProjectT.AddProject['type'] = 'PROJECTS:ADD_PROJECT';
const deleteProjectType: ProjectT.DeleteProject['type'] = 'PROJECTS:DELETE_PROJECT';
const getProjectType: ProjectT.GetProject['type'] = 'PROJECTS:GET_PROJECT';
const changeScreensOrderType: ProjectT.ChangeScreensOrder['type'] = 'PROJECTS:CHANGE_SCREENS_ORDER';
const renameProjectType: ProjectT.RenameProject['type'] = 'PROJECTS:RENAME_PROJECT';
const activateScreenType: ProjectT.ActivateScreen['type'] = 'PROJECTS:ACTIVATE_SCREEN';
const addScreenType: ProjectT.AddScreen['type'] = 'PROJECTS:ADD_SCREEN';
const saveScreenType: ProjectT.SaveScreen['type'] = 'PROJECTS:SAVE_SCREEN';
const deleteScreenType: ProjectT.DeleteScreen['type'] = 'PROJECTS:DELETE_SCREEN';
const renameScreenType: ProjectT.RenameScreen['type'] = 'PROJECTS:RENAME_SCREEN';
const setListSortableType: ProjectT.SetListSortable['type'] = 'PROJECTS:SET_LIST_SORTABLE';
const updateElementStylesType: ProjectT.UpdateElementStyles['type'] = 'PROJECTS:UPDATE_ELEMENT_STYLES';
const updateScenarioStylesType: ProjectT.UpdateScenarioStyles['type'] = 'PROJECTS:UPDATE_SCENARIO_STYLES';
const updateElementParametersType: ProjectT.UpdateElementParameters['type'] = 'PROJECTS:UPDATE_ELEMENT_PARAMETERS';
const addScenarioType: ProjectT.AddScenario['type'] = 'PROJECTS:ADD_SCENARIO';
const deleteScenarioType: ProjectT.DeleteScenario['type'] = 'PROJECTS:DELETE_SCENARIO';
const renameScenarioType: ProjectT.RenameScenario['type'] = 'PROJECTS:RENAME_SCENARIO';
const addContainerType: ProjectT.AddContainer['type'] = 'PROJECTS:ADD_CONTAINER';
const delScenarioItemType: ProjectT.DeleteScenarioItem['type'] = 'PROJECTS:DELETE_SCENARIO_ITEM';
const uploadFileType: ProjectT.UploadFile['type'] = 'PROJECTS:UPLOAD_FILE';
const getScreenNNType: ProjectT.GetScreenNN['type'] = 'PROJECTS:GET_SCREEN_NN';
const runLayoutAlgorithmType: ProjectT.RunLayoutAlgorithm['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM';
type ActionsToAutoSave = ProjectT.UpdateScenarioStyles | ProjectT.UpdateElementStyles | ProjectT.UpdateElementParameters;


export default function* projectSaga() {
  yield takeLatest(runLayoutAlgorithmType, runLayoutAlgorithm);
  yield takeLatest(REHYDRATE, authCheckSaga);
  yield takeLatest(LOCATION_CHANGE, LocationChange);

  yield takeLatest(loadProjectsType, getListProjectSaga);
  yield takeLatest(addProjectType, addProject);
  yield takeLatest(deleteProjectType, delProjectSaga);
  yield takeLatest(getProjectType, getProjectSaga);
  yield takeLatest(changeScreensOrderType, changeScreensOrderSaga);
  yield takeLatest(renameProjectType, renameProjectSaga);

  yield takeLatest(activateScreenType, screenSaga.activateScreenSaga);
  yield takeLatest(addScreenType, screenSaga.addScreenSaga);
  yield takeLatest(saveScreenType, screenSaga.saveScreenSaga);
  yield takeLatest(deleteScreenType, screenSaga.delScreenSaga);
  yield takeLatest(renameScreenType, screenSaga.renameScreenSaga);
  yield takeLatest(setListSortableType, setListSortableSaga);

  yield takeLatest(updateElementStylesType, updateElementStyles);
  yield takeLatest(updateScenarioStylesType, updateScenarioStyles);
  yield takeLatest(updateElementParametersType, updateElementParameters);

  yield takeEvery(addScenarioType, addScenarioSaga);
  yield takeLatest(deleteScenarioType, delScenarioSaga);
  yield takeLatest(renameScenarioType, renameScenarioSaga);
  yield takeEvery(addContainerType, wrapIntoContainerSaga);

  yield takeLatest(delScenarioItemType, delScenarioItemSaga);

  yield takeLatest(uploadFileType, uploadFileSaga);
  yield takeLatest(getScreenNNType, screenSaga.getScreenNNSaga);

  const channel = yield actionChannel([
    updateScenarioStylesType,
    updateElementStylesType,
    updateElementParametersType,
  ], buffers.expanding());
  while (true) {
    const action: ActionsToAutoSave = yield take(channel);
    if (action.type === updateScenarioStylesType) {
      yield call(updateScenarioStylesOnServer, action);
    } else if (action.type === updateElementStylesType) {
      yield call(updateElementStylesOnServer, action);
    } else if (action.type === updateElementParametersType) {
      yield call(updateElementParametersOnServer, action);
    }
  }
}
