import { call, put, select, take, fork } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import { getParams } from '$utils/parseScenario';
import {
  completeLS,
} from '$utils/LayoutAlgorithm';
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
import { isScenario, getConfigurablePropsOf, Entity } from '$domain/core';

import { selectors, T } from '../';

const runLayoutAlgorithmFinishedType: T.RunLayoutAlgorithmFinished['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED';

export function* runLayoutAlgorithm(action: T.RunLayoutAlgorithm) {
  const { scenarios: screenScenarios, elements: scenariosElements, root } = action.payload;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  const rootScenario = screenScenarios[currentScreen.listSortable.root.id];

  const listSortable = completeLS(
    screenScenarios,
    scenariosElements,
    root || (rootScenario && {
      ...currentScreen.listSortable.root,
      children: rootScenario.parameters.children,
    }) || currentScreen.listSortable.root,
  );

  const updatedScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...listSortable,
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

export function* addElementsIntoContainerSaga(action: ReturnType<typeof Actions.addElementsIntoContainer>) {
  const { elements: elementsToFormScenario } = action.payload;
  const libraryElements: ReturnType<typeof selectors.selectLibraryElements> = yield select(selectors.selectLibraryElements);
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  const activeItem = yield select(selectors.selectActiveItem);
  const activeContainer = yield select(selectors.selectClosestContainerID, activeItem.itemId);
  const activeContainerID = parseInt(activeContainer, 10);

  const elementsToCreate = elementsToFormScenario.reduce((acc: T.IScenarioElement[], element) => {
    const libraryElement = libraryElements[element.structType as T.LibraryElementType][element.funcType]; // TODO: remove unused params/styles from backend
    const { styles, params } = getConfigurablePropsOf(libraryElement.struct_type as Entity);

    const x: T.IScenarioElement = {
      scenario: activeContainerID,
      buoyancy: 0,
      dynamic_buoyancy: 0,
      name: 'Element',
      struct_type: libraryElement.struct_type,
      func_type: libraryElement.func_type,
      id: -1000, // will be omitted and set by server
      image: null, // always null
      parameters: {
        parent_id: activeContainerID,
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
  const updatedActiveContainer = screenScenarios.find(x => x.id === activeContainerID) as T.IScenarioItem;

  const finalActiveContainer = {
    ...updatedActiveContainer,
    parameters: {
      children: updatedActiveContainer.parameters.children.concat(createdElements.map(x => `${x.id}e`)),
    }
  };

  const finalScenarios: T.IScenarios = {
    [updatedActiveContainer.id]: finalActiveContainer,
    ...R.omit(
      [finalActiveContainer.id.toString()],
      screenScenarios.reduce((acc: T.IScenarios, x) => ({ ...acc, [x.id]: x }), {})
    ),
  };

  const finalScenarioElements = {
    ...scenarioElements,
    ...createdElements.reduce((acc: T.IScenarioElements, x) => ({ ...acc, [x.id]: x }), {}),
  }

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalScenarioElements));
  yield take(runLayoutAlgorithmFinishedType);

  const scenariosToUpdate = R.values(R.pick([finalActiveContainer.id.toString()], finalScenarios));
  yield fork(reqWrapper, apiSaveScenarios, { data: scenariosToUpdate });
}

export function* delScenarioSaga(action: ReturnType<typeof Actions.delScenario>) {
  const { payload: { id: rawID } } = action;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const { listSortable } = currentScreen;

  const collectAllItemsIDsToRemove = (acc: string[], listSortable: T.IListSortable, itemID: string): string[] => {
    if (listSortable[itemID].children.length === 0) {
      return [itemID];
    }

    return listSortable[itemID].children.reduce(
      (innerAcc, x) => innerAcc.concat(collectAllItemsIDsToRemove(acc, listSortable, x)), [itemID]
    )
  };

  const itemID = parseInt(rawID);
  const isElement = rawID.slice(-1) === 'e';
  const item = isElement ? scenarioElements[itemID] : scenarios[itemID];

  const allItemsToDelete = collectAllItemsIDsToRemove([rawID], listSortable, rawID);

  const [rawScenariosToDelete, rawElementsToDelete] = allItemsToDelete.reduce((acc: [string[], string[]], x) => {
    return x.slice(-1) === 's' ? [[...acc[0], x], acc[1]] : [acc[0], [...acc[1], x]]
  }, [[], []]);
  const scenariosToDelete = rawScenariosToDelete.map(x => parseInt(x));
  const elementsToDelete = rawElementsToDelete.map(x => parseInt(x));

  const itemParentID = isScenario(item) ? item.parent_id : item.parameters.parent_id;
  const finalParentID = itemParentID === -1 ? listSortable.root.id : itemParentID;
  const itemParent = scenarios[finalParentID];

  const updateItemParent: T.IScenarioItem = {
    ...itemParent,
    elements: isElement ? R.without([itemID], itemParent.elements) : itemParent.elements,
    parameters: {
      ...itemParent.parameters,
      children: R.without([rawID], itemParent.parameters.children),
    },
  };

  const finalScenarios = {
    ...R.omit(scenariosToDelete.map(String), scenarios),
    [updateItemParent.id]: updateItemParent,
  };
  const finalScenarioElements = R.omit(elementsToDelete.map(String), scenarioElements);

  const { type, name } = getParams(`${updateItemParent.id}s`, finalScenarioElements, finalScenarios);
  const parentIsRoot = listSortable.root.id === updateItemParent.id;

  const newActiveElemAfterDeletion = document.querySelector<HTMLElement>(`[data-ls-id='${updateItemParent.id}s']`);
  newActiveElemAfterDeletion?.focus();

  yield put(Actions.setActiveItem({
    itemId: `${updateItemParent.id}s`,
    itemType: parentIsRoot ? 'root' : type,
    name,
  }));

  yield put(Actions.runLayoutAlgorithm(finalScenarios, finalScenarioElements));
  yield take(runLayoutAlgorithmFinishedType);

  if (!R.isEmpty(elementsToDelete)) {
    yield call(reqWrapper, apiDelElements, { list: elementsToDelete });
  }

  if (!R.isEmpty(scenariosToDelete)) {
    yield call(reqWrapper, apiDelScenarioCascade, { list: scenariosToDelete });
  }

  yield call(reqWrapper, apiSaveScenarios, {
    data: R.values(R.pick([updateItemParent.id.toString()], finalScenarios))
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
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );
  const { listSortable } = currentScreen;

  if (activeItem.itemType === 'root') return;

  const rawItemID = activeItem.itemId;
  const lsItem = listSortable[rawItemID];
  const itemID = lsItem.id;

  const itemIsElement = rawItemID.slice(-1) === 'e';

  const itemParent = R.values(listSortable).find(x => x.children.some(c => c === rawItemID)) as T.ILSItem;
  const item = itemIsElement ? scenarioElements[itemID] : scenarios[itemID];
  const itemParentContainer = scenarios[itemParent.id];

  const { styles, params } = getConfigurablePropsOf('container');
  const containerWrapper: T.IScenarioItem = yield call(createContainer, {
    name: 'Container',
    parent_id: itemParent.id,
    elements: itemIsElement ? [item.id] : [],
    parameters: {
      ...params,
      children: [rawItemID],
    },
    styles,
  });

  const updatedItemParentContainer: T.IScenarioItem = {
    ...itemParentContainer,
    elements: R.without(itemIsElement ? [item.id] : [], itemParentContainer.elements),
    parameters: {
      ...itemParentContainer.parameters,
      children: itemParentContainer.parameters.children.map(x => x === rawItemID ? `${containerWrapper.id}s` : x),
    },
  };

  const elementsToUpdate: T.IScenarioElement[] = [];
  const scenariosToUpdate: T.IScenarioItem[] = [updatedItemParentContainer, containerWrapper];

  if (isScenario(item)) {
    const updatedScenario: T.IScenarioItem = {
      ...item,
      parent_id: containerWrapper.id,
    };

    scenariosToUpdate.push(updatedScenario);
  } else {
    const updatedElement: T.IScenarioElement = {
      ...item,
      scenario: containerWrapper.id,
      parameters: {
        ...item.parameters,
        parent_id: containerWrapper.id,
      }
    };

    elementsToUpdate.push(updatedElement);
  }

  const finalScenarios = {
    ...scenarios,
    ...scenariosToUpdate.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
  };

  const finalScenarioElements = {
    ...scenarioElements,
    ...elementsToUpdate.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
  }

  const rootWasChanged = updatedItemParentContainer.id === listSortable.root.id;

  const updatedListSortable = completeLS(
    finalScenarios,
    finalScenarioElements,
    rootWasChanged ? {
      ...listSortable.root,
      children: updatedItemParentContainer.parameters.children
    } : listSortable.root,
  );

  const updatedScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...updatedListSortable,
    },
  };

  yield put(Actions.updateViewTree({
    screen: updatedScreen,
    scenarios: finalScenarios,
    scenarioElements: finalScenarioElements,
  }));

  elementsToUpdate.length > 0 && (yield call(reqWrapper, apiSaveElements, { data: elementsToUpdate }));

  yield call(reqWrapper, apiSaveScenarios, { data: scenariosToUpdate });
}
