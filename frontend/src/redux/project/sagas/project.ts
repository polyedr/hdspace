/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';

import { convertCreatedProjectToRequest } from '@Api/converters/toRequest';
import {
  apiCreateProject,
  apiDeleteProject,
  apiGetProjectList,
  apiUpdateProject,
  apiGetProjectWithScreens,
} from '@Api/project';
import { apiCreateAssetList } from '@Api/assetList';
import { DEFAULT_ASSET_LIST_NAME } from '@Constants/defaultParams';
import {
  DateRange,
  PaginatedResponse,
  Project,
  ProjectsSearchParameter,
  ProjectWithScreens,
  Result,
  Screen,
} from '@Src/types';
import getSearchParams from '@Utils/getSearchParams';
import {
  CORE_ROOT_CONTAINER,
  CORE_GROUPS_CONTAINER,
  CORE_MASTER_ELEMENTS,
} from '@Components/Editor/MasterScreen/coreElements';
import { enqueueSnackbar } from '../../notification/actions';
import { projectUpdateHelperSaga, reqWrapper } from './shared';
import * as Actions from '../actions';
import { createScreenSaga, getScreensSaga } from './screen';
import {
  selectCurrentProject,
  selectProjectById,
  selectProjectsAsArr,
  selectProjectsDataNext,
  selectProjectsSearchParameter,
} from '../selectors/base';
import { selectScreenById } from '../selectors/screen';

function* createMasterScreenElements(screen: Screen) {
  console.log('STEP 1', screen);
  // const masterScreenRoot = yield select(selectMaster)
  yield put(
    Actions.addStateElements(
      [CORE_ROOT_CONTAINER, CORE_GROUPS_CONTAINER],
      screen.element,
      { screenId: screen.id },
    ),
  );
  console.log('STEP 2');
  yield put(
    Actions.addStateElements(CORE_MASTER_ELEMENTS, CORE_ROOT_CONTAINER.id, {
      screenId: screen.id,
    }),
  );
  console.log('STEP 3');
}

export function* searchProjectsSaga() {
  try {
    yield put(Actions.setProjectListLoader(true));
    yield put(
      Actions.setProjectsData({
        next: null,
        previous: null,
        results: [],
      }),
    );
    yield put(Actions.setProjectList([]));

    const paramData: [
      ProjectsSearchParameter,
      string | DateRange,
    ] = yield select(selectProjectsSearchParameter);

    const { result, error }: Result<PaginatedResponse<Project>> = yield call(
      reqWrapper,
      apiGetProjectList,
      {
        params: getSearchParams(paramData),
      },
    );

    if (result) {
      yield put(Actions.setProjectsData(result));
    }

    if (error) {
      throw new Error(error);
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

export function* getProjectListSaga() {
  try {
    yield put(Actions.setProjectListLoader(true));

    const next: string | null = yield select(selectProjectsDataNext);

    const paramData: [ProjectsSearchParameter, string] = yield select(
      selectProjectsSearchParameter,
    );
    const searchParams = getSearchParams(paramData);

    const { result, error }: Result<PaginatedResponse<Project>> = yield call(
      reqWrapper,
      apiGetProjectList,
      {
        params: {
          cursor: next,
          ...(paramData[1] && {
            ...searchParams,
          }),
        },
      },
    );

    if (result) {
      yield put(Actions.setProjectsData(result));
    }

    if (error) {
      throw new Error(error);
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

    const { result, error }: Result<ProjectWithScreens> = yield call(
      reqWrapper,
      apiGetProjectWithScreens,
      {
        id,
      },
    );

    if (result) {
      yield put(
        Actions.setProject({
          ...result,
          projectscreen: result.projectscreen.map((screen) => screen.id),
        }),
      );
      if (result.projectscreen.length) {
        yield call(getScreensSaga, result.projectscreen);
      }

      yield put(Actions.setCurrentProjectId(result.id));
      const masterScreenId: number =
        result.projectscreen.find((screen: Screen) => !screen.buoyancy)?.id ||
        -1;
      yield put(Actions.setMasterScreenId(masterScreenId));
      const masterScreen = yield select(selectScreenById(masterScreenId));
      if (masterScreen) {
        console.log('MASTER SCREEN!!', masterScreen);
        yield call(createMasterScreenElements, masterScreen);
      }
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    console.log('ERROR 1', e);
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

export function* createProjectSaga(
  action: ReturnType<typeof Actions.createProject>,
) {
  const {
    payload: { name },
  } = action;
  try {
    yield put(Actions.setProjectCreateLoader(true));

    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiCreateProject,
      {
        data: convertCreatedProjectToRequest(name),
      },
    );

    if (result?.created) {
      const assetList = yield call(reqWrapper, apiCreateAssetList, {
        projectId: result.id,
        name: DEFAULT_ASSET_LIST_NAME,
      });
      yield put(
        Actions.addAssetListToState(assetList, { sourceAction: action }),
      );
      const projects: Project[] = yield select(selectProjectsAsArr);
      yield put(Actions.setProjectList([...projects, result]));

      yield put(Actions.setCurrentProjectId(result.id));

      const masterScreen: Screen = yield call(
        createScreenSaga,
        Actions.createScreen(
          result.id,
          'Master Screen',
          0,
          true,
          'Master Screen',
        ),
      );

      if (masterScreen) {
        yield call(createMasterScreenElements, masterScreen);
      }

      const initialScreen: Screen = yield call(
        createScreenSaga,
        Actions.createScreen(result.id, 'Screen 1', 1, true),
      );

      if (initialScreen && masterScreen) {
        yield put(Actions.setMasterScreenId(masterScreen.id));
        yield put(
          enqueueSnackbar({
            message: `Project ${result.name} created`,
            options: {
              variant: 'success',
            },
          }),
        );
      } else {
        throw new Error('Failed to create screens');
      }
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    console.error('ERROR 2', e);
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  } finally {
    yield put(Actions.setProjectCreateLoader(false));
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
      const projectList: Project[] = yield select(selectProjectsAsArr);
      const newProjectList: Project[] = projectList.filter(
        (project) => project.id !== id,
      );

      yield put(Actions.setProjectList(newProjectList));
      yield put(
        enqueueSnackbar({
          message: `Project deleted`,
          options: {
            variant: 'success',
          },
        }),
      );
    }
    if (error) {
      throw new Error(error);
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
    const project: Project = yield select(selectProjectById(projectID));

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
      throw new Error(error);
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

    const currentProject: ReturnType<
      typeof selectCurrentProject
    > = yield select(selectCurrentProject);

    const success: boolean = yield call(projectUpdateHelperSaga, project);

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
