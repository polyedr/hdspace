import { call, put, select, take, fork } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import { getParams } from '$utils/parseScenario';
import {
  apiAddElements,
  apiDelElements,
  apiSaveElements,
} from '$api/element';
import {
  apiGetScenarios,
  apiAddScenarios,
  apiDelScenarioCascade,
  apiSaveScenario,
  apiSaveScenarios,
} from '$api/scenario';
import { DEFAULT_INDENTS } from '$constants/defaultParams';
import { reqWrapper } from '$redux/project/sagas/index';
import { ReturnPromisedType } from '$shared/types';
import { getConfigurablePropsOf, Entity } from '$domain/core';
import * as ai from '$domain/abstractInterface';

import { selectors, T } from '../';

const runLayoutAlgorithmFinishedType: T.RunLayoutAlgorithmFinished['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED';

// rename runLayoutAlgorithm -> updateAbstractInterface/updateAI
export function* runLayoutAlgorithm(action: T.RunLayoutAlgorithm) {
  const { scenarios: screenScenarios, elements: scenariosElements } = action.payload;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  const newAIMap = ai.constructAIMap(screenScenarios, scenariosElements);

  const updatedScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...newAIMap,
    },
  };

  yield put(Actions.updateViewTree({
    screen: updatedScreen,
    scenarios: screenScenarios,
    scenarioElements: scenariosElements,
  }));

  yield put(Actions.runLayoutAlgorithmFinished());
}

export function* createContainer(scenario?: Partial<T.IScenarioItem>) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen
  );

  const containerToCreate: T.IScenarioItem = {
    parent_id: -1, // if parent_id = -1, is container that contains all other elements
    id: -100, // will be omitted and set by server
    name: 'Root',
    struct_type: 'container',
    screen: currentScreen.id,
    buoyancy: 0, // buoyancy can be omitted, cause it is can be expressed using list
    direction: 'vertical',
    elements: [],
    parameters: {
      // parent_id, do we need it? or it already expressed using parent_id placed on the upper level
      children: [], // level up into children field
    },
    styles: {
      ...DEFAULT_INDENTS,
    },
    ...scenario,
  };

  const createdContainers: ReturnPromisedType<typeof apiAddScenarios> = yield call(
    reqWrapper, apiAddScenarios, { data: [R.omit(['id'], containerToCreate)] }
  );

  return createdContainers[0];
}

export function* addScenarioSaga(action: ReturnType<typeof Actions.addScenario>) {
  const { parentScenarioID = 0, name = 'Container', elements: elementsToFormScenario } = action.payload;
  const libraryElements: ReturnType<typeof selectors.selectLibraryElements> = yield select(selectors.selectLibraryElements);
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  const rootLSItem = currentScreen.listSortable.root;

  const { styles, params } = getConfigurablePropsOf('container');
  const container: T.IScenarioItem = yield call(createContainer, {
    parent_id: rootLSItem.id,
    name,
    parameters: {
      ...params,
      children: [],
    },
    styles,
  });

  const elementsToCreate = elementsToFormScenario.reduce((acc: T.IScenarioElement[], element) => {
    const libraryElement = libraryElements[element.structType as T.LibraryElementType][element.funcType]; // TODO: remove unused params/styles from backend
    const { styles, params } = getConfigurablePropsOf(libraryElement.struct_type as Entity);

    const x: T.IScenarioElement = {
      scenario: container.id,
      buoyancy: 0,
      dynamic_buoyancy: 0,
      name: 'Element',
      struct_type: libraryElement.struct_type,
      func_type: libraryElement.func_type,
      id: -1000, // will be omitted and set by server
      image: null, // always null
      parameters: {
        parent_id: container.id, // do we need this if we already have scenario?
        group: `don't know what is this`,
        ...libraryElement.parameters,
        ...params,
      },
      styles,
    };
    return acc.concat(x);
  }, []);

  const createdElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper, apiAddElements, { data: R.map(R.omit(['id']), elementsToCreate) },
  );

  // need endpoint to get specific scenario by id
  const screenScenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
    reqWrapper, apiGetScenarios, { screenID: currentScreen.id }
  );

  // updatedContainer now has id set by backend
  const updatedContainer = screenScenarios.find(x => x.id === container.id) as T.IScenarioItem;
  const updatedRootScenario = screenScenarios.find(x => x.id === rootLSItem.id) as T.IScenarioItem;

  const finalContainer: T.IScenarioItem = {
    ...updatedContainer,
    elements: createdElements.map(x => x.id),
    parameters: {
      children: createdElements.map(x => `${x.id}e`),
    }
  };

  const finalRootScenario = {
    ...updatedRootScenario,
    parameters: {
      children: updatedRootScenario.parameters.children.concat(`${finalContainer.id}s`),
    }
  };

  const finalScenarios: T.IScenarios = {
    [finalRootScenario.id]: finalRootScenario,
    [updatedContainer.id]: finalContainer,
    ...R.omit(
      [finalRootScenario.id.toString(), updatedContainer.id.toString()],
      screenScenarios.reduce((acc: T.IScenarios, x) => ({ ...acc, [x.id]: x }), {})
    ),
  };

  const finalScenarioElements = {
    ...scenarioElements,
    ...createdElements.reduce((acc: T.IScenarioElements, x) => ({ ...acc, [x.id]: x }), {}),
  }

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalScenarioElements));
  yield take(runLayoutAlgorithmFinishedType);

  const scenariosToUpdate = R.values(R.pick(
    [finalRootScenario.id.toString(), updatedContainer.id.toString()], finalScenarios
  ));
  yield fork(reqWrapper, apiSaveScenarios, { data: scenariosToUpdate });
}

