import { put, call, select } from 'redux-saga/effects';
import { convertCreatedElementToRequest } from '@Api/converters/toRequest';
import generator from 'generate-password';
import {
  apiCreateProject,
  apiDeleteProject,
  apiGetProjectList,
  apiUpdateProject,
  apiGetProjectWithScreens,
  apigetSharedProject,
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
  UserProjectPermission,
  ServerUserData,
} from '@Src/types';

import getSearchParams from '@Utils/getSearchParams';
import { CORE_MASTER_ELEMENTS } from '@Components/Editor/MasterScreen/coreElements';
import { CORE_PREVIEW_LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import getTagsArr from '@Utils/getTagsArr';
// import { successSavedBoard } from '@Redux/pmtools/board/actions/columns';
import { apiCreateNewStreams } from '@Api/pmtools/chatApi';
// import {
//   apiGetBoard,
//   createNewBoard,
//   createOrganization,
//   deleteOrganization,
//   getAddUserToBoard,
//   getUserByEmail,
// } from '@Api/pmtools/board/boardApi';
import logger from 'loglevel';
import { setStateCurrentUserPermissions } from '@Redux/permissions/actions';
import { apiGetUser } from '@Api/user';
import { setUserData, setTokenPair } from '@Redux/user/actions';
import { convertUserDataFromResponse } from '@Api/converters/fromResponse';
import { enqueueSnackbar } from '../../notification/actions';
import { projectUpdateHelperSaga, reqWrapper } from './shared';
import * as Actions from '../actions';
import * as PermissionsActions from '../../permissions/actions';
import { createScreenSaga, getScreensSaga } from './screen';
import {
  selectCurrentProject,
  selectCurrentUIFramework,
  selectProjectById,
  selectProjectsAsArr,
  selectProjectsDataNext,
  selectProjectsSearchParameter,
} from '../selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenId,
  selectScreenById,
} from '../selectors/screen';
import { selectElementAsTree, selectElementById } from '../selectors/element';
import { createElements } from './common';

export function* setMasterScreenCoreElements(screen: Screen) {
  const rootElement = yield select(selectElementById, screen.element);
  yield put(Actions.setMasterElementsIds(...rootElement.children));
  const masterCoreId = rootElement.children[0];
  CORE_MASTER_ELEMENTS.push(...CORE_PREVIEW_LIBRARY_ELEMENTS);
  yield put(
    Actions.addStateElements(
      [
        {
          elements: CORE_MASTER_ELEMENTS,
          parentId: masterCoreId,
        },
      ],
      { screenId: screen.id },
    ),
  );
}

