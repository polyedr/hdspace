import { SagaIterator } from 'redux-saga';
import {
  put, call, select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

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
  apiSaveScreens,
} from '$api/project';
import { DEFAULT_SCREEN } from '$constants/defaultParams';
import { reqWrapper } from '$redux/project/sagas/index';

import { selectors } from '../';

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
      const projectScreensIDs = project.projectscreen.map(x => x.id);
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

export function* addProjectSaga({ payload: { name } }: ReturnType<typeof Actions.addProject>) {
  const result: IListProject = yield call(reqWrapper, apiAddProject, { data: { name, status: 'pending' } });

  const listProject: ReturnType<typeof selectors.selectProjects> = yield select(selectors.selectProjects);
  yield put(Actions.setListProject([...listProject, result]));

  return result;
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

export function* setProjectScreensSaga(
  { payload: { screens } }: ReturnType<typeof Actions.setProjectScreens>,
): SagaIterator {
  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(selectors.selectCurrentProject);

  const updateProject = {
    ...currentProject,
    projectscreen: screens,
  };
  // TODO: Должны ли скрины сортироваться на бэке согласно buoyncy?
  // yield call(reqWrapper, apiSaveProject, { data: updateProject });
  yield call(reqWrapper, apiSaveScreens, { data: screens });
  yield put(Actions.setProject(updateProject));
}
