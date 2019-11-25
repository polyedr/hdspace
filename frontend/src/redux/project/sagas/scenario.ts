import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import {
  IScenarios,
  IScenarioItem,
  IScenarioElement,
  IScenarioElements,
} from '$redux/project/reducer';
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
import { AppReduxState } from '$shared/types/app';

export function* runLayoutAlgorithm(screenScenarios: IScenarios, scenariosElements: IScenarioElements) {
  const { project: { currentScreen } }: AppReduxState = yield select();
  type Acc = {
    blocks: IScenarioItem[];
    containers: IScenarioItem[];
    groups: IScenarioItem[];
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

  const orderedScenarios: IScenarios = blocks.concat(containers, groups)
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
}

export function* changeScenariosSaga(action: ReturnType<typeof Actions.changeScenarios>) {
  const { screenId } = action;
  yield put(Actions.setScenarioLoader(true));

  const serverScreenScenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
    reqWrapper, apiGetScenarios, { screenID: screenId },
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
  yield put(Actions.setScenarioElements(scenariosElements));

  yield call(runLayoutAlgorithm, screenScenarios, scenariosElements);
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

  // const newListScenario: IScenarios = delElByScenarios(
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
  const { project: { currentScreen, scenarios } }: AppReduxState = yield select();

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
//     const blockToCreate: Omit<IScenarioItem, 'id'> = {
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
  const {
    project: {
      scenarios,
      scenarioElements,
      libraryElements,
      currentScreen,
    },
  }: AppReduxState = yield select();
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
    .reduce((acc: IScenarioItem[], block) => {
      const blockGroups = createdGroups.filter(g => block.parameters.children.indexOf(`${g.id}s`) !== -1)
        .map((g): IScenarioItem => ({ ...g, parent_id: block.id }));

      return acc.concat(...blockGroups);
    }, [])
    .concat(existGroups);
  const updatedScenariosElements: IScenarioElement[] = actualScenariosElements.map((el) => {
    const elementGroup = updatedGroups.find(({ id }) => id === el.parameters.parent_id);

    return elementGroup ? { ...el, scenario: elementGroup.parent_id } : el;
  });

  // Complete List Container
  const existContainer = Object.keys(scenarios).reduce((acc: IScenarioItem[], key) => (
    scenarios[key].struct_type === 'container' ? acc.concat(scenarios[key]) : acc
  ), []);
  // Render Items Scenario
  const finalScenarios: IScenarios = allBlocks.concat(existContainer, updatedGroups)
    .reduce((acc, item) => ({
      ...acc,
      [item.id]: item,
    }), {});

  const finalScenarioElements: IScenarioElements = updatedScenariosElements.reduce((acc, el) => ({
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
  const resultScenarioEl: IScenarioElement[] = yield call(
    reqWrapper, apiSaveElements,
    { data: updatedScenariosElements },
  );
  const resultScenario: IScenarioItem[] = yield call(
    reqWrapper, apiSaveScenarios,
    { data: listScenario },
  );
  console.log('SAVE NEW SCENARIO', { resultScenario, resultScenarioEl });
}

export function* delScenarioSaga({ id }: ReturnType<typeof Actions.delScenario>): SagaIterator {
  const {
    project: {
      scenarios,
      scenarioElements,
      currentScreen: {
        listSortable,
      },
    },
  }: AppReduxState = yield select();

  const removeAllItems: string[] = getElAndChildren(id, listSortable);
  const removeElements = removeAllItems.filter((itemId) => {
    if (!itemId) return false;

    const parseId = parseInt(itemId, 10);

    return itemId.slice(-1) === 'e' && !!scenarioElements[parseId];
  })
    .map(itemId => parseInt(itemId, 10));

  const updateElements: IScenarioElements = R.omit(R.map(String, removeElements), scenarioElements);

  yield put(Actions.setScenarioElements(updateElements));

  const removeScenario = removeAllItems.filter(itemId => (
    itemId && itemId.slice(-1) === 's' && !!scenarios[parseFloat(itemId)]
  )).map(itemId => parseFloat(itemId));

  const { parent_id } = getParams(id, scenarioElements, scenarios);

  const parenCaild: string[] = parent_id >= 0
    ? R.without([id], scenarios[parent_id].parameters.children)
    : [];

  const updateParent: IScenarios = parent_id >= 0
    ? {
      [parent_id]: R.assocPath(['parameters', 'children'], parenCaild, scenarios[parent_id]),
    }
    : {};

  const updateScenarios: IScenarios = {
    ...R.omit(R.map(String, removeScenario), scenarios),
    ...updateParent,
  };

  yield put(Actions.setScenarios(updateScenarios));

  yield call(runLayoutAlgorithm, updateScenarios, updateElements);

  if (!R.isEmpty(removeElements)) {
    yield call(reqWrapper, apiDelElements, { list: removeElements });
  }

  if (!R.isEmpty(removeScenario)) {
    yield call(reqWrapper, apiDelScenarioCascade, { list: removeScenario });
  }
}

export function* renameScenarioSaga(
  { scenarioId, newName }: ReturnType<typeof Actions.renameScenario>,
): SagaIterator {
  const { project: { scenarios } } = yield select();

  const updateScenario = {
    ...scenarios[scenarioId],
    name: newName,
  };

  const result_scenario: IScenarioItem = yield call(
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
  const { itemId } = action;
  const {
    project: {
      currentScreen: { id: screenID, listSortable },
      scenarioElements,
      scenarios,
    },
  }: AppReduxState = yield select();

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
  // const result_contaer: IScenarioItem = { ...container, id: lastId };

  const createdContainer: ReturnPromisedType<typeof apiAddScenario> = yield call(
    reqWrapper, apiAddScenario, { data: container },
  );

  if (!createdContainer) return;

  const parentChildren = [
    ...R.without([itemId], (parent_id > 0 ? scenarios[parent_id].parameters.children : [])),
    `${createdContainer.id}s`,
  ];

  const updatedScenarios: IScenarios = {
    ...scenarios,
    [createdContainer.id]: createdContainer,
    ...(itemId.slice(-1) === 's'
      ? R.assocPath([itemID, 'parent_id'], createdContainer.id, scenarios)
      : {}),
    ...(parent_id > 0
      ? { [parent_id]: R.assocPath(['parameters', 'children'], parentChildren, scenarios[parent_id]) }
      : {}),
  };

  const updatedElements: IScenarioElements = {
    ...scenarioElements,
    ...(itemId.slice(-1) === 'e'
      ? R.assocPath([itemID, 'parameters', 'parent_id'], createdContainer.id, scenarioElements)
      : {}),
  };

  yield put(Actions.setScenarios(updatedScenarios));
  yield put(Actions.setScenarioElements(updatedElements));
  yield call(runLayoutAlgorithm, updatedScenarios, updatedElements);

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
