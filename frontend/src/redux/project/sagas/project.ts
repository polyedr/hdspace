/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';

import {
  convertCreatedElementToRequest,
  convertCreatedProjectToRequest,
} from '@Api/converters/toRequest';
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
  Entity,
  LibraryElement,
  PaginatedResponse,
  Project,
  ProjectsSearchParameter,
  ProjectWithScreens,
  Result,
  Screen,
} from '@Src/types';
import getSearchParams from '@Utils/getSearchParams';
import CORE_MASTER_ELEMENTS from '@Components/Editor/MasterScreen/coreElements';
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
import { selectElementAsTree, selectElementById } from '../selectors/element';
import { createElements } from './scenario';

function* setMasterScreenCoreElements(screen: Screen) {
  const rootElement = yield select(selectElementById(screen.element));
  yield put(Actions.setMasterElementsIds(...rootElement.children));
  const masterCoreId = rootElement.children[0];
  yield put(
    Actions.addStateElements(CORE_MASTER_ELEMENTS, masterCoreId, {
      screenId: screen.id,
    }),
  );
}

function* createMasterScreenElements(screen: Screen) {
  const elements = [
    convertCreatedElementToRequest(
      'container',
      screen.element,
      'Master Core Elements',
    ),
    convertCreatedElementToRequest(
      'container',
      screen.element,
      'Master Group Elements',
    ),
  ];
  const masterRoot: LibraryElement<Entity> = yield select(
    selectElementAsTree(screen.element),
  );

  yield call(createElements, { elements }, masterRoot, {
    screenId: screen.id,
    useHistory: true,
  });
  yield call(setMasterScreenCoreElements, screen);
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
        yield call(setMasterScreenCoreElements, masterScreen);
      }
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
      yield put(Actions.addAssetListToState(assetList, { useHistory: true }));
      const projects: Project[] = yield select(selectProjectsAsArr);
      yield put(Actions.setProjectList([...projects, result]));

      yield put(Actions.setCurrentProjectId(result.id));

      const masterScreen: Screen = yield call(
        createScreenSaga,
        Actions.createScreen(
          {
            projectID: result.id,
            name: 'Master Screen',
            buoyancy: 0,
            rootName: 'Master Screen',
          },
          {
            useHistory: true,
          },
        ),
      );

      if (masterScreen) {
        yield call(createMasterScreenElements, masterScreen);
      }

      const initialScreen: Screen = yield call(
        createScreenSaga,
        Actions.createScreen(
          { projectID: result.id, name: 'Screen 1', buoyancy: 1 },
          {
            useHistory: true,
          },
        ),
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
        yield put(Actions.setNewScreenModal(true));
      } else {
        throw new Error('Failed to create screens');
      }
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
      if (!action.meta.useHistory) {
        yield put(
          Actions.addUndoActions(
            Actions.updateProject(currentProject, { ...action.meta }),
          ),
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
