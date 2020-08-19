/* eslint-disable no-console */

import { SagaIterator } from 'redux-saga';
import { call, select, put, all, fork } from 'redux-saga/effects';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import {
  activateScreen,
  addScreen,
  delScreen,
  renameScreen,
  saveScreen,
  setScenarioElements,
  setCurrentScreenId,
  setScreenLoader,
  setModifyElements,
  setLoader,
  setActiveItem,
  setScreens,
  restoreScreen,
  setUndoActions,
  setProject,
} from '$redux/project/actions';
import * as Actions from '$redux/project/actions';
import { generateUniqueName } from '$utils/generateUniqueName';
import { convertScenarioElements } from '$utils/parseScenario';
import { getSavedValue } from '$utils/getSavedValue';
import { DEFAULT_ACTIVE_ITEM } from '$constants/defaultParams';
import {
  IProjectScreen,
  IScenarioItem,
  IScenarioElement,
} from '$redux/project/types';
import {
  apiSaveScenario,
  apiSetScenarioNeuralNetwork,
  apiSaveScenarios,
} from '$api/scenario';
import { apiGetElements, apiSaveElements, apiAddElements } from '$api/element';
import { convertCreatedElementToRequest } from '$api/converters/toRequest';
import { LibraryElementUnion, LibraryElement, Project } from '$api/types';
import {
  apiAddScreen,
  apiGetAllScreen,
  apiGetScreen,
  apiSaveScreen,
} from '$api/screen';
import { ReturnPromisedType } from '$shared/types';

import { reqWrapper } from '.';
import { selectors, T } from '..';
import { createContainer, updateElementsTree } from './scenario';
import { apiGetProject, apiSaveProject } from '$api/project';
import {
  selectScreenById,
  selectScreenElement,
} from '$redux/project/selectors';
import { convertElementFromResponse } from '$api/converters/fromResponse';

export function* activateScreenSaga({
  payload,
  type,
  meta,
}: ReturnType<typeof activateScreen>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  const { screenID } = payload;

  yield put(setScreenLoader(true));

  yield put(setActiveItem(DEFAULT_ACTIVE_ITEM));

  const screen: IProjectScreen = yield select(selectScreenById(screenID));

  yield put(setCurrentScreenId(screen.id));

  yield put(Actions.setScenarioLoader(true));

  const screenElement = yield select(selectScreenElement(screenID));

  yield call(
    updateElementsTree,
    screenElement,
    meta.undo ? restoreScreen(screenID, screen.project) : undefined,
    meta,
  );

  yield put(
    Actions.setActiveItem({
      itemId: screenElement.id,
      itemType: 'root',
      name: 'Root',
    }),
  );

  yield put(Actions.setScenarioLoader(false));
  yield put(setScreenLoader(false));
}

export function* updateSavedElementsValues(elements: LibraryElementUnion[]) {
  const oldSavedElementsValues: ReturnType<typeof selectors.selectSavedElementsValues> = yield select(
    selectors.selectSavedElementsValues,
  );

  const newSavedElementsValues = elements
    .filter((element) =>
      Object.keys(oldSavedElementsValues).every(
        (elementID) => elementID !== element.id,
      ),
    )
    .reduce((acc, element) => {
      const savedValue = getSavedValue(element);

      if (element.type === 'radiobutton') {
        return {
          ...acc,
          [element.parameters.name || '']: { savedValue: '' },
        };
      }

      return {
        ...acc,
        [element.id]: { id: element.id, savedValue },
      };
    }, {});

  yield put(
    Actions.updateSavedElementsValues({
      ...oldSavedElementsValues,
      ...newSavedElementsValues,
    }),
  );
}

