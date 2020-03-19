import {
  takeLatest,
  takeEvery,
  put,
  call,
  take,
  select,
  fork,
  actionChannel,
  all,
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
  exportProjectSaga,
} from '$redux/project/sagas/project';
import {
  deleteActiveItemSaga,
  renameScenarioSaga,
  runLayoutAlgorithm,
  wrapIntoContainerSaga,
  addElementsIntoContainerSaga,
  createContainer,
} from '$redux/project/sagas/scenario';
import {
  apiGetScenarios, apiAddScenarios,
} from '$api/scenario';
import {
  apiGetLibraryElements,
  apiSaveElements,
  parseImgUsingNN,
  apiGetElements,
  apiAddElements,
  apiChangeElement,
  apiGetElement,
} from '$api/element';
import { setTokenPair, setLoadedToken } from '$redux/user/actions';
import { MAX_TOKEN_TRIALS } from '$config/settings';
import { setScreenLoader } from '$redux/project/actions';
import { addScreenSaga } from '$redux/project/sagas/screen';
import { refreshUserTokenPair } from '$redux/user/sagas';
import { openSignScreen, openProjects } from '$utils/history';
import { CssLikeStyles } from '$utils/StyleHelper';
import * as PATH_NAMES from '$constants/pathNames';
import { apiSaveScenarios, apiSaveScenario } from '$api/scenario';
import { DEFAULT_AUTHORISATION_TOKEN } from '$constants/defaultParams';
import { getConfigurablePropsOf, Entity } from '$domain/core';
import { collectChildren, makeContainerLens, makeElementLens } from '$domain/abstractInterface';
import * as ai from '$domain/abstractInterface';

import { IScreenProps, ItemToCopyInfo, ActiveItem } from '../types';
import { selectors, T as ProjectT, actionsCreators, T } from '../';

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
  }), {}) as ProjectT.LibraryElements;

  yield put(Actions.setLibraryElements(libraryElements));
}

function* setListSortableSaga(action: ReturnType<typeof Actions.setListSortable>) {
  const {
    id: affectedItemRawID,
    itemIndex: affectedItemIndex,
    items: sortableGroupItems,
    parentID: affectedParentRawID,
  } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements
  );
  const { listSortable }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  let updatedScenarios = scenarios;
  let updatedElements = scenarioElements;

  const affectedItemID = parseInt(affectedItemRawID, 10);
  const affectedParentID = affectedParentRawID === 'root' ? listSortable.root.id : parseInt(affectedParentRawID, 10);

  const parentBefore = listSortable[affectedParentRawID];

  const symmetricDifference = R.symmetricDifference(sortableGroupItems, parentBefore.children);
  const needToUpdateItemPositionInParent = symmetricDifference.length === 0;
  const itemMovedFromContainer = R.not(R.includes(affectedItemRawID, sortableGroupItems));
  const itemMovedIntoContainer = R.not(R.includes(affectedItemRawID, parentBefore.children));

  if (needToUpdateItemPositionInParent) {
    updatedScenarios = ai.rearrangeSameChildren(updatedScenarios, affectedParentID, sortableGroupItems);
    yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
  } else if (itemMovedFromContainer) {
    updatedScenarios = ai.removeChildFromParent(updatedScenarios, affectedParentID, affectedItemRawID);
    yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
  } else if (itemMovedIntoContainer) {
    const {
      scenarios,
      elements,
    } = ai.addChildToParent(updatedScenarios, updatedElements, affectedParentID, affectedItemRawID, affectedItemIndex);

    updatedScenarios = scenarios;
    updatedElements = elements;

    if (ai.isContainer(affectedItemRawID)) {
      yield fork(updateScenariosOnServerSaga, R.pick(
        R.map(R.toString, [affectedParentID, affectedItemID]), updatedScenarios
      ));
    } else {
      yield fork(updateScenariosOnServerSaga, R.pick([affectedParentID.toString()], updatedScenarios));
      yield fork(updateElementsOnServerSaga, R.pick([affectedItemID.toString()], updatedElements));
    }
  }

  yield put(Actions.runLayoutAlgorithm(updatedScenarios, updatedElements));
  yield take(runLayoutAlgorithmFinishedType);
}

