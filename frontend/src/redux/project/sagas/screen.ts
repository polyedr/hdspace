import { SagaIterator } from 'redux-saga';
import {
  call, select, put, all, take,
} from 'redux-saga/effects';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import {
  activateScreen,
  addScreen,
  changeScenarios,
  delScreen,
  renameScreen,
  saveScreen,
  setProject, setScenarioElements,
  setScreen,
  setScreenLoader,
  setModifyElements,
  setLoader,
  updateViewTree,
} from '$redux/project/actions';
import * as Actions from '$redux/project/actions';
import {
  convertScenarios,
  convertScenarioElements,
} from '$utils/parseScenario';
import { DEFAULT_LS, DEFAULT_SCREEN } from '$constants/defaultParams';
import {
  IProject,
  IProjectScreen,
  IScenarioItem,
  ISortableItem,
  IScenarioElement,
} from '$redux/project/types';
import { apiSaveScenario, apiSetScenarioNeuralNetwork, apiGetScenarios } from '$api/scenario';
import { apiGetElements, apiSaveElements } from '$api/element';
import {
  apiAddScreen,
  apiDelScreen,
  apiGetAllScreen,
  apiGetScreen,
  apiSaveScreen,
} from '$api/screen';
import { ReturnPromisedType } from '$shared/types';

import { reqWrapper } from '.';
import { selectors, T } from '../';
import { createContainer } from './scenario';

const runLayoutAlgorithmFinishedType: T.RunLayoutAlgorithmFinished['type'] = 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED';

export function* activateScreenSaga({ payload }: ReturnType<typeof activateScreen>) {
  const { screenID } = payload;

  yield put(setScreenLoader(true));

  const screen: ReturnPromisedType<typeof apiGetScreen> = yield call(reqWrapper, apiGetScreen, { id: screenID });

  if (!screen) return;

  const screenToActivate: IProjectScreen = {
    ...DEFAULT_SCREEN,
    ...R.omit(['screen_data_text'], screen),
  };
  yield put(setScreen(screenToActivate));

  yield put(Actions.setScenarioLoader(true));

  const serverScreenScenarios: ReturnPromisedType<typeof apiGetScenarios> = yield call(
    reqWrapper, apiGetScenarios, { screenID },
  );

  if (!serverScreenScenarios) return;

  const rootScenario = serverScreenScenarios.find(x => x.parent_id === -1) as T.IScenarioItem;
  const rootLSItem: T.ILSItem = {
    ...DEFAULT_LS.root,
    id: rootScenario.id,
    children: rootScenario.parameters.children,
  };

  const screenScenarios = convertScenarios(serverScreenScenarios);
  const scenariosIDs = Object.keys(screenScenarios);

  const serverScenariosElements: ReturnPromisedType<typeof apiGetElements> = scenariosIDs.length > 0
  ? yield call(reqWrapper, apiGetElements, { scenariosIDs })
  : [];

  if (!serverScenariosElements) return;

  const scenariosElements = convertScenarioElements(serverScenariosElements);

  yield put(Actions.runLayoutAlgorithm(screenScenarios, scenariosElements, rootLSItem));
  yield take(runLayoutAlgorithmFinishedType);

  yield put(Actions.setScenarioLoader(false));
  yield put(setScreenLoader(false));
}

export function* addScreenSaga({ payload }: ReturnType<typeof addScreen>) {
  yield put(Actions.clearAfterPrevScreen());
  const { projectID, name } = payload;
  const data = {
    project: projectID,
    name,
    status: 'in_progress',
    buoyancy: 0,
    image: null,
    screen_data_json: {},
    styles_root: {},
  };

  const createdScreen: ReturnPromisedType<typeof apiAddScreen> = yield call(reqWrapper, apiAddScreen, { data });
  if (!createdScreen) return;

  const rootScenario: T.IScenarioItem = yield call(createContainer, {
    screen: createdScreen.id,
    styles: {
      width: '100%',
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'min-height': '100%',
    }
  });

  const listSortable: T.IListSortable = { root: { ...DEFAULT_LS.root, id: rootScenario.id } };

  const screen = R.omit(
    ['screen_data_text'],
    R.assoc('listSortable', listSortable, createdScreen),
  );

  yield put(updateViewTree({
    screen,
    scenarios: { [rootScenario.id]: rootScenario }
  }));

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject
  );
  const updateProject: IProject = R.assoc(
    'projectscreen',
    R.append(screen.id, currentProject.projectscreen),
    currentProject,
  );

  yield call(reqWrapper, apiSaveScreen, {
    id: screen.id,
    data: R.omit(['listSortable', 'screenLoader', 'image', 'screen_data_json', 'buoyancy'], screen),
  });

  yield put(setProject(updateProject));
  yield put(push(`/project/${projectID}/${screen.id}`))
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataBlob = await new Promise<Blob>(resolve => (
    canvas.toBlob(blob => blob !== null ? resolve(blob) : undefined, 'image/jpg', 1)
  ));
  console.log(dataBlob)
  return dataBlob;
}

