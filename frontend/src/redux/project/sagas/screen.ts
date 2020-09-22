/* eslint-disable no-console */

import { SagaIterator } from 'redux-saga';
import { call, select, put, all, fork } from 'redux-saga/effects';
import * as R from 'ramda';
import { push } from 'connected-react-router';
import * as Actions from '../actions';
import { reqWrapper } from '.';
import { selectors, T } from '..';
import { createContainer } from './scenario';
import {
  selectAllElements,
  selectCurrentScreenId,
  selectScreenById,
  selectScreenRootElement,
} from '../selectors';
import {
  apiAddScreen,
  apiGetAllScreen,
  apiGetScreen,
  apiSaveScreen,
} from '../../../api/screen';
import { convertCreatedElementToRequest } from '../../../api/converters/toRequest';
import { apiGetProject, apiSaveProject } from '../../../api/project';
import { Screen, IScenarioItem, StateElement, Map } from '../types';
import {
  activateScreen,
  addElements,
  addScreen,
  delScreen,
  renameScreen,
  restoreScreen,
  saveScreenImage,
  setActiveElementId,
  setCurrentScreenId,
  setLoader,
  setProject,
  updateScreen,
  setScreenLoader,
  setScreens,
  setUndoActions,
} from '../actions';
import { apiAddElements, apiGetElements } from '../../../api/element';
import {
  LibraryElement,
  LibraryElementUnion,
  Project,
} from '../../../api/types';
import { ReturnPromisedType } from '../../../shared/types';
import generateUniqueName from '../../../utils/generateUniqueName';
import {
  apiSaveScenarios,
  apiSetScenarioNeuralNetwork,
} from '../../../api/scenario';
import { convertElementFromResponse } from '../../../api/converters/fromResponse';
import getSavedValue from '../../../utils/getSavedValue';

export function* activateScreenSaga({
  payload: { screenId },
}: ReturnType<typeof activateScreen>) {
  const currentScreenId = yield select(selectCurrentScreenId);
  if (currentScreenId === screenId) return;

  yield put(setScreenLoader(true));

  yield put(setActiveElementId('none'));

  const screen: Screen = yield select(selectScreenById(screenId));
  if (!screen) return;

  yield put(setCurrentScreenId(screen.id));

  yield put(Actions.setScenarioLoader(true));

  const screenElement = yield select(selectScreenRootElement(screenId));
  if (!screenElement) return;

  yield put(Actions.setActiveElementId(screenElement.id));

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
  const { projectID, name, buoyancy, skip } = payload;

  const screens: Screen[] = yield select(selectors.selectScreens);
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

  const createdScreen: Screen = yield call(reqWrapper, apiAddScreen, { data });

  if (!createdScreen) {
    console.error(`Error while creating new screen for project ${projectID}`);
    return;
  }

  if (!skip) {
    yield put(setUndoActions(delScreen(projectID, createdScreen.id)));
  }

  const rootScenario: T.IScenarioItem = yield call(createContainer, {
    screen: createdScreen.id,
  });

  const screen = R.omit(['screen_data_text'], createdScreen);

  const rootElement = convertCreatedElementToRequest(
    'root',
    String(rootScenario.id),
    'Root',
  );

  const [createdRootElement]: [LibraryElement<'root'>] = yield call(
    reqWrapper,
    apiAddElements,
    { data: [rootElement] },
  );

  yield put(addElements([createdRootElement]));

  const rootScenarioWithRootElement = {
    ...rootScenario,
    elements: [createdRootElement.id],
  };

  yield fork(reqWrapper, apiSaveScenarios, {
    data: [rootScenarioWithRootElement],
  });

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

  updatedScreen.element = createdRootElement.id;

  yield put(setProject(updateProject));

  yield put(setScreens([...screens, updatedScreen]));

  yield put(setCurrentScreenId(screen.id));

  const state: Map<StateElement> = yield select(selectAllElements);
  yield put(
    Actions.updateElementsTree(state, {
      screenId: screen.id,
      undo: skip,
      sourceAction: restoreScreen(screen.id, projectID),
    }),
  );

  yield put(Actions.setActiveElementId(createdRootElement.id));

  yield put(push(`/project/${projectID}/${screen.id}`));
  // eslint-disable-next-line consistent-return
  return updatedScreen;
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (blob) => (blob !== null ? resolve(blob) : undefined),
      'image/jpg',
      1,
    ),
  );
  return dataBlob;
}