export function* updateScenariosOnServerSaga(scenarios: ProjectT.IScenarios) {
  yield call(reqWrapper, apiSaveScenarios, { data: R.values(scenarios) });
}

export function* updateElementsOnServerSaga(elements: ProjectT.IScenarioElements) {
  yield call(reqWrapper, apiSaveElements, { data: R.values(elements) });
}

function* updateScenarioStyles(action: ReturnType<typeof Actions.updateScenarioStyles>) {
  const { id, styles } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const parseId = parseInt(id, 10);
  const updateScenarios: ProjectT.IScenarios = {
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

  const updateScenarioElements: ProjectT.IScenarioElements = {
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

function* updateElementImage(action: ReturnType<typeof Actions.updateElementImage>) {
  const { itemID, image } = action.payload;

  const parsedID = parseInt(itemID, 10);
  const formData = new FormData();
  formData.append('image', new Blob([image]), image.name);

  const changedElement: ReturnPromisedType<typeof apiChangeElement> = yield call(reqWrapper, apiChangeElement, { data: formData, id: parsedID });

  const scenarioElement: ReturnType<typeof selectors.selectScenarioElement> = yield select(selectors.selectScenarioElement, parsedID);

  yield put(Actions.updateElementParameters(itemID, {
    ...scenarioElement.parameters,
    imageURL: changedElement.image,
  } as IScreenProps));
}

function* updateElementParameters(action: ReturnType<typeof Actions.updateElementParameters>) {
  const { itemID, parameters } = action.payload;

  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(selectors.selectModifyElements);

  const parseId = parseInt(itemID, 10);

  const updateScenarioElements: ProjectT.IScenarioElements = {
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

    const { styles, params } = getConfigurablePropsOf('container');
    const nnScenarioToContainer = (x: NNScenario): ProjectT.IScenarioItem => ({
      ...x,
      buoyancy: 0,
      parameters: {
        ...params,
        ...x.parameters,
        children: x.parameters.children ? x.parameters.children : [],
      },
      styles: {
        ...styles,
        'flex-direction': x.direction === 'horizontal' ? 'row' : 'column',
        ...(x.styles !== '' ? x.styles : {})
      },
    });

    const nnChildScenarioToContainer = (x: any): ProjectT.IScenarioItem => ({
      ...x,
      buoyancy: 0,
      styles: {
        ...styles,
        'flex-direction': x.direction === 'horizontal' ? 'row' : 'column',
        ...(x.styles !== '' ? x.styles : {})
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

    const { scenariosIDs, elementsIDs: rawElementsIDs } = collectChildren(
      screenScenarios, nnRootScenario.parameters.children,
    );

    const rootChildrenScenarios = scenariosIDs
      .map(x => parseInt(x, 10))
      .map(x => screenScenarios.find(s => s.id === x) as ProjectT.IScenarioItem)
      .map(nnChildScenarioToContainer);

    const addParentId = (x: any) => ({ ...x, parameters: { ...x.parameters, parent_id: x.scenario }});
    const applyDefaultProps = (x: any): ProjectT.IScenarioElement => {
      const { styles, params } = getConfigurablePropsOf(x.struct_type as Entity);
      return ({
        ...x,
        styles: {
          ...styles,
          ...(x.styles || {}),
        },
        parameters: {
          ...params,
          ...x.parameters,
          ...(x.parameters?.placeholder ? ({ textContent: x.parameters.placeholder }) : {}), // TODO: remove when placeholder will be renamed to textContent on backend
        },
      });
    };
    const applyMissingInfo = R.pipe(addParentId, applyDefaultProps);

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
        .map(applyMissingInfo)
        .reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
    };

    yield put(Actions.runLayoutAlgorithm(actualScenarios, actualScenariosElements));
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

function* copyActiveItemSaga() {
  const { itemId: activeItemID }: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  if (activeItemID !== 'none') {
    yield put(actionsCreators.setItemToCopy(activeItemID, currentScreen.id));
  }
}

type DuplicateContainerInfo = {
  sourceContainer: ProjectT.IScenarioItem;
  containersToDuplicate: ProjectT.IScenarioItem[];
  elementsToDuplicate: ProjectT.IScenarioElement[];
};

function* duplicateScreenSaga(action: ReturnType<typeof Actions.duplicateScreen>) {
  const { name } = action.payload;

  const sourceRoot: ReturnType<typeof selectors.selectRootScenario> = yield select(selectors.selectRootScenario);

  const itemsToCopy = sourceRoot?.parameters.children || [];
  const elementsToCopy = itemsToCopy.filter(item => item.slice(-1) !== 's');
  const containersToCopy = itemsToCopy.filter(item => item.slice(-1) === 's');


  const sourceCurrentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const projectID = currentProject.id;

  yield call(addScreenSaga, Actions.addScreen(projectID, name));
  yield put(setScreenLoader(true));
  
  const targetRoot: ReturnType<typeof selectors.selectRootScenario> = yield select(selectors.selectRootScenario);
  const targetRootID = targetRoot?.id || -1; 

  yield put(Actions.setActiveItem({ itemId: `${targetRootID}s`, itemType: 'root', name: 'Root' }));

  const targetActiveItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);

  for (let elementToCopy of elementsToCopy) { // loop need for sequential call
    yield call(duplicateItem, { id: elementToCopy, screenID: sourceCurrentScreen.id }, targetRootID, targetActiveItem );
  }
   
  const containersInfo: DuplicateContainerInfo[] = yield all(containersToCopy.map(
        item => call(getContainerToDuplicateInfo, { id: item, screenID: sourceCurrentScreen.id }
  )));

  for (let containerInfo of containersInfo) {
    yield call(duplicateContainer, containerInfo, `${targetRootID}s`)
  }

  yield put(setScreenLoader(false));
}

function* duplicateContainer(containerInfo: DuplicateContainerInfo, targetContainerID: string) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const targetContainer: ReturnType<typeof selectors.selectScenario> = yield select(
    selectors.selectScenario, parseInt(targetContainerID),
  );
  const { sourceContainer, containersToDuplicate, elementsToDuplicate } = containerInfo;

  const itemsToDuplicate = R.concat<T.IScenarioItem | T.IScenarioElement>(containersToDuplicate, elementsToDuplicate);

  const cLens = makeContainerLens();

  const newContainer: T.IScenarioItem = yield call(
    createContainer, R.pipe(
      R.set(cLens.parent, parseInt(targetContainerID)),
      R.set(cLens.screen, currentScreen.id),
      R.set(cLens.elements, []), // we must clean them because of one-to-many relationship between scenario and element. element may belong only to one scenario and here, if we don't clean them up, element is gonna belong to newContainer what breaks invariants with elements & parameters.children: params.children would have elements, but elements wouldn't in source container
    )(sourceContainer)
  );

  const independentContainersToDuplicate = containersToDuplicate.map(R.pipe(
    R.set(cLens.parent, newContainer.id),
    R.set(cLens.elements, []),
    R.set(cLens.children, []),
    R.set(cLens.screen, currentScreen.id),
  ));

  const eLens = makeElementLens();

  const independentElementsToDuplicate = elementsToDuplicate.map(R.pipe(
    R.set(eLens.scenario, newContainer.id),
    R.set(eLens.parent, newContainer.id),
  ));

  const duplicatedContainers: ReturnPromisedType<typeof apiAddScenarios> = yield call(
    reqWrapper, apiAddScenarios, { data: R.map(R.omit(['id']), independentContainersToDuplicate) }
  );

  const duplicatedElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper, apiAddElements, { data: R.map(R.omit(['id']), independentElementsToDuplicate) },
  );

  const duplicatedItems = R.concat<T.IScenarioItem | T.IScenarioElement>(duplicatedContainers, duplicatedElements);

  type IDsMap = Record<'s' | 'e', Record<'normal' | 'prefixed', Record<number | string, number | string>>>;

  const idsMap = itemsToDuplicate.reduce((acc: IDsMap, originalItem, idx) => {
    const postfix = ai.isContainer(originalItem) ? 's' : 'e';
    const duplicatedItem = duplicatedItems[idx];

    return {
      ...acc,
      [postfix]: {
        normal: {
          ...acc[postfix].normal,
          [originalItem.id]: duplicatedItem.id,
        },
        prefixed: {
          ...acc[postfix].prefixed,
          [`${originalItem.id}${postfix}`]: `${duplicatedItem.id}${postfix}`,
        },
      },
    };
  }, {
    s: {
      normal: { [sourceContainer.id]: newContainer.id },
      prefixed: { [`${sourceContainer.id}s`]: `${newContainer.id}s` }
    },
    e: { normal: {}, prefixed: {} },
  });

  const restoreChildRelationships = (x: T.IScenarioItem | T.IScenarioElement) => {
    if (ai.isContainer(x)) {
      return R.pipe(
        R.set(cLens.id, idsMap.s.normal[x.id]),
        R.over(cLens.elements, (elements: number[]) => elements.map(e => idsMap.e.normal[e])),
        R.over(cLens.children, (children: string[]) => children.map(c => idsMap[c.slice(-1) === 's' ? 's' : 'e'].prefixed[c])),
        R.over(cLens.parent, (p: number) => idsMap.s.normal[p]),
        R.set(cLens.screen, currentScreen.id),
      )(x);
    } else {
      return R.pipe(
        R.set(eLens.id, idsMap.e.normal[x.id]),
        R.over(eLens.scenario, (s: string) => idsMap.s.normal[s]),
        R.over(eLens.parent, (p: string) => idsMap.s.normal[p]),
      )(x);
    }
  };

  const restoreMainContainerRelationships = R.pipe(
    R.set(cLens.id, newContainer.id),
    R.set(cLens.parent, parseInt(targetContainerID)),
    R.set(cLens.screen, currentScreen.id),
    R.over(cLens.elements, (elements: number[]) => elements.map(e => idsMap.e.normal[e])),
    R.over(cLens.children, (children: string[]) => children.map(c => idsMap[c.slice(-1) === 's' ? 's' : 'e'].prefixed[c])),
  );

  const finalDuplicates = R.concat<T.IScenarioItem | T.IScenarioElement>(
    [restoreMainContainerRelationships(sourceContainer)], itemsToDuplicate.map(restoreChildRelationships)
  );

  const { newScenarios, newElements } = finalDuplicates.reduce((acc: any, x) => {
    const target = ai.isContainer(x) ? 'newScenarios' : 'newElements';
    return {
      ...acc,
      [target]: {
        ...acc[target],
        [x.id]: x,
      },
    }
  }, {});

  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenariosElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(selectors.selectScenariosElements);

  const finalScenarios = {
    ...scenarios,
    ...newScenarios,
    [targetContainer.id]: {
      ...targetContainer,
      parameters: { children: targetContainer.parameters.children.concat(`${newContainer.id}s`) },
    }
  };

  const finalElements = { ...scenariosElements, ...newElements };

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalElements));
  yield take(runLayoutAlgorithmFinishedType);

  const scenariosToUpdate = R.values(R.pick([
    targetContainer.id,
    sourceContainer.id, // research: seems like backend resets elements of sourceContainer to []
    ...R.values(newScenarios).map(x => x.id),
  ], finalScenarios));
  const elementsToUpdate = R.values(R.pick(R.values(newElements).map(x => x.id), finalElements));

  yield fork(reqWrapper, apiSaveScenarios, { data: scenariosToUpdate });
  yield fork(reqWrapper, apiSaveElements, { data: elementsToUpdate });
}

function* duplicateItem(itemToCopyInfo: ItemToCopyInfo, targetContainerID: number, activeItem: ActiveItem) {
  const elementToDuplicate = yield call(getElementToDuplicate, itemToCopyInfo);

  if (!elementToDuplicate) {
    console.error(`Didn't find element to duplicate.`);
    return;
  }

  const targetContainer: ReturnType<typeof selectors.selectScenario> = yield select(
    selectors.selectScenario, targetContainerID,
  );

  const eLens = makeElementLens();
  const cLens = makeContainerLens();

  const createdElement: ReturnPromisedType<typeof apiAddElements>[number] = (yield call(
    reqWrapper, apiAddElements, {
      data: [R.pipe(
        R.omit(['id']),
        R.set(eLens.parent, targetContainer.id),
        R.set(eLens.scenario, targetContainer.id),
      )(elementToDuplicate)]
    }))[0];

  const isContainerSelected = ai.isContainer(activeItem.itemId);
  const updatedTargetContainer = R.pipe(
    R.over(cLens.elements, (es: number[]) => es.concat(createdElement.id)),
    R.over(cLens.children, (children: string[]) => isContainerSelected
        ? children.concat(`${createdElement.id}e`) :
        R.insert(
          children.indexOf(activeItem.itemId) + 1,
          `${createdElement.id}e`,
          children
        )),
  )(targetContainer);

  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  const finalScenarios = {
    ...scenarios,
    [targetContainer.id]: updatedTargetContainer,
  };

  const finalScenarioElements = {
    ...scenarioElements,
    [createdElement.id]: createdElement,
  };

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalScenarioElements));

  const scenariosToUpdate = R.values(R.pick([targetContainer.id.toString()], finalScenarios));
  yield fork(reqWrapper, apiSaveScenarios, { data: scenariosToUpdate });
}