export function* deleteActiveItemSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);

  if (['root', 'none'].includes(activeItem.itemType)) return;

  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const { listSortable } = currentScreen;

  const itemToRemoveParentID = ai.getItemParentID(scenarios, scenarioElements, activeItem.itemId);

  const {
    scenarios: finalScenarios, elements: finalElements, removedItems,
  } = ai.removeItem(scenarios, scenarioElements, listSortable, activeItem.itemId);

  const { type, name } = getParams(`${itemToRemoveParentID}s`, finalElements, finalScenarios);
  const parentIsRoot = itemToRemoveParentID === listSortable.root.id;

  yield put(Actions.setActiveItem({
    itemId: `${itemToRemoveParentID}s`,
    itemType: parentIsRoot ? 'root' : type,
    name,
  }));

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalElements));
  yield take(runLayoutAlgorithmFinishedType);

  const newActiveElemAfterDeletion = document.querySelector<HTMLElement>(`[data-ls-id='${itemToRemoveParentID}s']`);
  newActiveElemAfterDeletion?.focus();

  if (!R.isEmpty(removedItems.e)) {
    yield call(reqWrapper, apiDelElements, { list: removedItems.e });
  }

  if (!R.isEmpty(removedItems.s)) {
    yield call(reqWrapper, apiDelScenarioCascade, { list: removedItems.s });
  }

  yield call(reqWrapper, apiSaveScenarios, {
    data: R.values(R.pick([itemToRemoveParentID.toString()], finalScenarios))
  });
}

export function* renameScenarioSaga(action: ReturnType<typeof Actions.renameScenario>) {
  const { scenarioID, name } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);

  const updateScenario = {
    ...scenarios[scenarioID],
    name: name,
  };

  const result_scenario: T.IScenarioItem = yield call(
    reqWrapper, apiSaveScenario,
    { data: updateScenario },
  );

  const updateScenarios = {
    ...scenarios,
    [result_scenario.id]: result_scenario,
  };

  yield put(Actions.setScenarios(updateScenarios));
}

export function* wrapIntoContainerSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  if (['root', 'none'].includes(activeItem.itemType)) return;

  const rawItemID = activeItem.itemId;

  const { styles, params } = getConfigurablePropsOf('container');
  const containerWrapper: T.IScenarioItem = yield call(createContainer, {
    name: 'Container',
    parameters: {
      ...params,
      children: [rawItemID],
    },
    styles,
  });

  const {
    scenarios: newScenarios, elements: newElements, affectedItemsIDs
  } = ai.wrapIntoContainer(scenarios, scenarioElements, containerWrapper, rawItemID);

  const finalScenarios = {
    ...scenarios,
    ...newScenarios
  };

  const finalScenarioElements = {
    ...scenarioElements,
    ...newElements,
  };

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalScenarioElements));
  yield take(runLayoutAlgorithmFinishedType);

  const activeItemElement = document.querySelector<HTMLElement>(`[data-ls-id='${activeItem.itemId}']`);
  activeItemElement?.focus();

  affectedItemsIDs.e.length > 0 && (
    yield call(reqWrapper, apiSaveElements, {
      data: R.values(R.pick(R.map(R.toString, affectedItemsIDs.e), finalScenarioElements))
    })
  );

  yield call(reqWrapper, apiSaveScenarios, {
    data: R.values(R.pick(R.map(R.toString, affectedItemsIDs.s), finalScenarios))
  });
}