export function* addScreenSaga({ payload }: ReturnType<typeof addScreen>) {
  yield put(Actions.clearAfterPrevScreen());
  const { projectID, name, buoyancy } = payload;

  const screens: ReturnType<typeof selectors.selectScreens> = yield select(
    selectors.selectScreens,
  );
  const numberedName = generateUniqueName(
    name,
    screens.map((screen) => screen.name),
  );

  const data = {
    // TODO: research why DEFAULt_SCREEN isn't spreaded first
    project: projectID,
    name: numberedName,
    status: 'in_progress',
    buoyancy,
    image: null,
    screen_data_json: {},
    styles_root: {},
  };

  const createdScreen: ReturnPromisedType<typeof apiAddScreen> = yield call(
    reqWrapper,
    apiAddScreen,
    { data },
  );
  if (!createdScreen) return;

  yield put(setUndoActions(delScreen(projectID, createdScreen.id)));

  const rootScenario: T.IScenarioItem = yield call(createContainer, {
    screen: createdScreen.id,
  });

  const screen = R.omit(['screen_data_text'], createdScreen);

  const rootElement = convertCreatedElementToRequest(
    'root',
    String(rootScenario.id),
    'Root',
  );

  const newElements: [LibraryElement<'root'>] = yield call(
    reqWrapper,
    apiAddElements,
    { data: [rootElement] },
  );

  const [createdRootElement] = newElements;

  const rootScenarioWithRootElement = {
    ...rootScenario,
    elements: [createdRootElement.id],
  };

  yield fork(reqWrapper, apiSaveScenarios, {
    data: [rootScenarioWithRootElement],
  });

  yield put(
    Actions.updateElementsTree(
      createdRootElement,
      restoreScreen(screen.id, projectID),
    ),
  );
  yield put(
    Actions.setActiveItem({
      itemId: createdRootElement.id,
      itemType: 'root',
      name: 'Root',
    }),
  );

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const updateProject: Project = R.assoc(
    'projectscreen',
    R.prepend(screen.id, currentProject.projectscreen),
    currentProject,
  );

  const savedScreen = yield call(reqWrapper, apiSaveScreen, {
    id: screen.id,
    data: R.omit(
      ['screenLoader', 'image', 'screen_data_json', 'buoyancy'],
      screen,
    ),
  });

  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const updatedScreen = { ...currentScreen, ...savedScreen };

  updatedScreen.element = createdRootElement;

  yield put(setProject(updateProject));

  yield put(setScreens([...screens, updatedScreen]));

  yield put(setCurrentScreenId(screen.id));

  yield put(push(`/project/${projectID}/${screen.id}`));
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (blob) => (blob !== null ? resolve(blob) : undefined),
      'image/jpg',
      1,
    ),
  );
  console.log(dataBlob);
  return dataBlob;
}

export function* saveScreenSaga({
  payload: { canvas },
}: ReturnType<typeof saveScreen>): SagaIterator {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(
    selectors.selectScenarios,
  );
  const modifyElements: ReturnType<typeof selectors.selectModifyElements> = yield select(
    selectors.selectModifyElements,
  );
  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  yield put(setLoader(true));

  const screen = R.omit(
    ['screenLoader', 'image', 'screen_data_json', 'buoyancy'],
    currentScreen,
  );
  // buoyancy must be send, but it null.
  const blobFile = yield call(canvasToBlob, canvas);
  const formData = new FormData();

  R.keys(screen).forEach((key) => {
    formData.append(key, screen[key] as string);
  });

  formData.append(
    'image',
    blobFile,
    `${currentScreen.name}-${currentScreen.id}.png`,
  );

  const resultScreen = yield call(reqWrapper, apiSaveScreen, {
    id: screen.id,
    data: formData,
  });
  const updateScreen = { ...currentScreen, ...resultScreen };
  // yield put(setScreen(screen.id));
  yield put(
    setProject({
      ...currentProject,
      projectscreen: currentProject.projectscreen.map((screenID) =>
        screenID !== updateScreen.id ? screenID : updateScreen,
      ),
    }),
  );

  const resultScenarios: ReturnPromisedType<typeof apiSaveScenario> = yield all(
    Object.keys(scenarios).map((key) =>
      call(reqWrapper, apiSaveScenario, { data: scenarios[key] }),
    ),
  );

  const listElement = modifyElements.reduce(
    (acc: IScenarioElement[], elId) =>
      scenarioElements[elId] ? acc.concat(scenarioElements[elId]) : acc,
    [],
  );

  if (listElement.length === 0) {
    yield put(setLoader(false));
    return;
  }

  const resultElements = yield call(reqWrapper, apiSaveElements, {
    data: listElement,
  });

  yield put(setLoader(false));
  yield put(setModifyElements([]));

  console.log('save', { resultScreen, resultScenarios, resultElements });
}

