import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import {
  IScenarios,
  IScenarioItem,
  IScenarioElement,
  IScenarioElements,
  IListSortable,
} from '$redux/project/reducer';
import {
  ISortableItemTemp,
  getElAndChildren,
} from '$utils/parseListItems';
import {
  addElByScenarios,
  delElByScenarios,
  filterScenarioByScreenId,
  getNewScenario,
  getAllElements,
  filterScenarioEl,
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


export function* runLayoutAlgorithm(
  scenarios: IScenarios, scenarioEl: IScenarioElements,
): SagaIterator {
  const { project: { currentScreen } } = yield select(state => state);
  const { listBlock, listContainer, listGroup } = Object.keys(scenarios).reduce((result, key) => {
    const item = scenarios[key];

    if (item.struct_type === 'block') {
      return {
        ...result,
        listBlock: [...result.listBlock, item],
      };
    }

    if (item.struct_type === 'container') {
      return {
        ...result,
        listContainer: [...result.listContainer, item],
      };
    }

    if (item.struct_type === 'group') {
      return {
        ...result,
        listGroup: [...result.listGroup, item],
      };
    }

    return result;
  }, { listBlock: [], listContainer: [], listGroup: [] });

  // const listElement = Object.keys(scenarioEl).map(key => scenarioEl[key]);
  // const listSortable0 = yield call(
  //   completeListSortable,
  //   listBlock, listContainer, listGroup, listElement, currentScreen.listSortable.root,
  // );

  const scenarioList: IScenarios = listBlock.concat(listContainer, listGroup)
    .reduce((result, item) => ({
      ...result,
      [item.id]: item,
    }), {});

  const listSortable: IListSortable = completeLS(
    scenarioList,
    scenarioEl,
    currentScreen.listSortable.root,
  );

  const updateScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...listSortable,
    },
  };

  yield put(Actions.setScreen(updateScreen));
}

export function* changeScenariosSaga(
  { screenId }: ReturnType<typeof Actions.changeScenarios>,
): SagaIterator {
  yield put(Actions.setScenarioLoader(true));

  const resultScenario = yield call(reqWrapper, apiGetScenarios);

  if (!resultScenario) return;

  const scenarios = filterScenarioByScreenId(screenId, resultScenario);
  yield put(Actions.setScenarios(scenarios));

  const resultElements: IScenarioElement[] = yield call(reqWrapper, apiGetElements);

  if (!resultElements) return;

  const {
    project: { currentScreen: { screenscenario = [] } },
  } = yield select(state => state);

  const scenarioElements = filterScenarioEl(resultElements, screenscenario);
  yield put(Actions.setScenarioElements(scenarioElements));

  yield call(runLayoutAlgorithm, scenarios, scenarioElements);
  yield put(Actions.setScenarioLoader(false));
}

export function* changeScenarioSaga(
  { payload: { itemId, scenarioId } }: ReturnType<typeof Actions.changeScenario>,
): SagaIterator {
  const {
    project: { currentScreen, scenarios, scenarioElements },
  } = yield select(state => state);
  const item: ISortableItemTemp = currentScreen.listSortable[itemId];

  if (!item) return;

  const oldScenarioId: number = item.scenarioId;
  const elements = (currentScreen.listSortable[itemId].children || [])
    .reduce((arr, id) => (
      R.append(
        R.path([id, 'elementId'], currentScreen.listSortable),
        arr,
      )
    ), [item.elementId])
    .filter(id => !!scenarioElements[id]);

  const newListScenario: IScenarios = delElByScenarios(
    oldScenarioId,
    elements,
    addElByScenarios(scenarioId, elements, scenarios),
  );

  yield put(Actions.setScenarios(newListScenario));

  const updateScenarioElements = getAllElements(
    oldScenarioId, scenarioId, elements, scenarioElements,
  );

  yield put(Actions.setScenarioElements(updateScenarioElements));
  // yield call(runLayoutAlgorithm, updateScenarioElements);
}

