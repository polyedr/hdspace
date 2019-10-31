import { SagaIterator } from 'redux-saga';
import {
  put, call, select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { AppReduxState } from '$shared/types/app';
import { IListProject, IProject } from '$redux/project/reducer';
import { activateScreenSaga } from '$redux/project/sagas/screen';
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

export function* getProjectSaga({ id }: ReturnType<typeof Actions.getProject>) {
  const { project: { currentProject }, user: { isPrototypeMode } } = yield select(state => state);

  if (currentProject.id === Number(id)) {
    yield put(changePrototypeMode(isPrototypeMode));
  } else {
    yield put(changePrototypeMode(false));
  }

  if (!currentProject || currentProject.id !== id) {
    yield put(Actions.setProjectLoader(true));

    const result: IProject = yield call(reqWrapper, apiGetProject, { id });

    if (result) {
      yield put(Actions.setProject(result));

      const screenId: number = result.projectscreen.length && result.projectscreen[0].id;

      if (screenId) {
        yield call(activateScreenSaga, { payload: { projectId: id, screenId } });
      } else {
        yield put(Actions.setScreen(DEFAULT_SCREEN));
      }
    } else {
      // msg Error
    }

    yield put(Actions.setProjectLoader(false));
  }
}

export function* addProjectSaga({ name }: ReturnType<typeof Actions.addProject>): SagaIterator {
  const result: IListProject = yield call(reqWrapper, apiAddProject, { data: { name, status: 'pending' } });

  const { project: { listProject } }: AppReduxState = yield select();

  yield put(Actions.setListProject([...listProject, result]));
  yield put(push(`project/${result.id}`));
}

export function* delProjectSaga({ id }: ReturnType<typeof Actions.delProject>): SagaIterator {
  yield call(reqWrapper, apiDelProject, { id });

  const { project: { listProject } } = yield select(state => state);
  const newListProject: IListProject[] = listProject.filter(project => project.id !== id);

  yield put(Actions.setListProject(newListProject));
}

export function* renameProjectSaga(
  { payload: { projectId, newName } }: ReturnType<typeof Actions.renameProject>,
): SagaIterator {
  const { project: { listProject, currentProject } } = yield select(state => state);

  const currProject = listProject.find(project => project.id === projectId);

  if (!currProject) return;

  const data = { ...currProject, name: newName };

  yield call(reqWrapper, apiSaveProject, { data });

  const newListProject = listProject.map((project) => {
    if (project.id === projectId) {
      return {
        ...project,
        name: newName,
      };
    }

    return project;
  });

  yield put(Actions.setListProject(newListProject));

  if (currentProject.id === projectId) {
    yield put(Actions.setProject(data));
  }
}

export function* setProjectScreensSaga(
  { payload: { projectScreens } }: ReturnType<typeof Actions.setProjectScreens>,
): SagaIterator {
  const { project: { currentProject } } = yield select(state => state);

  const updateProject = {
    ...currentProject,
    projectscreen: projectScreens,
  };
  // TODO: Должны ли скрины сортироваться на бэке согласно buoyncy?
  // yield call(reqWrapper, apiSaveProject, { data: updateProject });
  yield call(reqWrapper, apiSaveScreens, { data: projectScreens });
  yield put(Actions.setProject(updateProject));
}