function* pasteCopiedItemSaga() {

  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const targetContainerID: ReturnType<typeof selectors.selectClosestContainerID> = yield select(
    selectors.selectClosestContainerID, activeItem.itemId,
  );
  const itemToCopyInfo: ReturnType<typeof selectors.selectItemToCopyInfo> = yield select(selectors.selectItemToCopyInfo);

  if (activeItem.itemType !== 'none' && targetContainerID !== null && itemToCopyInfo !== null) {
    const { id: itemToCopyID } = itemToCopyInfo;
    const itemToCopyIsContainer = itemToCopyID.slice(-1) === 's';

    if (itemToCopyIsContainer) {
      const duplicateContainerInfo: DuplicateContainerInfo = yield call(getContainerToDuplicateInfo, itemToCopyInfo);
      yield call(duplicateContainer, duplicateContainerInfo, targetContainerID);
    } else {
      yield call(duplicateItem, itemToCopyInfo, parseInt(targetContainerID), activeItem);
    }
  }
}

function* getElementToDuplicate(itemToCopyInfo: ProjectT.ItemToCopyInfo) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const itemFromAnotherScreen = currentScreen.id !== itemToCopyInfo.screenID;

  const elementToDuplicate: ProjectT.IScenarioElement = itemFromAnotherScreen
    ? yield call(reqWrapper, apiGetElement, { id: parseInt(itemToCopyInfo.id) })
    : yield select(selectors.selectScenarioElement, parseInt(itemToCopyInfo.id));

  return elementToDuplicate;
}