export function* createMasterScreenElements(screen: Screen) {
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

  yield call(createElements, [{ elements, parent: masterRoot }], {
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

    let paramData: [
      ProjectsSearchParameter | 'tags__name',
      string | DateRange,
    ] = yield select(selectProjectsSearchParameter);

    if (paramData[0] === 'tags') {
      paramData = ['tags__name', paramData[1]];
    }

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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
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

    // if (result?.projectTrelloJSON) {
    //   yield put(successSavedBoard(result.projectTrelloJSON));
    // }

    if (result) {
      yield put(Actions.changeLayout(result?.projectData?.layout?.value));
      yield put(
        Actions.rotateScreenFormat(result?.projectData?.layout?.rotated),
      );
      yield put(PermissionsActions.getMyPermissionsForProject(result.id));
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
      yield put(Actions.setAssetLists(null));
      yield put(Actions.setSelectedAssetListId(null));
      const masterScreenId: number =
        result.projectscreen.find((screen: Screen) => !screen.buoyancy)?.id ||
        -1;
      yield put(Actions.setMasterScreenId(masterScreenId));

      const masterScreen = yield select(selectScreenById, masterScreenId);

      if (masterScreen) {
        yield call(setMasterScreenCoreElements, masterScreen);
      }
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  } finally {
    yield put(Actions.setProjectLoader(false));
  }
}

export function* createProjectSaga() {
  try {
    const generateName = generator.generate();
    yield put(Actions.setProjectCreateLoader(true));

    // const organization: IOrganization = yield call(
    //   createOrganization,
    //   `${generateName}-adevi-org`,
    // );
    // const board: IBoardForUI = yield call(createNewBoard, generateName);
    yield call(apiCreateNewStreams, generateName);

    // const boardForUI: IBoardForUI = {
    //   organization,
    //   ...board,
    // };

    // const { email } = yield select(selectUserData);
    // const userTrello = yield call(getUserByEmail, email);
    // if (!userTrello.error) {
    //   yield call(getAddUserToBoard, email, board.id);
    // }

    const { result: createdProject, error }: Result<Project> = yield call(
      reqWrapper,
      apiCreateProject,
      {
        // data: convertCreatedProjectToRequest(name, boardForUI),
        data: [],
      },
    );
    // yield put(successSavedBoard(boardForUI));

    if (createdProject?.created) {
      yield put(
        PermissionsActions.setStateCurrentUserPermissions([
          UserProjectPermission.VIEW_PROJECT,
          UserProjectPermission.CHANGE_PROJECT,
        ]),
      );
      yield call(reqWrapper, apiCreateAssetList, {
        projectId: createdProject.id,
        name: DEFAULT_ASSET_LIST_NAME,
      });

      yield put(Actions.setAssetLists(null));
      yield put(Actions.setSelectedAssetListId(null));
      const projects: Project[] = yield select(selectProjectsAsArr);
      yield put(Actions.setProjectList([...projects, createdProject]));

      yield put(Actions.setCurrentProjectId(createdProject.id));
      yield put(
        Actions.updateLayoutProject(
          createdProject.id,
          JSON.stringify({
            ...createdProject.projectData,
            layout: { value: 'desktop' },
          }),
        ),
      );
      const masterScreen: Screen = yield call(
        createScreenSaga,
        Actions.createScreen(
          {
            projectID: createdProject.id,
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
          { projectID: createdProject.id, name: 'Screen-1', buoyancy: 1 },
          {
            useHistory: true,
          },
        ),
      );

      if (initialScreen && masterScreen) {
        yield put(Actions.setMasterScreenId(masterScreen.id));
        yield put(
          enqueueSnackbar({
            message: `Project ${createdProject.name} created`,
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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  } finally {
    yield put(Actions.setProjectCreateLoader(false));
  }
}

export function* deleteProjectSaga({
  payload: { id },
}: ReturnType<typeof Actions.deleteProject>) {
  try {
    // const board = yield call(reqWrapper, apiGetBoard, {
    //   project: id,
    // });

    // yield call(deleteOrganization, JSON.parse(board).organization?.id);
    // yield call(apiDeleteStream, JSON.parse(board).name);

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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  }
}

export const updateNameAndTagsProjectSaga = function* ({
  payload: { projectID, name, tags },
}: ReturnType<typeof Actions.updateNameAndTagsProject>) {
  try {
    const project: Project = yield select(selectProjectById, projectID);
    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiUpdateProject,
      {
        data: {
          id: projectID,
          name,
          tags: typeof tags !== 'object' ? getTagsArr(tags) : tags,
          projectscreen: project.projectscreen,
        },
      },
    );

    if (result) {
      yield put(Actions.setProject(result));
    }
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  }
};

export const updateLayoutProjectSaga = function* ({
  payload: { projectID, projectDataJson },
}: ReturnType<typeof Actions.updateLayoutProject>) {
  try {
    const project: Project = yield select(selectProjectById, projectID);
    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiUpdateProject,
      {
        data: {
          id: projectID,
          project_data_json: projectDataJson,
          projectscreen: project.projectscreen,
        },
      },
    );

    if (result) {
      yield put(Actions.setProject(result));
    }
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  }
};

export function* updateProjectSaga(
  action: ReturnType<typeof Actions.updateProject>,
) {
  try {
    const { project } = action.payload;

    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const currentProject: ReturnType<typeof selectCurrentProject> =
      yield select(selectCurrentProject);

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
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  }
}

export const updateCurrentUIFrameworkSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof Actions.updateCurrentUIFramework>) {
  const { uiFramework } = action.payload;
  const project = yield select(selectCurrentProject);
  const currentScreenId = yield select(selectCurrentScreenId);
  const masterScreenId = yield select(selectMasterScreenId);
  if (currentScreenId === masterScreenId) {
    const newProject: Project = {
      ...project,
      projectData: {
        ...project.projectData,
        uiFramework,
      },
    };
    yield put(Actions.updateProject(newProject));
  } else {
    yield put(
      Actions.editScreenNameAndData(project.id, currentScreenId, {
        data: {
          uiFramework,
        },
      }),
    );
  }
});

export const updateCurrentUIFrameworkVariablesSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (
  action: ReturnType<typeof Actions.updateCurrentUIFrameworkVariables>,
) {
  const uiFramework = yield select(selectCurrentUIFramework);
  yield put(
    Actions.updateCurrentUIFramework({
      ...uiFramework,
      themeVariables: {
        ...uiFramework.themeVariables,
        ...action.payload,
      },
    }),
  );
});

export const resetCurrentUIFrameworkVariablesSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* () {
  const uiFramework = yield select(selectCurrentUIFramework);
  yield put(
    Actions.updateCurrentUIFramework({
      ...uiFramework,
      themeVariables: {},
    }),
  );
});

export function* getSharedProjectSaga(
  action: ReturnType<typeof Actions.getSharedProject>,
) {
  try {
    const { shortuuid_token } = action.payload;

    yield put(Actions.setProjectLoader(true));

    const { result, error }: Result = yield call(
      reqWrapper,
      apigetSharedProject,
      {
        shortuuid_token,
      },
    );
    if (result) {
      yield put(
        setTokenPair({ access: result.results[0].access_token, refresh: '' }),
      );
      const id = result?.results[0].owner;
      const userData: ServerUserData = yield call(reqWrapper, apiGetUser, {
        id,
      });
      yield put(
        setUserData({
          ...convertUserDataFromResponse(userData),
        }),
      );
      const updatedPermissions: UserProjectPermission[] = [];
      updatedPermissions.push(UserProjectPermission.VIEW_PROJECT);
      yield put(setStateCurrentUserPermissions(updatedPermissions));
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: {
              variant: 'error',
            },
          },
          e,
        ),
      );
    }
  } finally {
    yield put(Actions.setProjectLoader(false));
  }
}