export function* saveScreenSaga({ payload: { canvas } }: ReturnType<typeof saveScreen>): SagaIterator {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(selectors.selectModifyElements);
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  yield put(setLoader(true));

  const screen = R.omit(['listSortable', 'screenLoader', 'image', 'screen_data_json', 'buoyancy'], currentScreen);
  // buoyancy must be send, but it null.
  const blobFile = yield call(canvasToBlob, canvas);
  const formData = new FormData();

  R.keys(screen).forEach((key) => {
    if (key === 'styles_root') {
      formData.append(key, JSON.stringify(screen[key]));
    } else {
      formData.append(key, screen[key] as string);
    }
  });

  formData.append('image', blobFile, `${currentScreen.name}-${currentScreen.id}.png`);

  const resultScreen = yield call(reqWrapper, apiSaveScreen, { id: screen.id, data: formData });
  const updateScreen = { ...currentScreen, ...resultScreen };
  yield put(setScreen(updateScreen));
  yield put(setProject({
    ...currentProject,
    projectscreen: currentProject.projectscreen.map(screenID => screenID !== updateScreen.id ? screenID : updateScreen),
  }));

  const resultScenarios: ReturnPromisedType<typeof apiSaveScenario> = yield all(
    Object.keys(scenarios).map(key => call(reqWrapper, apiSaveScenario, { data: scenarios[key] })),
  );

  const listElement = modifyElements.reduce((acc: IScenarioElement[], elId) => (
    scenarioElements[elId] ? acc.concat(scenarioElements[elId]) : acc
  ), []);

  if (listElement.length === 0) {
    yield put(setLoader(false));
    return;
  }

  const resultElements = yield call(reqWrapper, apiSaveElements, { data: listElement });

  yield put(setLoader(false));
  yield put(setModifyElements([]));

  console.log('save', { resultScreen, resultScenarios, resultElements });
}

export function* delScreenSaga({ payload }: ReturnType<typeof delScreen>) {
  const { projectID, screenID } = payload;
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  yield call(reqWrapper, apiDelScreen, { id: screenID });

  const result: IProject = R.assoc(
    'projectscreen',
    currentProject.projectscreen.filter(id => id !== screenID),
    currentProject,
  );

  yield put(setProject(result));

  const lastScreenID = R.last(result.projectscreen);

  if (!lastScreenID) {
    yield put(setScreen(DEFAULT_SCREEN));
    yield put(push(`/project/${projectID}`));
  } else if (lastScreenID !== currentScreen.id) {
    yield put(activateScreen(projectID, lastScreenID));
    yield put(push(`/project/${projectID}/${lastScreenID}`));
  }
  // yield call(getListProjectSaga);
}

// TODO: preload screens for such edits
export function* renameScreenSaga({ payload }: ReturnType<typeof renameScreen>) {
  // const { screenID, name } = payload;
  // const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
  //   selectors.selectCurrentScreen,
  // );
  // const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  // const currScreen = currentProject.projectscreen.find(id => id === screenID);

  // if (!currScreen) return;

  // const updatedScreen = {
  //   ...R.omit(['image'], currScreen),
  //   name,
  // };

  // yield call(reqWrapper, apiSaveScreen, { id: screenID, data: updatedScreen });

  // const updateProjectScreens = currentProject.projectscreen.map((id) => {
  //   if (id === screenID) {
  //     return {
  //       ...screen,
  //       name,
  //     };
  //   }

  //   return screen;
  // });

  // const updateProject: IProject = {
  //   ...currentProject,
  //   projectscreen: updateProjectScreens,
  // };

  // yield put(setProject(updateProject));

  // if (currentScreen.id === screenID) {
  //   const updateCurrScreen = {
  //     ...currentScreen,
  //     name,
  //   };

  //   yield put(setScreen(updateCurrScreen));
  // }
}

export function* getScreenNNSaga() {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const resultListScreen: IProjectScreen[] = yield call(reqWrapper, apiGetAllScreen);
  const lastScreenId = resultListScreen[resultListScreen.length - 1].id;
  const data = {
    screen: lastScreenId,
    name: 'virtualization_vk',
    parameters: {},
    styles: {},
  };
  const resultScenario: IScenarioItem = yield call(reqWrapper, apiSetScenarioNeuralNetwork, { data });

  if (currentProject.projectscreen.some(sID => sID === resultScenario.id)) {
    console.warn('Such screen already exists!');
    return;
  }
  const newScreen = {
    id: resultScenario.screen,
    name: 'Neural result',
    status: 'in_progress',
    image: null,
    project: currentProject.id,
    screenscenario: [resultScenario.id],
    screen_data_json: {},
  };

  const resultScreen = yield call(reqWrapper, apiSaveScreen, { id: newScreen.id, data: newScreen });

  const updateProject = {
    ...currentProject,
    projectscreen: R.append(resultScreen, currentProject.projectscreen),
  };

  const screenscenario = [resultScenario.id];
  const resultElements: ReturnPromisedType<typeof apiGetElements> = yield call(reqWrapper, apiGetElements, { scenariosIDs: screenscenario });
  const scenarioElements = convertScenarioElements(resultElements);

  yield all([
    put(setProject(updateProject)),
    put(setScenarioElements(scenarioElements)),
    put(activateScreen(currentProject.id, lastScreenId)),
  ]);
}

export function* updateScreenSaga(screenData: ISortableItem[]) {
  /*const { project: { currentScreen } }: AppReduxState = yield select();
  const newScreen: IProjectScreen = {
    ...currentScreen,
    screen_data_json: screenData,
    listSortable: getList(screenData, currentScreen.styles_root),
  };

  yield put(Actions.setScreen(newScreen));*/
}
