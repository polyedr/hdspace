import { SagaIterator } from 'redux-saga';
import {
  call, select, put, all,
} from 'redux-saga/effects';
import * as R from 'ramda';

import {
  activateScreen,
  addScreen,
  changeScenarios,
  delScreen,
  renameScreen,
  saveScreen,
  setProject, setScenarioElements,
  setScenarios,
  setScreen,
  setScreenLoader,
  setModifyElements,
  setLoader,
} from '$redux/project/actions';
import { filterScenarioEl } from '$utils/parseScenario';
import { DEFAULT_LS, DEFAULT_SCREEN } from '$constants/defaultParams';
import {
  IProject,
  IProjectScreen,
  IScenarioItem,
  ISortableItem,
  IScenarioElement,
} from '$redux/project/reducer';
import { apiSaveScenario, apiSetScenarioNeuralNetwork } from '$api/scenario';
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


export function* activateScreenSaga({ payload }: ReturnType<typeof activateScreen>) {
  const { projectId, screenId } = payload;

  if (!projectId || !screenId) {
    // show error
    return;
  }

  yield put(setScreenLoader(true));

  const resultScreen = yield call(reqWrapper, apiGetScreen, { id: screenId });

  if (!resultScreen) return;

  const screen: IProjectScreen = {
    ...DEFAULT_SCREEN,
    ...R.omit(['screen_data_text', 'screen_data_json'], resultScreen),
  };

  yield put(changeScenarios(screen.id));
  yield put(setScreen(screen));
  yield put(setScreenLoader(false));
}

export function* addScreenSaga({ payload }: ReturnType<typeof addScreen>) {
  const { projectId, name } = payload;
  const data = {
    project: projectId,
    name,
    status: 'in_progress',
    buoyancy: 0,
    image: null,
    screen_data_json: {},
    styles_root: {},
  };
  const createdScreen: ReturnPromisedType<typeof apiAddScreen> = yield call(reqWrapper, apiAddScreen, { data });
  if (!createdScreen) return;

  const screen = R.omit(
    ['screen_data_json', 'screen_data_text'],
    R.assoc('listSortable', DEFAULT_LS, createdScreen),
  );

  yield put(setScreen(screen));
  yield put(setScenarios({}));

  const { project: { currentProject } } = yield select(state => state);
  const updateProject: IProject = R.assoc(
    'projectscreen',
    R.append(screen, currentProject.projectscreen),
    currentProject,
  );

  yield put(setProject(updateProject));
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataBlob = await new Promise<Blob>(resolve => (
    canvas.toBlob(blob => (
      resolve(blob)
    ), 'image/jpg', 1)
  ));
  console.log(dataBlob)
  return dataBlob;
}

export function* saveScreenSaga({ canvas }: ReturnType<typeof saveScreen>): SagaIterator {
  const {
    project: {
      currentProject,
      currentScreen,
      scenarios,
      modifyElements,
      scenarioElements,
    },
  } = yield select(state => state);

  yield put(setLoader(true));

  const screen = R.omit(['listSortable', 'screenLoader', 'image', 'screen_data_json', 'buoyancy'], currentScreen);
  // buoyancy must be send, but it null.
  const blobFile = yield call(canvasToBlob, canvas);
  const formData = new FormData();

  Object.keys(screen).forEach((key) => {
    if (key === 'styles_root') {
      formData.append(key, JSON.stringify(screen[key]));
    } else {
      formData.append(key, screen[key]);
    }
  });

  formData.append('image', blobFile, `${currentScreen.name}-${currentScreen.id}.png`);

  const resultScreen = yield call(reqWrapper, apiSaveScreen, { id: screen.id, data: formData });
  const updateScreen = { ...currentScreen, ...resultScreen };
  yield put(setScreen(updateScreen));
  yield put(setProject({
    ...currentProject,
    projectscreen: currentProject.projectscreen.map(s => (
      s.id !== updateScreen.id ? s : updateScreen
    )),
  }));

  const resultScenarios = yield all(
    Object.keys(scenarios).map(key => call(reqWrapper, apiSaveScenario, { data: scenarios[key] })),
  );

  const listElement: IScenarioElement[] = modifyElements.reduce((arr, elId) => (
    scenarioElements[elId] ? R.append(scenarioElements[elId], arr) : arr
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
  const { projectId, screenId } = payload;
  const { project: { currentProject, currentScreen } } = yield select(state => state);

  yield call(reqWrapper, apiDelScreen, { id: screenId });

  const result: IProject = R.assoc(
    'projectscreen',
    currentProject.projectscreen.filter(s => s.id !== screenId),
    currentProject,
  );

  yield put(setProject(result));

  const lastScreenId: number = R.prop('id', R.last(result.projectscreen));

  if (!lastScreenId) {
    yield put(setScreen(DEFAULT_SCREEN));
  } else if (lastScreenId !== currentScreen.id) {
    yield put(activateScreen(projectId, lastScreenId));
  }
  // yield call(getListProjectSaga);
}

export function* renameScreenSaga({ payload }: ReturnType<typeof renameScreen>) {
  const { screenId, newName } = payload;
  const { project: { currentProject, currentScreen } } = yield select(state => state);
  const currScreen = currentProject.projectscreen.find(screen => screen.id === screenId);

  if (!currScreen) return;

  const updateScreen = {
    ...R.omit(['image'], currScreen),
    name: newName,
  };

  yield call(reqWrapper, apiSaveScreen, { id: screenId, data: updateScreen });

  const updateProjectScreens = currentProject.projectscreen.map((screen) => {
    if (screen.id === screenId) {
      return {
        ...screen,
        name: newName,
      };
    }

    return screen;
  });

  const updateProject: IProject = {
    ...currentProject,
    projectscreen: updateProjectScreens,
  };

  yield put(setProject(updateProject));

  if (currentScreen.id === screenId) {
    const updateCurrScreen = {
      ...currentScreen,
      name: newName,
    };

    yield put(setScreen(updateCurrScreen));
  }
}

export function* getScreenNNSaga() {
  const { project: { currentProject } } = yield select(state => state);
  const resultListScreen: IProjectScreen[] = yield call(reqWrapper, apiGetAllScreen);
  const lastScreenId = resultListScreen[resultListScreen.length - 1].id;
  const data = {
    screen: lastScreenId,
    name: 'virtualization_vk',
    parameters: {},
    styles: {},
  };
  const resultScenario: IScenarioItem = yield call(reqWrapper, apiSetScenarioNeuralNetwork, { data });

  if (currentProject.projectscreen.some(s => s.id === resultScenario.id)) {
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
    screen_data_json: [],
  };

  const resultScreen = yield call(reqWrapper, apiSaveScreen, { id: newScreen.id, data: newScreen });

  const updateProject = {
    ...currentProject,
    projectscreen: R.append(resultScreen, currentProject.projectscreen),
  };

  const screenscenario = [resultScenario.id];
  const resultElements: IScenarioElement[] = yield call(reqWrapper, apiGetElements);
  const scenarioElements = filterScenarioEl(resultElements, screenscenario);

  yield all([
    put(setProject(updateProject)),
    put(setProject(updateProject)),
    put(setScenarioElements(scenarioElements)),
    put(activateScreen(currentProject.id, lastScreenId)),
  ]);
}

export function* updateScreenSaga(screenData: ISortableItem[]) {
  /*const { project: { currentScreen } } = yield select(state => state);
  const newScreen: IProjectScreen = {
    ...currentScreen,
    screen_data_json: screenData,
    listSortable: getList(screenData, currentScreen.styles_root),
  };

  yield put(Actions.setScreen(newScreen));*/
}