export function* saveScreenImageSaga({
  payload: { screenId, canvas },
}: ReturnType<typeof saveScreenImage>): SagaIterator {
  yield put(setLoader(true));

  const blobFile = yield call(canvasToBlob, canvas);
  const formData = new FormData();

  formData.append('image', blobFile, `${screenId}.png`);

  const resultScreen = yield call(reqWrapper, apiSaveScreen, {
    id: screenId,
    data: formData,
  });

  if (!resultScreen) {
    console.error(`Error while patching screen ${screenId}`);
    return;
  }

  yield put(updateScreen(resultScreen));

  yield put(setLoader(false));
}

export function* delScreenSaga({
  payload: { projectId, screenId },
  meta,
  type,
}: ReturnType<typeof delScreen>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  const { undo } = meta;

  const currentScreenId = yield select(selectors.selectCurrentScreenId);

  if (currentScreenId === screenId) {
    yield put(setActiveElementId('none'));
    yield put(setCurrentScreenId(-1));
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );
  const screenList = currentProject.projectscreen;

  if (screenList.length <= 1) {
    console.log('Project must have at least 1 screen');
    return;
  }

  const newScreenIdList = currentProject.projectscreen.filter(
    (id) => id !== screenId,
  );

  yield call(reqWrapper, apiSaveProject, {
    data: {
      projectscreen: newScreenIdList,
      id: projectId,
    },
  });

  if (!undo) {
    yield put(setUndoActions(restoreScreen(screenId, projectId)));
  }
  // const rootToRemove = yield select(selectScreenRootElement(screenId));
  // yield put(removeElements([rootToRemove.id]));

  const result: Project = R.assoc(
    'projectscreen',
    currentProject.projectscreen.filter((id) => id !== screenId),
    currentProject,
  );

  yield put(setProject(result));

  const lastScreenID = R.head(result.projectscreen);

  if (!lastScreenID) {
    yield put(setCurrentScreenId(-1));
    yield put(push(`/project/${projectId}`));
    return;
  }

  const screens: ReturnType<typeof selectors.selectScreens> = yield select(
    selectors.selectScreens,
  );

  const newScreens = screens.filter((screen) => screen.id !== screenId);
  yield put(setScreens(newScreens));

  if (lastScreenID !== currentScreenId) {
    yield put(activateScreen(lastScreenID));
    yield put(push(`/project/${projectId}/${lastScreenID}`));
  }
}

export function* restoreScreenSaga({
  type,
  payload: { projectId, screenId },
  meta,
}: ReturnType<typeof restoreScreen>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }

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

  if (!meta.undo) {
    yield put(setUndoActions(delScreen(projectId, screenId)));
  }

  const screens = yield select(selectors.selectScreens);
  const screen = yield call(reqWrapper, apiGetScreen, {
    id: screenId,
  });
  const [element] = yield call(reqWrapper, apiGetElements, {
    scenariosIDs: [screen.screenscenario[0]],
  });

  screen.element = element.id;

  yield put(setScreens([screen, ...screens]));

  yield put(setProject(updatedProject));

  // yield put(addElements([convertElementFromResponse(element)]));

  yield put(activateScreen(screenId));
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

  const renamedScreen: Screen = {
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

  const resultListScreen: Screen[] = yield call(reqWrapper, apiGetAllScreen);
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
  const [rootElement] = yield call(reqWrapper, apiGetElements, {
    scenariosIDs: screenscenario,
  });
  resultScreen.element = rootElement.id;

  yield all([
    put(addElements([convertElementFromResponse(rootElement)])),
    put(setProject(updateProject)),
    put(updateScreen(resultScreen)),
    put(activateScreen(lastScreenId)),
  ]);
}

export function* getScreenSaga(screenId: number) {
  const screen = yield call(reqWrapper, apiGetScreen, { id: screenId });
  const [element] = yield call(reqWrapper, apiGetElements, {
    scenariosIDs: [screen.screenscenario[0]],
  });

  if (!screen || !element) {
    console.error(`Error while fetching screen ${screenId}`);
  }

  yield put(addElements([convertElementFromResponse(element)]));

  screen.element = element.id.toString();

  return screen;
}
