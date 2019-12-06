import { SagaIterator } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import {
  getElAndChildren,
} from '$utils/parseListItems';
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

const runLayoutAlgorithmFinishedType: T.RunLayoutAlgorithmFinished['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED';

export function* runLayoutAlgorithm(action: T.RunLayoutAlgorithm) {
  const { scenarios: screenScenarios, elements: scenariosElements } = action.payload;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);
  type Acc = {
    blocks: T.IScenarioItem[];
    containers: T.IScenarioItem[];
    groups: T.IScenarioItem[];
  };
  const { blocks, containers, groups } = R.keys(screenScenarios).reduce((acc: Acc, scenarioID) => {
    const scenario = screenScenarios[scenarioID];

    if (scenario.struct_type === 'block') {
      return {
        ...acc,
        blocks: acc.blocks.concat(scenario),
      };
    } else if (scenario.struct_type === 'container') {
      return {
        ...acc,
        containers: acc.containers.concat(scenario),
      };
    } else if (scenario.struct_type === 'group') {
      return {
        ...acc,
        groups: acc.groups.concat(scenario),
      };
    }

    return acc;
  }, { blocks: [], containers: [], groups: [] });

  // const listElement = Object.keys(scenarioEl).map(key => scenarioEl[key]);
  // const listSortable0 = yield call(
  //   completeListSortable,
  //   listBlock, listContainer, listGroup, listElement, currentScreen.listSortable.root,
  // );

  const orderedScenarios: T.IScenarios = blocks.concat(containers, groups)
    .reduce((acc, x) => ({
      ...acc,
      [x.id]: x,
    }), {});

  const listSortable = completeLS(
    orderedScenarios,
    scenariosElements,
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
  yield put(Actions.runLayoutAlgorithmFinished());
}

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
  // const { itemId, scenarioId } = action.payload;
  // const {
  //   project: { currentScreen: { listSortable }, scenarios, scenarioElements },
  // }: AppReduxState = yield select();

  // console.log('listSortable!', listSortable);
  // // TODO: research what is ISortableItemTemp
  // // const item = listSortable[itemId] as ISortableItemTemp;
  // const item = listSortable[itemId];
  // console.log('item', item);

  // if (!item) return;

  // const oldScenarioId = item.scenarioId;
  // invariant(
  //   typeof oldScenarioId === 'undefined', 
  //   `Potential invariant violation: oldScenarioId is undefined, but must have value`,
  // );

  // const elements = listSortable[itemId].children
  //   .reduce((arr, id) => arr.concat(listSortable[id].elementId), [item.elementId])
  //   .filter(id => !!scenarioElements[id]);

  // const newListScenario: T.IScenarios = delElByScenarios(
  //   oldScenarioId,
  //   elements,
  //   addElByScenarios(scenarioId, elements, scenarios),
  // );

  // yield put(Actions.setScenarios(newListScenario));

  // const updateScenarioElements = getAllElements(
  //   oldScenarioId, scenarioId, elements, scenarioElements,
  // );

  // yield put(Actions.setScenarioElements(updateScenarioElements));
  // yield call(runLayoutAlgorithm, updateScenarioElements);
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

// export function* addScenarioV2(action: ReturnType<typeof Actions.addScenario>) {
//   // TODO: rethink scenario addition
//   const { payload: { parentScenarioID, name, elements: elementsToFormScenario } } = action;
//   const {
//     project: {
//       scenarios,
//       scenarioElements,
//       libraryElements,
//       currentScreen: { id: screenID },
//     },
//   }: AppReduxState = yield select();

//   const needToCreateNewScenario = parentScenarioID === null;
//   const needToModifyExistingScenario = typeof parentScenarioID === 'number';

//   if (needToCreateNewScenario) {
//     const blockToCreate: Omit<T.IScenarioItem, 'id'> = {
//       name: 'Block name',
//       screen: screenID,
//       parent_id: 0,
//       struct_type: 'block',
//       direction: 'vertical',
//       buoyancy: 0,
//       elements: [],
//       parameters: {
//         children: [],
//       },
//       styles: { ...DEFAULT_INDENTS, 'flex-direction': 'column' },
//     };
//   }
// }

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
  const { payload: { id } } = action;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const { listSortable }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);

  const itemsToDelete = getElAndChildren(id, listSortable);

  const elementsToDelete = itemsToDelete
    .filter(x => x.slice(-1) === 'e')
    .map(x => parseInt(x, 10));
  const elementsWithoutDeleted: T.IScenarioElements = R.omit(R.map(String, elementsToDelete), scenarioElements);

  yield put(Actions.setScenarioElements(elementsWithoutDeleted));

  const scenariosToDelete = itemsToDelete
    .filter(x => x.slice(-1) === 's')
    .map(x => parseFloat(x));

  const { parent_id } = getParams(id, scenarioElements, scenarios);

  const parentScenario = scenarios[parent_id];
  const parentChildren: string[] = parent_id >= 0
    ? R.without([id], parentScenario.parameters.children)
    : [];

  const updateParent: T.IScenarios = parent_id >= 0
    ? {
      [parent_id]: {
        ...parentScenario,
        elements: R.without(elementsToDelete, parentScenario.elements),
        parameters: {
          ...parentScenario.parameters,
          children: parentChildren,
        },
      }
    }
    : {};

  const scenariosWithoutDeleted: T.IScenarios = {
    ...R.omit(R.map(String, scenariosToDelete), scenarios),
    ...updateParent,
  };

  yield put(Actions.setScenarios(scenariosWithoutDeleted));

  yield put(Actions.runLayoutAlgorithm(scenariosWithoutDeleted, elementsWithoutDeleted));
  yield take(runLayoutAlgorithmFinishedType);

  if (!R.isEmpty(elementsToDelete)) {
    yield call(reqWrapper, apiDelElements, { list: elementsToDelete });
  }

  if (!R.isEmpty(scenariosToDelete)) {
    yield call(reqWrapper, apiDelScenarioCascade, { list: scenariosToDelete });
    // TODO: move into separate saga and store syncing status
    yield call(reqWrapper, apiSaveScenarios, {
      data: R.values(R.pick([`${parent_id}`], scenariosWithoutDeleted))
    });
  }
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
  const { itemID: itemId } = action.payload;
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const { id: screenID, listSortable }: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  if (!listSortable[itemId]) return;

  const itemID = parseFloat(itemId);
  const { parent_id } = itemId.slice(-1) === 's'
    ? scenarios[itemID]
    : scenarioElements[itemID].parameters;

  const container = {
    name: 'container',
    struct_type: 'container',
    screen: screenID,
    parent_id,
    buoyancy: 0,
    direction: 'vertical',
    elements: [],
    parameters: {
      children: [itemId],
    },
    styles: DEFAULT_INDENTS,
  };

  // TODO: Test
  // const lastId = Object.keys(scenarios).reduce((max, k) => (
  //   max > Number(k) ? max : Number(k)
  // ), 0) + 1;
  // const result_contaer: T.IScenarioItem = { ...container, id: lastId };

  const createdContainer: ReturnPromisedType<typeof apiAddScenario> = yield call(
    reqWrapper, apiAddScenario, { data: container },
  );

  if (!createdContainer) return;

  const parentChildren = [
    ...R.without([itemId], (parent_id > 0 ? scenarios[parent_id].parameters.children : [])),
    `${createdContainer.id}s`,
  ];

  const updatedScenarios: T.IScenarios = {
    ...scenarios,
    [createdContainer.id]: createdContainer,
    ...(itemId.slice(-1) === 's'
      ? R.assocPath([itemID, 'parent_id'], createdContainer.id, scenarios)
      : {}),
    ...(parent_id > 0
      ? { [parent_id]: R.assocPath(['parameters', 'children'], parentChildren, scenarios[parent_id]) }
      : {}),
  };

  const updatedElements: T.IScenarioElements = {
    ...scenarioElements,
    ...(itemId.slice(-1) === 'e'
      ? R.assocPath([itemID, 'parameters', 'parent_id'], createdContainer.id, scenarioElements)
      : {}),
  };

  yield put(Actions.setScenarios(updatedScenarios));
  yield put(Actions.setScenarioElements(updatedElements));

  yield put(Actions.runLayoutAlgorithm(updatedScenarios, updatedElements));
  yield take(runLayoutAlgorithmFinishedType);

  const result_scenarios = yield call(
    reqWrapper, apiSaveScenarios,
    { data: R.values(updatedScenarios) },
  );
  const result_elements = yield call(
    reqWrapper, apiSaveElements,
    { data: R.values(updatedElements) },
  );
  console.log('AddContainerSaga!');
  console.log('Saved scenarios and elements:', { result_scenarios, result_elements });
}