export function* createScenarioSaga(
  { payload: { name, type, elements } }: ReturnType<typeof Actions.createScenario>,
): SagaIterator {
  const { project: { currentScreen, scenarios } } = yield select(state => state);
  const newScenario = getNewScenario(name, type, currentScreen.id, elements);
  const resultScenario: IScenarioItem = yield call(reqWrapper, apiAddScenario, newScenario);

  if (!resultScenario) return;

  const screenscenario: number[] = [...currentScreen.screenscenario, resultScenario.id];

  const resultElements: IScenarioElement[] = yield call(reqWrapper, apiGetElements);

  if (!resultElements) return;

  const updateScenarioElements = filterScenarioEl(resultElements, screenscenario);

  yield put(Actions.setScreen(R.assoc('screenscenario', screenscenario, currentScreen)));
  yield put(Actions.setScenarios({ ...scenarios, [resultScenario.id]: resultScenario }));
  yield put(Actions.setScenarioElements(updateScenarioElements));
  // yield call(runLayoutAlgorithm, updateScenarioElements);
}

export function* addScenarioSaga({
  payload: { scenarioId = 0, name = 'new scenario', listElementType },
}: ReturnType<typeof Actions.addScenario>): SagaIterator {
  const {
    project: {
      scenarios,
      scenarioElements,
      libraryElements,
      currentScreen,
    },
  } = yield select(state => state);

  // Complete List Element
  const { newEl, existEl } = formingListEl(
    currentScreen.id, scenarioId, name, listElementType, libraryElements, scenarioElements,
  );
  const apiListEl = newEl.map(el => R.omit(['id'], el));
  // console.log(if img -> FormData(newEl));
  const resultElements: IScenarioElement[] = yield call(
    reqWrapper, apiAddElements,
    { data: apiListEl },
  );
  // const lastIdE = Object.keys(scenarioElements)
  //   .reduce((max, id) => (max > Number(id) ? max : Number(id)), 0);
  // const resultElements = newEl.map((el, i) => ({ ...el, id: lastIdE + i + 1 }));

  if (!resultElements) return;

  // Complete List Group
  const { newGroups, existGroups } = formingListGroup(
    currentScreen.id,
    [...existEl, ...resultElements],
    scenarios,
  );
  const apiListGroup = newGroups.map(group => R.omit(['id'], group));
  const resultGroups: IScenarioItem[] = yield call(
    reqWrapper, apiAddScenarios, { data: apiListGroup },
  );
  // const lastIdG = Object.keys(scenarios).reduce((max, id) => (
  //   max > Number(id) ? max : Number(id)
  // ), 0);
  // const resultGroups = newGroups.map((g, i) => ({ ...g, id: lastIdG + i + 2 }));

  if (!resultGroups) return;

  const allListGroup = existGroups.concat(resultGroups).sort((a, b) => a.parent_id - b.parent_id);
  const allListEl = resultElements.map((el) => {
    const currGroup = resultGroups.find(group => (
      group.parameters.children.indexOf(`${el.id}e`) !== -1
    ));
    const parent_id = R.prop('id', currGroup) || el.parameters.parent_id;
    return ({
      ...el,
      parameters: {
        ...el.parameters,
        parent_id,
      },
    });
  }).concat(existEl)
    .sort((a, b) => a.parameters.parent_id - b.parameters.parent_id);

  // Complete List Block
  const { newBlocks, existBlocks } = formingListBlock(
    name,
    currentScreen.id,
    allListEl,
    allListGroup,
    scenarios,
  );
  const apiListBlock = newBlocks.map(block => R.omit(['id'], block));
  // const lastIdB = existBlocks.concat(allListGroup).reduce((max, b) => (
  //   max > b.id ? max : b.id
  // ), 0);
  const resultBlocks: IScenarioItem[] = apiListBlock.length
    ? yield call(reqWrapper, apiAddScenarios, { data: apiListBlock })
    // ? apiListBlock.map((b, i) => ({ ...b, id: lastIdB + i + 1 }))
    : [];

  if (!resultBlocks) return;

  const updateListBlock = existBlocks.concat(resultBlocks);
  const updateListGroup: IScenarioItem[] = updateListBlock.reduce((result, block) => {
    const listGroup = resultGroups.filter(g => block.parameters.children.indexOf(`${g.id}s`) !== -1)
      .map(g => ({
        ...g,
        parent_id: block.id,
      }));

    return [...result, ...listGroup];
  }, []).concat(existGroups);
  const updateListEl: IScenarioElement[] = allListEl.map((el) => {
    const currGroup = updateListGroup.find(({ id }) => id === el.parameters.parent_id);

    return currGroup ? { ...el, scenario: currGroup.parent_id } : el;
  });

  // Complete List Container
  const existContainer = Object.keys(scenarios).reduce((list, key) => (
    scenarios[key].struct_type === 'container' ? [...list, scenarios[key]] : list
  ), []);
  // Render Items Scenario
  const scenarioList: IScenarios = updateListBlock.concat(existContainer, updateListGroup)
    .reduce((result, item) => ({
      ...result,
      [item.id]: item,
    }), {});

  const elementList: IScenarioElements = updateListEl.reduce((result, el) => ({
    ...result,
    [el.id]: el,
  }), {});

  const listSortable: IListSortable = completeLS(
    scenarioList,
    elementList,
    currentScreen.listSortable.root,
  );

  const updateScreen = {
    ...currentScreen,
    listSortable: {
      ...currentScreen.listSortable,
      ...listSortable,
    },
  };

  yield put(Actions.setScreen(updateScreen));

  const listScenario = updateListBlock.concat(updateListGroup);
  const updateScenarios = listScenario.reduce((obj, item) => ({
    ...obj,
    [item.id]: item,
  }), scenarios);
  yield put(Actions.setScenarios(updateScenarios));

  const listScenarioElement = updateListEl.reduce((obj, el) => ({
    ...obj,
    [el.id]: el,
  }), scenarioElements);
  yield put(Actions.setScenarioElements(listScenarioElement));

  // Save result Layout Algorithm
  const resultScenarioEl: IScenarioElement[] = yield call(
    reqWrapper, apiSaveElements,
    { data: updateListEl },
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
  } = yield select(state => state);

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
    ? R.without([id], R.path([parent_id, 'parameters', 'children'], scenarios))
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
  const { project: { scenarios } } = yield select(state => state);

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

export function* addContainerSaga(
  { itemId }: ReturnType<typeof Actions.addContainer>,
): SagaIterator {
  const {
    project: {
      currentScreen: { id: screen, listSortable: LS },
      scenarioElements,
      scenarios,
    },
  } = yield select(state => state);

  if (!LS[itemId]) return;

  const parseId = parseFloat(itemId);
  const { parent_id } = itemId.slice(-1) === 's'
    ? scenarios[parseId]
    : scenarioElements[parseId].parameters;

  const container = {
    name: 'container',
    struct_type: 'container',
    screen,
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
  const result_contaer: IScenarioItem = yield call(reqWrapper, apiAddScenario, { data: container });

  if (!result_contaer) return;

  const parentChild = [
    ...R.without([itemId], (parent_id > 0 ? R.path([parent_id, 'parameters', 'children'], scenarios) : [])),
    `${result_contaer.id}s`,
  ];

  const updateScenarios: IScenarios = {
    ...scenarios,
    [result_contaer.id]: result_contaer,
    ...(itemId.slice(-1) === 's'
      ? R.assocPath([parseId, 'parent_id'], result_contaer.id, scenarios)
      : {}),
    ...(parent_id > 0
      ? { [parent_id]: R.assocPath(['parameters', 'children'], parentChild, scenarios[parent_id]) }
      : {}),
  };

  const updateElements: IScenarioElements = {
    ...scenarioElements,
    ...(itemId.slice(-1) === 'e'
      ? R.assocPath([parseId, 'parameters', 'parent_id'], result_contaer.id, scenarioElements)
      : {}),
  };

  yield put(Actions.setScenarios(updateScenarios));
  yield put(Actions.setScenarioElements(updateElements));
  yield call(runLayoutAlgorithm, updateScenarios, updateElements);

  const result_scenarios = yield call(
    reqWrapper, apiSaveScenarios,
    { data: R.values(updateScenarios) },
  );
  const result_elements = yield call(
    reqWrapper, apiSaveElements,
    { data: R.values(updateElements) },
  );
  console.log('Save:', { result_scenarios, result_elements });
}
