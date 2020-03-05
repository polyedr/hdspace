import { SagaIterator } from 'redux-saga';
import {
  put, call, select, all,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

import { ReturnPromisedType } from '$shared/types';
import { AppReduxState } from '$shared/types/app';
import { IListProject } from '$redux/project/types';
import { activateScreenSaga, addScreenSaga } from '$redux/project/sagas/screen';
import * as Actions from '$redux/project/actions';
import { changePrototypeMode } from '$redux/user/actions';
import {
  apiGetListProject,
  apiAddProject,
  apiDelProject,
  apiGetProject,
  apiSaveProject,
} from '$api/project';
import { DEFAULT_SCREEN } from '$constants/defaultParams';
import { reqWrapper } from '$redux/project/sagas/index';

import { selectors, T } from '../';
import { request } from 'http';
import { apiGetScenarios } from '$api/scenario';
import { apiGetElements } from '$api/element';
import { Page } from '$components/Editor/Export/Export';

export function* getListProjectSaga(): SagaIterator {
  yield put(Actions.setListProjectLoader(true));
  yield put(Actions.getLibraryElements());

  const result = yield call(reqWrapper, apiGetListProject);

  if (!result) {
    yield put(Actions.setListProjectLoader(false));

    return;
  }

  yield put(Actions.setListProject(result));
  yield put(Actions.setListProjectLoader(false));
}

export function* getProjectSaga(action: ReturnType<typeof Actions.getProject>) {
  const { id, screenID } = action.payload;
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const { user: { isPrototypeMode } }: AppReduxState = yield select();

  if (currentProject.id === id) {
    yield put(changePrototypeMode(isPrototypeMode));
  } else {
    yield put(changePrototypeMode(false));
  }

  if (!currentProject || currentProject.id !== id) {
    yield put(Actions.setProjectLoader(true));

    const project: ReturnPromisedType<typeof apiGetProject> = yield call(reqWrapper, apiGetProject, { id });

    if (project) {
      yield put(Actions.setProject(project));
      const projectScreensIDs = project.projectscreen;
      const finalScreenID = screenID && projectScreensIDs.includes(Number(screenID)) ? screenID : projectScreensIDs[0];

      if (finalScreenID) {
        yield call(activateScreenSaga, Actions.activateScreen(id, Number(finalScreenID)));
        yield put(push(`/project/${id}/${finalScreenID}`));
      } else {
        yield put(Actions.setScreen(DEFAULT_SCREEN));
      }
    } else {
      // msg Error
    }

    yield put(Actions.setProjectLoader(false));
  }
}

export function* addProject(action: ReturnType<typeof Actions.addProject>) {
  const { id: projectID } = yield call(addProjectSaga, action);
  yield call(addScreenSaga, Actions.addScreen(projectID, 'Screen'));
  yield put(push(`/project/${projectID}`));
}

export function* exportProjectSaga(action: ReturnType<typeof Actions.exportProject>) {
  const { payload: { projectID } } = action;

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);
  const screensIDs = currentProject.projectscreen;

  const screensScenarios: ReturnPromisedType<typeof apiGetScenarios>[] = yield all(screensIDs.map(screenID =>
    call(reqWrapper, apiGetScenarios, { screenID }),
  ));

  // console.log(screensScenarios);

  /* const screensWithScenarios = screensScenarios.map(screenScenarios => ({
    screenID: screensIDs.filter(screenID => screenScenarios[0] && screenID === screenScenarios[0].screen),
    scenarios: screenScenarios,
  })); */

  /* console.log(screensWithScenarios.map(screenWithScenarios =>
    screenWithScenarios.scenarios.map(screenScenario => screenScenario.id)  ,
  )); */

  const elements: ReturnPromisedType<typeof apiGetElements>[] = yield all(screensScenarios.map(screenScenarios => {
    const IDs = screenScenarios.map(screenScenario => screenScenario.id);
    return call(reqWrapper, apiGetElements, { scenariosIDs: IDs });
  }));

  const tree: Page[] = screensScenarios.map((screenScenarios, index) => ({
    name: String(screenScenarios && screenScenarios[0] && screenScenarios[0].screen),
    renderTree: {
      scenarios: screenScenarios,
      scenarioElements: elements[index],
    },
  }))

  console.log(tree);

  const screen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(selectors.selectCurrentScreen);


  const scenarios: ReturnType<typeof selectors.selectScenarios> = yield select(selectors.selectScenarios);

  // console.log(screensScenarios);

  const scenarioElements: ReturnType<typeof selectors.selectScenariosElements> = yield select(
    selectors.selectScenariosElements,
  );

  const zip = new JSZip();

  const resp = yield call(fetch, 'http://localhost:8080/export/app.js');
  const jsFile = yield call([resp, "text"]);

  const vendorResp = yield call(fetch, 'http://localhost:8080/export/vendor.js');
  const vendorFile = yield call([vendorResp, "text"]);

  /* console.log(jsFile) */

  /* const renderTreeInfo = [
    {
      name: 'first',
      renderTree: {
        scenarios,
        scenarioElements,
      }
    }
  ] */

  const renderTreeInfoInString = JSON.stringify(tree);

  zip.file('test.html', 
  `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
      <title>Project</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.renderTreeInfo = ${renderTreeInfoInString};
      </script>
      <script src="vendor.js"></script>
      <script src="app.js"></script>
    </body>
  </html>
  `);

  zip.file('app.js', jsFile);
  zip.file('vendor.js', vendorFile);

  zip.generateAsync({ type: 'blob' })
    .then(function (blob) {
        saveAs(blob, "hello.zip");
    });

  /* console.log(currentProject, scenarios, scenarioElements, screen) */
}


export function* addProjectSaga({ payload: { name } }: ReturnType<typeof Actions.addProject>) {
  const project: IListProject = yield call(reqWrapper, apiAddProject, { data: { name, status: 'pending' } });
  
  if (!project) { // TODO: write communication for such case
    console.error('cannot create project', project);
    return;
  }

  const projects: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  yield put(Actions.setListProject([...projects, project]));

  return project;
}

export function* delProjectSaga({ payload: { id } }: ReturnType<typeof Actions.delProject>): SagaIterator {
  yield call(reqWrapper, apiDelProject, { id });

  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  const newListProject: IListProject[] = listProject.filter(project => project.id !== id);

  yield put(Actions.setListProject(newListProject));
}

export function* renameProjectSaga(
  { payload: { projectID, name } }: ReturnType<typeof Actions.renameProject>,
): SagaIterator {
  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const currProject = listProject.find(project => project.id === projectID);

  if (!currProject) return;

  const data = { ...currProject, name: name };

  yield call(reqWrapper, apiSaveProject, { data });

  const newListProject = listProject.map((project) => {
    if (project.id === projectID) {
      return {
        ...project,
        name: name,
      };
    }

    return project;
  });

  yield put(Actions.setListProject(newListProject));

  if (currentProject.id === projectID) {
    yield put(Actions.setProject(data as any)); // TODO: research what the difference between IListProject and IProject
  }
}

export function* changeScreensOrderSaga(action: ReturnType<typeof Actions.changeScreensOrder>) {
  const { screensIDs } = action.payload;
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject
  );

  const updatedProject: T.IProject = {
    ...currentProject,
    projectscreen: screensIDs,
  };

  yield call(reqWrapper, apiSaveProject, { data: updatedProject });
  yield put(Actions.setProject(updatedProject));
}