function* getContainerToDuplicateInfo(itemToCopyInfo: ProjectT.ItemToCopyInfo) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const itemFromAnotherScreen = currentScreen.id !== itemToCopyInfo.screenID;

  if (itemFromAnotherScreen) {
    const scenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
      reqWrapper, apiGetScenarios, { screenID: itemToCopyInfo.screenID }
    );
    const scenariosElements: ReturnPromisedType<typeof apiGetElements> = yield call(reqWrapper, apiGetElements, {
      scenariosIDs: [scenarios.map(x => x.id)],
    });
    const itemToCopyID = parseInt(itemToCopyInfo.id);
    const sourceContainer = scenarios.find(s => s.id === itemToCopyID);

    if (sourceContainer === undefined) {
      throw new Error(`Didn't find source container info.`);
    }

    const { scenariosIDs, elementsIDs } = collectChildren(scenarios, sourceContainer.parameters.children);
  
    const containersToPickIDs = scenariosIDs.map(x => parseInt(x));
    const elementsToPickIDs = elementsIDs.map(x => parseInt(x));
    const containersToDuplicate = scenarios.filter(x => containersToPickIDs.includes(x.id));
    const elementsToDuplicate = scenariosElements.filter(x => elementsToPickIDs.includes(x.id));

    return {
      sourceContainer,
      containersToDuplicate,
      elementsToDuplicate,
    } as DuplicateContainerInfo;
  } else {
    const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
    const scenariosElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(selectors.selectScenariosElements);
    const sourceContainer: ReturnType<typeof selectors.selectScenario> = yield select(
      selectors.selectScenario, parseInt(itemToCopyInfo.id),
    );
  
    const { scenariosIDs, elementsIDs } = collectChildren(R.values(scenarios), sourceContainer.parameters.children);
  
    const containersToDuplicate = R.values(R.pick(scenariosIDs.map(x => parseInt(x).toString()), scenarios));
    const elementsToDuplicate = R.values(R.pick(elementsIDs.map(x => parseInt(x).toString()), scenariosElements));
  
    return {
      sourceContainer,
      containersToDuplicate,
      elementsToDuplicate,
    } as DuplicateContainerInfo;
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
const setListSortableType: ProjectT.SetListSortable['type'] = 'PROJECTS:SET_LIST_SORTABLE';
const updateElementStylesType: ProjectT.UpdateElementStyles['type'] = 'PROJECTS:UPDATE_ELEMENT_STYLES';
const updateScenarioStylesType: ProjectT.UpdateScenarioStyles['type'] = 'PROJECTS:UPDATE_SCENARIO_STYLES';
const updateElementParametersType: ProjectT.UpdateElementParameters['type'] = 'PROJECTS:UPDATE_ELEMENT_PARAMETERS';
const updateElementImageType: ProjectT.UpdateElementImage['type'] = 'PROJECTS:UPDATE_ELEMENT_IMAGE';
const addElementsIntoContainerType: ProjectT.AddElementsIntoContainer['type'] = 'PROJECTS:ADD_ELEMENTS_INTO_CONTAINER';
const renameScenarioType: ProjectT.RenameScenario['type'] = 'PROJECTS:RENAME_SCENARIO';
const wrapIntoContainerType: ProjectT.WrapIntoContainer['type'] = 'PROJECTS:WRAP_INTO_CONTAINER';
const deleteActiveItemType: ProjectT.DeleteActiveItem['type'] = 'PROJECTS:DELETE_ACTIVE_ITEM';
const uploadFileType: ProjectT.UploadFile['type'] = 'PROJECTS:UPLOAD_FILE';
const getScreenNNType: ProjectT.GetScreenNN['type'] = 'PROJECTS:GET_SCREEN_NN';
const runLayoutAlgorithmType: ProjectT.RunLayoutAlgorithm['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM';
const copyActiveItemType: ProjectT.CopyActiveItem['type'] = 'PROJECTS:COPY_ACTIVE_ITEM';
const pasteCopiedItemType: ProjectT.PasteCopiedItem['type'] = 'PROJECTS:PASTE_COPIED_ITEM';
type ActionsToAutoSave = ProjectT.UpdateScenarioStyles | ProjectT.UpdateElementStyles | ProjectT.UpdateElementParameters;

export default function* projectSaga() {
  yield takeLatest(runLayoutAlgorithmType, runLayoutAlgorithm);
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
  yield takeLatest(setListSortableType, setListSortableSaga);

  yield takeLatest(updateElementStylesType, updateElementStyles);
  yield takeLatest(updateScenarioStylesType, updateScenarioStyles);
  yield takeLatest(updateElementImageType, updateElementImage);
  yield takeLatest(updateElementParametersType, updateElementParameters);

  yield takeEvery(addElementsIntoContainerType, addElementsIntoContainerSaga);
  yield takeLatest(renameScenarioType, renameScenarioSaga);
  yield takeEvery(wrapIntoContainerType, wrapIntoContainerSaga);

  yield takeLatest(deleteActiveItemType, deleteActiveItemSaga);

  yield takeLatest(copyActiveItemType, copyActiveItemSaga);
  yield takeEvery(pasteCopiedItemType, pasteCopiedItemSaga);

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
