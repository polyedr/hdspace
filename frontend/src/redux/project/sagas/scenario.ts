import { SagaIterator } from 'redux-saga';
import { call, put, select, take, fork } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import {
  convertScenarios,
  getNewScenario,
  convertScenarioElements,
  getParams,
} from '$utils/parseScenario';
import {
  formingListEl,
  formingListGroup,
  formingListBlock,
  completeLS,
} from '$utils/LayoutAlgorithm';
import {
  apiAddElements,
  apiDelElements,
  apiGetElements,
  apiSaveElements,
} from '$api/element';
import {
  apiGetScenarios,
  apiAddScenario,
  apiAddScenarios,
  apiDelScenarioCascade,
  apiSaveScenario,
  apiSaveScenarios,
} from '$api/scenario';
import { DEFAULT_INDENTS } from '$constants/defaultParams';
import { reqWrapper } from '$redux/project/sagas/index';
import { ReturnPromisedType } from '$shared/types';

import { selectors, T } from '../';
import { isScenario } from '$utils/model';

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

// made it unused
export function* changeScenariosSaga(action: ReturnType<typeof Actions.changeScenarios>) {
  const { screenID } = action.payload;
  yield put(Actions.setScenarioLoader(true));

  const serverScreenScenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
    reqWrapper, apiGetScenarios, { screenID },
  );

  if (!serverScreenScenarios) return;

  const screenScenarios = convertScenarios(serverScreenScenarios);
  const scenariosIDs = Object.keys(screenScenarios);
  yield put(Actions.setScenarios(screenScenarios));

  const serverScenariosElements: ReturnPromisedType<typeof apiGetElements> = scenariosIDs.length > 0
    ? yield call(reqWrapper, apiGetElements, { scenariosIDs })
    : [];

  if (!serverScenariosElements) return;

  const scenariosElements = convertScenarioElements(serverScenariosElements);
  console.log('scenariosElements', scenariosElements);
  yield put(Actions.setScenarioElements(scenariosElements));

  yield put(Actions.runLayoutAlgorithm(screenScenarios, scenariosElements));
  yield take(runLayoutAlgorithmFinishedType);

  yield put(Actions.setScenarioLoader(false));
}

// don't know this saga's purpose
export function* changeScenarioSaga(action: ReturnType<typeof Actions.changeScenario>) {
  console.log('changeScenarioSaga!');
}

// unused
export function* createScenarioSaga(action: ReturnType<typeof Actions.createScenario>) {
  const { payload: { name, type, elements } } = action;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);

  const newScenario = getNewScenario(name, type, currentScreen.id, elements);
  const resultScenario: ReturnPromisedType<typeof apiAddScenario> = yield call(reqWrapper, apiAddScenario, newScenario);

  if (!resultScenario) return;

  const scenariosIDs = [...currentScreen.screenscenario, resultScenario.id];
  const scenariosElements: ReturnPromisedType<typeof apiGetElements> = yield call(reqWrapper, apiGetElements, { scenariosIDs });

  if (!scenariosElements) return;

  const updatedScenarioElements = convertScenarioElements(scenariosElements);

  yield put(Actions.setScreen(R.assoc('screenscenario', scenariosIDs, currentScreen)));
  yield put(Actions.setScenarios({ ...scenarios, [resultScenario.id]: resultScenario }));
  yield put(Actions.setScenarioElements(updatedScenarioElements));
  // yield call(runLayoutAlgorithm, updateScenarioElements);
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

