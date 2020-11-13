/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';
import { updateProjectHelperSaga, reqWrapper } from './shared';
import * as Actions from '../actions';
import { selectors } from '..';
import { addScreenSaga, getScreensSaga } from './screen';
import { convertCreatedProjectToRequest } from '../../../api/converters/toRequest';
import {
  apiCreateProject,
  apiDeleteProject,
  apiGetProjectList,
  apiUpdateProject,
  apiGetProjectWithScreens,
} from '../../../api/project';
import { selectProjectsDataNext } from '../selectors';
import {
  PaginatedResponse,
  Project,
  ProjectWithScreens,
  Result,
} from '../../../types';
import { enqueueSnackbar } from '../../notification/actions';

export function* getProjectListSaga() {
  try {
    yield put(Actions.setProjectListLoader(true));

    const next: string | null = yield select(selectProjectsDataNext);

    const { result, error }: Result<PaginatedResponse<Project>> = yield call(
      reqWrapper,
      apiGetProjectList,
      {
        params: {
          cursor: next,
        },
      },
    );

    if (result) {
      yield put(Actions.setProjectsData(result));
    }

    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  } finally {
    yield put(Actions.setProjectListLoader(false));
  }
}

export function* getProjectSaga(action: ReturnType<typeof Actions.getProject>) {
  try {
    const { id } = action.payload;

    yield put(Actions.setProjectLoader(true));

    const res: Result<ProjectWithScreens> = yield call(
      reqWrapper,
      apiGetProjectWithScreens,
      {
        id,
      },
    );

    const { result, error } = res;

    if (result) {
      yield put(
        Actions.setProject({
          ...result,
          projectscreen: result.projectscreen.map((screen) => screen.id),
        }),
      );

      yield call(getScreensSaga, result.projectscreen);

      yield put(Actions.setCurrentProjectId(result.id));
    }

    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  } finally {
    yield put(Actions.setProjectLoader(false));
  }
}

export function* createProjectSaga({
  payload: { name },
}: ReturnType<typeof Actions.createProject>) {
  try {
    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiCreateProject,
      {
        data: convertCreatedProjectToRequest(name),
      },
    );

    if (result) {
      const projects: Project[] = yield select(selectors.selectProjectsAsArr);
      yield put(Actions.setProjectList([...projects, result]));

      yield put(Actions.setCurrentProjectId(result.id));

      yield call(
        addScreenSaga,
        Actions.addScreen(result.id, 'Screen 1', 0, true),
      );
    }

    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

export function* deleteProjectSaga({
  payload: { id },
}: ReturnType<typeof Actions.deleteProject>) {
  try {
    const { result, error }: Result<boolean> = yield call(
      reqWrapper,
      apiDeleteProject,
      { id },
    );

    if (result) {
      const projectList: Project[] = yield select(
        selectors.selectProjectsAsArr,
      );
      const newProjectList: Project[] = projectList.filter(
        (project) => project.id !== id,
      );

      yield put(Actions.setProjectList(newProjectList));
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

export function* renameProjectSaga({
  payload: { projectID, name },
}: ReturnType<typeof Actions.renameProject>) {
  try {
    const project: Project = yield select(
      selectors.selectProjectById(projectID),
    );

    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiUpdateProject,
      {
        data: { id: projectID, name, projectscreen: project.projectscreen },
      },
    );

    if (result) {
      yield put(Actions.setProject(result));
    }
    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

export function* updateProjectSaga(
  action: ReturnType<typeof Actions.updateProject>,
) {
  try {
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

    const success: boolean = yield call(updateProjectHelperSaga, project);

    if (success) {
      const { undo } = action.meta;

      if (!undo) {
        yield put(
          Actions.setUndoActions(Actions.updateProject(currentProject)),
        );
      }
    } else {
      throw new Error(`Failed to update project ${project.name}`);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}
