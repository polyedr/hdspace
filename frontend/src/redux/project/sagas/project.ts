/* eslint-disable no-console */

import { SagaIterator } from 'redux-saga';
import { put, call, select } from 'redux-saga/effects';
import * as Actions from '../actions';
import { selectors } from '..';
import { reqWrapper } from './index';
import { addScreenSaga, getScreensSaga } from './screen';
import {
  convertCreatedProjectToRequest,
  convertProjectToPatchRequest,
} from '../../../api/converters/toRequest';
import {
  apiAddProject,
  apiDelProject,
  apiGetProjectList,
  apiSaveProject,
  apiGetProjectWithScreens,
} from '../../../api/project';
import {
  Project,
  PaginatedArray,
  ProjectWithScreens,
} from '../../../api/types';
import { selectProjectsDataNext } from '../selectors';

export function* getProjectListSaga(): SagaIterator {
  yield put(Actions.setProjectListLoader(true));

  const next: string | null = yield select(selectProjectsDataNext);

  const result: PaginatedArray<Project> = yield call(
    reqWrapper,
    apiGetProjectList,
    {
      params: {
        cursor: next,
      },
    },
  );

  if (!result) {
    yield put(Actions.setProjectListLoader(false));
    return;
  }

  yield put(Actions.setProjectsData(result));
  yield put(Actions.setProjectListLoader(false));
}

export function* getProjectSaga(action: ReturnType<typeof Actions.getProject>) {
  const { id } = action.payload;

  yield put(Actions.setProjectLoader(true));

  const project: ProjectWithScreens = yield call(
    reqWrapper,
    apiGetProjectWithScreens,
    {
      id,
    },
  );

  if (!project) {
    console.error(`Error while fetching project ${id}`);
    return;
  }

  yield put(
    Actions.setProject({
      ...project,
      projectscreen: project.projectscreen.map((screen) => screen.id),
    }),
  );

  yield call(getScreensSaga, project.projectscreen);

  yield put(Actions.setCurrentProjectId(project.id));
  yield put(Actions.setProjectLoader(false));
}

export function* addProjectSaga({
  payload: { name },
}: ReturnType<typeof Actions.addProject>) {
  const projectData = convertCreatedProjectToRequest(name);
  const project: Project = yield call(reqWrapper, apiAddProject, {
    data: projectData,
  });

  if (!project) {
    // TODO: write communication for such case
    console.error('cannot create project', project);
    return;
  }

  const projects: Project[] = yield select(selectors.selectProjectsAsArr);
  yield put(Actions.setProjectList([...projects, project]));

  yield put(Actions.setCurrentProjectId(project.id));

  yield call(addScreenSaga, Actions.addScreen(project.id, 'Screen 1', 0, true));
}

export function* delProjectSaga({
  payload: { id },
}: ReturnType<typeof Actions.delProject>): SagaIterator {
  yield call(reqWrapper, apiDelProject, { id });

  const projectList: Project[] = yield select(selectors.selectProjectsAsArr);
  const newProjectList: Project[] = projectList.filter(
    (project) => project.id !== id,
  );

  yield put(Actions.setProjectList(newProjectList));
}

export function* renameProjectSaga({
  payload: { projectID, name },
}: ReturnType<typeof Actions.renameProject>) {
  const project: Project = yield select(selectors.selectProjectById(projectID));

  const updatedProject = yield call(reqWrapper, apiSaveProject, {
    data: { id: projectID, name, projectscreen: project.projectscreen },
  });

  yield put(Actions.setProject(updatedProject));
}

export function* updateProject(newProject: Project) {
  yield put(Actions.setProject(newProject));
  const convertedProject = convertProjectToPatchRequest(newProject);
  yield call(reqWrapper, apiSaveProject, { data: convertedProject });
}

export function* updateProjectSaga(
  action: ReturnType<typeof Actions.updateProject>,
) {
  const { project } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
    selectors.selectCurrentProject,
  );

  yield call(updateProject, project);

  const { undo } = action.meta;

  if (!undo) {
    yield put(Actions.setUndoActions(Actions.updateProject(currentProject)));
  }
}