export function* addScenarioSagaV2(action: ReturnType<typeof Actions.addScenario>) {
  const { parentScenarioID = 0, name = 'Container', elements: elementsToFormScenario } = action.payload;
  const libraryElements: ReturnType<typeof selectors.selectLibraryElements> = yield select(selectors.selectLibraryElements);
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  const rootLSItem = currentScreen.listSortable.root;

  const container: T.IScenarioItem = yield call(createContainer, {
    parent_id: rootLSItem.id,
    name,
  });

  const elementsToCreate = elementsToFormScenario.reduce((acc: T.IScenarioElement[], element) => {
    // add parameters specific to particular elements, but for now return as is
    const libraryElement = libraryElements[element.type];
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
      },
      styles: {
        ...DEFAULT_INDENTS,
      },
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

export function* addScenarioSaga(action: ReturnType<typeof Actions.addScenario>) {
  const { payload: { parentScenarioID: setParentID = 0, name = 'Scenario name', elements: elementsToFormScenario } } = action;
  const libraryElements: ReturnType<typeof selectors.selectLibraryElements> = yield select(selectors.selectLibraryElements);
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  const parentScenarioID = setParentID === null ? Number(undefined) : setParentID; // when NaN - create new scenario, when number exists - add elements into specified scenario
  // Complete List Element
  const { newEl, existEl } = formingListEl(
    parentScenarioID, elementsToFormScenario, libraryElements, scenarioElements,
  );
  const apiListEl = newEl.map(el => R.pipe(R.assoc('scenario', null), R.omit(['id']))(el));

  const createdElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper, apiAddElements,
    { data: apiListEl },
  );
  // const lastIdE = Object.keys(scenarioElements)
  //   .reduce((max, id) => (max > Number(id) ? max : Number(id)), 0);
  // const createdElements = newEl.map((el, i) => ({ ...el, id: lastIdE + i + 1 }));

  if (!createdElements) return;

  // Complete List Group
  const { newGroups, existGroups } = formingListGroup(
    currentScreen.id,
    [...existEl, ...createdElements],
    scenarios,
  );
  const apiListGroup = newGroups.map(group => R.omit(['id'], group));
  const createdGroups: ReturnPromisedType<typeof apiAddScenarios> = yield call(
    reqWrapper, apiAddScenarios, { data: apiListGroup },
  );
  // const lastIdG = Object.keys(scenarios).reduce((max, id) => (
  //   max > Number(id) ? max : Number(id)
  // ), 0);
  // const createdGroups = newGroups.map((g, i) => ({ ...g, id: lastIdG + i + 2 }));

  if (!createdGroups) return;

  const actualScenariosElements = createdElements
    .map((el) => {
      const currGroup = createdGroups.find(group => group.parameters.children.indexOf(`${el.id}e`) !== -1);
      const parent_id = currGroup?.id || el.parameters.parent_id;

      return {
        ...el,
        parameters: {
          ...el.parameters,
          parent_id,
        },
      };
    })
    .concat(existEl)
    .sort((a, b) => a.parameters.parent_id - b.parameters.parent_id);

  const actualGroups = existGroups.concat(createdGroups).sort((a, b) => a.parent_id - b.parent_id);

  // Complete List Block
  const { newBlocks, existBlocks } = formingListBlock(
    name,
    currentScreen.id,
    actualScenariosElements,
    actualGroups,
    scenarios,
  );
  const apiListBlock = newBlocks.map(block => R.omit(['id'], block));
  // const lastIdB = existBlocks.concat(actualGroups).reduce((max, b) => (
  //   max > b.id ? max : b.id
  // ), 0);
  const createdBlocks: ReturnPromisedType<typeof apiAddScenarios> = apiListBlock.length
    ? yield call(reqWrapper, apiAddScenarios, { data: apiListBlock })
    // ? apiListBlock.map((b, i) => ({ ...b, id: lastIdB + i + 1 }))
    : [];

  if (!createdBlocks) return;

  const allBlocks = existBlocks.concat(createdBlocks);
  const updatedGroups = allBlocks
    .reduce((acc: T.IScenarioItem[], block) => {
      const blockGroups = createdGroups.filter(g => block.parameters.children.indexOf(`${g.id}s`) !== -1)
        .map((g): T.IScenarioItem => ({ ...g, parent_id: block.id }));

      return acc.concat(...blockGroups);
    }, [])
    .concat(existGroups);
  const updatedScenariosElements: T.IScenarioElement[] = actualScenariosElements.map((el) => {
    const elementGroup = updatedGroups.find(({ id }) => id === el.parameters.parent_id);

    return elementGroup ? { ...el, scenario: elementGroup.parent_id } : el;
  });

  // Complete List Container
  const existContainer = Object.keys(scenarios).reduce((acc: T.IScenarioItem[], key) => (
    scenarios[key].struct_type === 'container' ? acc.concat(scenarios[key]) : acc
  ), []);
  // Render Items Scenario
  const finalScenarios: T.IScenarios = allBlocks.concat(existContainer, updatedGroups)
    .reduce((acc, item) => ({
      ...acc,
      [item.id]: item,
    }), {});

  const finalScenarioElements: T.IScenarioElements = updatedScenariosElements.reduce((acc, el) => ({
    ...acc,
    [el.id]: el,
  }), {});

  const listSortable = completeLS(
    finalScenarios,
    finalScenarioElements,
    currentScreen.listSortable.root,
  );

  const updatedScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...listSortable,
    },
  };

  yield put(Actions.setScreen(updatedScreen));

  const listScenario = allBlocks.concat(updatedGroups);
  const updateScenarios = listScenario.reduce((obj, item) => ({
    ...obj,
    [item.id]: item,
  }), scenarios);
  yield put(Actions.setScenarios(updateScenarios));

  const listScenarioElement = updatedScenariosElements.reduce((obj, el) => ({
    ...obj,
    [el.id]: el,
  }), scenarioElements);
  yield put(Actions.setScenarioElements(listScenarioElement));

  // Save result Layout Algorithm
  const resultScenarioEl: T.IScenarioElement[] = yield call(
    reqWrapper, apiSaveElements,
    { data: updatedScenariosElements },
  );
  const resultScenario: T.IScenarioItem[] = yield call(
    reqWrapper, apiSaveScenarios,
    { data: listScenario },
  );
  console.log('SAVE NEW SCENARIO', { resultScenario, resultScenarioEl });
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

export function* renameScenarioSaga(
  { payload: { scenarioID, name } }: ReturnType<typeof Actions.renameScenario>,
): SagaIterator {
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

export function* addContainerSaga(action: ReturnType<typeof Actions.addContainer>) {
  const { itemID: rawItemID } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );
  const { listSortable } = currentScreen;

  const lsItem = listSortable[rawItemID];
  const itemID = lsItem.id;

  if (lsItem.type === 'root') return;

  const itemIsElement = rawItemID.slice(-1) === 'e';

  const itemParent = R.values(listSortable).find(x => x.children.some(c => c === rawItemID)) as T.ILSItem;
  const item = itemIsElement ? scenarioElements[itemID] : scenarios[itemID];
  const itemParentContainer = scenarios[itemParent.id];

  const containerWrapper: T.IScenarioItem = yield call(createContainer, {
    name: 'Container',
    parent_id: itemParent.id,
    elements: itemIsElement ? [item.id] : [],
    parameters: {
      children: [rawItemID],
    },
    styles: {
      ...DEFAULT_INDENTS,
      display: 'flex',
      'flex-direction': 'row',
      'justify-content': 'flex-start',
      'align-items': 'stretch',
    },
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