export function* delScreenSaga({
  payload: { projectID, screenID },
  meta,
  type,
}: ReturnType<typeof delScreen>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  const { undo } = meta;

  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );

  if (currentProject.projectscreen.length < 2) {
    return;
  }
  const newScreenIdList = currentProject.projectscreen.filter(
    (id) => id !== screenID,
  );

  yield call(reqWrapper, apiSaveProject, {
    data: {
      projectscreen: newScreenIdList,
      id: projectID,
    },
  });

  if (!undo) {
    yield put(setUndoActions(restoreScreen(screenID, projectID)));
  }

  const result: Project = R.assoc(
    'projectscreen',
    currentProject.projectscreen.filter((id) => id !== screenID),
    currentProject,
  );

  yield put(setProject(result));

  const lastScreenID = R.head(result.projectscreen);

  const screens: ReturnType<typeof selectors.selectScreens> = yield select(
    selectors.selectScreens,
  );

  const newScreens = screens.filter((screen) => screen.id !== screenID);
  yield put(setScreens(newScreens));

  if (!lastScreenID) {
    yield put(setCurrentScreenId(-1));
    yield put(push(`/project/${projectID}`));
  } else if (lastScreenID !== currentScreen.id) {
    yield put(activateScreen(lastScreenID));
    yield put(push(`/project/${projectID}/${lastScreenID}`));
  }
}

export function* restoreScreenSaga({
  payload: { projectId, screenId },
}: ReturnType<typeof restoreScreen>) {
  yield put(Actions.clearAfterPrevScreen());

  const project = yield call(reqWrapper, apiGetProject, { id: projectId });
  if (!project) console.error(`Error while fetching project ${projectId}`);

  const { projectscreen } = project;

  const updatedProject = yield call(reqWrapper, apiSaveProject, {
    data: {
      id: projectId,
      projectscreen: [...projectscreen, screenId],
    },
  });

  const screens = yield select(selectors.selectScreens);
  const screen = yield call(reqWrapper, apiGetScreen, {
    id: screenId,
  });
  const [element] = yield call(reqWrapper, apiGetElements, {
    scenariosIDs: [screen.screenscenario[0]],
  });

  screen.element = convertElementFromResponse(element);

  yield put(setScreens([screen, ...screens]));

  yield put(setProject(updatedProject));

  yield put(activateScreen(screenId, { undo: true }));
}

export function* renameScreenSaga({
  payload,
}: ReturnType<typeof renameScreen>) {
  const { screenID, name } = payload;
  const targetScreen: ReturnPromisedType<typeof apiGetScreen> = yield call(
    reqWrapper,
    apiGetScreen,
    { id: screenID },
  );

  const screens: ReturnType<typeof selectors.selectScreens> = yield select(
    selectors.selectScreens,
  );

  const numberedName = generateUniqueName(
    name,
    screens.map((screen) => screen.name),
  );

  const renamedScreen: IProjectScreen = {
    ...targetScreen,
    name: numberedName,
  };

  yield call(reqWrapper, apiSaveScreen, { id: screenID, data: renamedScreen });

  const newScreens = screens.map((screen) => {
    return screen.id === screenID ? { ...screen, name: numberedName } : screen;
  });

  yield put(setScreens(newScreens));
}

export function* getScreenNNSaga() {
  // TODO why we need this saga and what doing button "Add Result Neural Network"?
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );

  const resultListScreen: IProjectScreen[] = yield call(
    reqWrapper,
    apiGetAllScreen,
  );
  const lastScreenId = resultListScreen[resultListScreen.length - 1].id;
  const data = {
    screen: lastScreenId,
    name: 'virtualization_vk',
    parameters: {},
    styles: {},
  };
  const resultScenario: IScenarioItem = yield call(
    reqWrapper,
    apiSetScenarioNeuralNetwork,
    { data },
  );

  if (currentProject.projectscreen.some((sID) => sID === resultScenario.id)) {
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

  const resultScreen = yield call(reqWrapper, apiSaveScreen, {
    id: newScreen.id,
    data: newScreen,
  });

  const updateProject = {
    ...currentProject,
    projectscreen: R.append(resultScreen, currentProject.projectscreen),
  };

  const screenscenario = [resultScenario.id];
  const resultElements: ReturnPromisedType<typeof apiGetElements> = yield call(
    reqWrapper,
    apiGetElements,
    { scenariosIDs: screenscenario },
  );
  const scenarioElements = convertScenarioElements(resultElements);

  yield all([
    put(setProject(updateProject)),
    put(setScenarioElements(scenarioElements)),
    put(activateScreen(lastScreenId)),
  ]);
}

export function* getScreenSaga(screenId: number) {
  const screen = yield call(reqWrapper, apiGetScreen, { id: screenId });
  const [element] = yield call(reqWrapper, apiGetElements, {
    scenariosIDs: [screen.screenscenario[0]],
  });

  screen.element = convertElementFromResponse(element);
  return screen;
}
