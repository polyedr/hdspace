/* eslint-disable no-console */
import { call, select, put, all, fork } from 'redux-saga/effects';
import * as R from 'ramda';
import { push } from 'connected-react-router';
import * as Actions from '../actions';
import { selectors } from '..';
import { createScenarios } from './scenario';
import {
  selectAllElements,
  selectCurrentProject,
  selectCurrentProjectId,
  selectCurrentScreenId,
  selectScreenById,
  selectScreenRootElement,
} from '../selectors';
import {
  apiCreateScreen,
  apiGetScreen,
  apiUpdateScreen,
} from '../../../api/screen';
import { convertCreatedElementToRequest } from '../../../api/converters/toRequest';
import { apiUpdateProject } from '../../../api/project';
import {
  activateScreen,
  addElements,
  createScreen,
  deleteScreen,
  renameScreen,
  restoreScreen,
  saveScreenImage,
  setActiveElement,
  setCurrentScreenId,
  setLoader,
  setProject,
  updateScreen,
  setScreenLoader,
  setScreens,
  setUndoActions,
} from '../actions';
import { apiCreateElements, apiGetElements } from '../../../api/element';
import generateUniqueName from '../../../utils/generateUniqueName';
import { apiUpdateScenarios } from '../../../api/scenario';
import { convertElementFromResponse } from '../../../api/converters/fromResponse';
import {
  LibraryElement,
  Normalized,
  Project,
  ServerElement,
  StateElement,
  Screen,
  ScenarioItem,
  Result,
} from '../../../types';
import { reqWrapper } from './shared';
import { AppReduxState } from '../../types';
import { enqueueSnackbar } from '../../notification/actions';

export function* activateScreenSaga({
  payload: { screenId },
}: ReturnType<typeof activateScreen>) {
  try {
    const currentScreenId = yield select(selectCurrentScreenId);
    if (currentScreenId === screenId) return;

    yield put(setScreenLoader(true));
    yield put(setActiveElement('none'));

    const screen: Screen = yield select(selectScreenById(screenId));

    const pathname: string = yield select(
      (state: AppReduxState) => state.router.location.pathname,
    );

    if (screenId.toString() !== pathname.split('/').reverse()[0]) {
      const projectId = yield select(selectCurrentProjectId);
      yield put(push(`/project/${projectId}/${screenId}`));
    }

    yield put(setCurrentScreenId(screen.id));

    const screenElement = yield select(selectScreenRootElement(screenId));
    if (!screenElement) return;

    yield put(Actions.setActiveElement(screenElement.id));
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
    yield put(setScreenLoader(false));
  }
}

// eslint-disable-next-line consistent-return
export function* createScreenSaga({
  payload,
}: ReturnType<typeof createScreen>) {
  try {
    yield put(Actions.clearAfterPrevScreen());
    const { projectID, name, buoyancy, skip } = payload;

    const screens: Screen[] = yield select(selectors.selectScreens);
    const numberedName = generateUniqueName(
      name,
      screens.map((screen) => screen.name),
    );

    const {
      result: createdScreen,
      error: createScreenError,
    }: Result<Screen> = yield call(reqWrapper, apiCreateScreen, {
      data: {
        project: projectID,
        name: numberedName,
        status: 'in_progress',
        buoyancy,
        image: null,
        screen_data_json: {},
        styles_root: {},
      },
    });

    if (createdScreen) {
      if (!skip) {
        yield put(setUndoActions(deleteScreen(projectID, createdScreen.id)));
      }

      const rootScenario: ScenarioItem = yield call(createScenarios, {
        screen: createdScreen.id,
      });

      if (!rootScenario) {
        throw new Error('Failed to create scenario');
      }

      const newScreen = R.omit(['screen_data_text'], createdScreen);

      const rootElement = convertCreatedElementToRequest(
        'root',
        String(rootScenario.id),
        'Root',
      );

      const {
        result: elements,
        error: elementsError,
      }: Result<LibraryElement<'root'>[]> = yield call(
        reqWrapper,
        apiCreateElements,
        { data: [rootElement] },
      );

      if (elements) {
        yield put(addElements(elements));

        const rootScenarioWithRootElement = {
          ...rootScenario,
          elements: [elements[0].id],
        };

        yield fork(reqWrapper, apiUpdateScenarios, {
          data: [rootScenarioWithRootElement],
        });

        const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
          selectors.selectCurrentProject,
        );

        const updateProject: Project = R.assoc(
          'projectscreen',
          R.prepend(newScreen.id, currentProject.projectscreen),
          currentProject,
        );

        const {
          result: savedScreen,
          error: savedScreenError,
        }: Result<Screen> = yield call(reqWrapper, apiUpdateScreen, {
          id: newScreen.id,
          data: R.omit(
            ['screenLoader', 'image', 'screen_data_json', 'buoyancy'],
            newScreen,
          ),
        });

        if (savedScreen) {
          // Can not get why do we need to mix created screen with the current one. Let's keep these comments for some time
          // const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
          //   selectors.selectCurrentScreen,
          // );

          const updatedScreen = {
            // ...currentScreen,
            ...savedScreen,
            element: elements[0].id,
          };

          yield put(setProject(updateProject));

          yield put(setScreens([...screens, updatedScreen]));

          yield put(setCurrentScreenId(newScreen.id));

          const state: Normalized<StateElement> = yield select(
            selectAllElements,
          );

          yield put(
            Actions.updateElementsTree(state, {
              screenId: newScreen.id,
              undo: skip,
              sourceAction: restoreScreen(newScreen.id, projectID),
            }),
          );

          yield put(Actions.setActiveElement(elements[0].id));

          yield put(push(`/project/${projectID}/${newScreen.id}`));

          if (!skip) {
            yield put(
              enqueueSnackbar({
                message: `Screen ${updatedScreen.name} created`,
                options: { variant: 'success' },
              }),
            );
          }

          return updatedScreen;
        }
        if (savedScreenError) {
          throw new Error(elementsError);
        }
      }

      if (elementsError) {
        throw new Error(elementsError);
      }
    }

    if (createScreenError) {
      throw new Error(createScreenError);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to create screen',
        options: { variant: 'error' },
      }),
    );
  }
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
}: ReturnType<typeof saveScreenImage>) {
  try {
    yield put(setLoader(true));

    const blobFile = yield call(canvasToBlob, canvas);
    const formData = new FormData();

    formData.append('image', blobFile, `${screenId}.png`);

    const { result, error }: Result<Screen> = yield call(
      reqWrapper,
      apiUpdateScreen,
      {
        id: screenId,
        data: formData,
      },
    );

    if (result) {
      yield put(updateScreen(result));
      yield put(
        enqueueSnackbar({
          message: 'Screen image updated',
          options: {
            variant: 'success',
          },
        }),
      );
    }

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  } finally {
    yield put(setLoader(false));
  }
}

export function* deleteScreenSaga({
  payload: { projectId, screenId },
  meta,
  type,
}: ReturnType<typeof deleteScreen>) {
  try {
    if (!meta) {
      console.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    const { undo } = meta;

    const currentScreenId = yield select(selectors.selectCurrentScreenId);

    if (currentScreenId === screenId) {
      yield put(setActiveElement('none'));
      yield put(setCurrentScreenId(-1));
    }

    const currentProject: ReturnType<typeof selectors.selectCurrentProject> = yield select(
      selectors.selectCurrentProject,
    );
    const screenList = currentProject.projectscreen;

    if (screenList.length <= 1) {
      throw new Error('Project must have at least 1 screen');
    }

    const newScreenIdList = currentProject.projectscreen.filter(
      (id) => id !== screenId,
    );

    const { result, error }: Result<Project> = yield call(
      reqWrapper,
      apiUpdateProject,
      {
        data: {
          projectscreen: newScreenIdList,
          id: projectId,
        },
      },
    );
    if (result) {
      if (!undo) {
        yield put(setUndoActions(restoreScreen(screenId, projectId)));
      }

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
      yield put(
        enqueueSnackbar({
          message: 'Screen deleted',
          options: { variant: 'success' },
        }),
      );
    }
    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to delete screen',
        options: { variant: 'error' },
      }),
    );
  }
}

export function* restoreScreenSaga({
  type,
  payload: { projectId, screenId },
  meta,
}: ReturnType<typeof restoreScreen>) {
  try {
    if (!meta) {
      console.error(`You have to provide metainformation for action ${type}`);
      return;
    }

    yield put(Actions.clearAfterPrevScreen());

    // const project = yield call(reqWrapper, apiGetProject, { id: projectId });
    // if (!project) console.error(`Error while fetching project ${projectId}`);

    const { projectscreen }: Project = yield select(selectCurrentProject);

    const { result, error } = yield call(reqWrapper, apiUpdateProject, {
      data: {
        id: projectId,
        projectscreen: [...projectscreen, screenId],
      },
    });

    if (result) {
      if (!meta.undo) {
        yield put(setUndoActions(deleteScreen(projectId, screenId)));
      }

      const screens = yield select(selectors.selectScreens);
      const screen: Screen = yield call(reqWrapper, apiGetScreen, {
        id: screenId,
      });
      const { result: elements, error: elementsError } = yield call(
        reqWrapper,
        apiGetElements,
        {
          scenariosIDs: [screen.screenscenario[0]],
        },
      );

      if (elements) {
        screen.element = elements[0].id;
        yield put(setScreens([screen, ...screens]));

        yield put(setProject(result));

        yield put(
          enqueueSnackbar({
            message: `Screen ${screen.name} restored`,
            options: { variant: 'success' },
          }),
        );
      }
      if (elementsError) throw new Error(elementsError);
    }

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to restore screen',
        options: { variant: 'error' },
      }),
    );
  }
}

export function* renameScreenSaga({
  payload,
}: ReturnType<typeof renameScreen>) {
  try {
    const { screenID, name } = payload;

    const screens: ReturnType<typeof selectors.selectScreens> = yield select(
      selectors.selectScreens,
    );

    const numberedName = generateUniqueName(
      name,
      screens.map((screen) => screen.name),
    );

    const renamedScreen: Partial<Screen> = {
      name: numberedName,
    };

    const { result, error }: Result<Screen> = yield call(
      reqWrapper,
      apiUpdateScreen,
      {
        id: screenID,
        data: renamedScreen,
      },
    );

    if (result) {
      const newScreens = screens.map((screen) => {
        return screen.id === screenID
          ? { ...screen, name: numberedName }
          : screen;
      });

      yield put(setScreens(newScreens));
    }
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to rename screen',
        options: { variant: 'error' },
      }),
    );
  }
}

export function* getScreensSaga(screens: Screen[]) {
  try {
    const {
      result: elements,
      error,
    }: Result<ServerElement<'root'>[]> = yield call(
      reqWrapper,
      apiGetElements,
      {
        scenariosIDs: [screens.map((screen) => screen.screenscenario)],
      },
    );

    if (elements) {
      yield put(
        setScreens(
          screens.map((screen) => {
            const elementId = String(
              elements.find((el) => el.scenario === screen.screenscenario[0])
                ?.id,
            );

            return {
              ...screen,
              element: elementId,
            };
          }),
        ),
      );

      yield put(
        addElements(elements.map((el) => convertElementFromResponse(el))),
      );
    }
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* changeScreensOrderSaga(
  action: ReturnType<typeof Actions.changeScreensOrder>,
) {
  try {
    const { screens } = action.payload;

    yield put(setScreens(screens));

    const results: Result<Screen>[] = yield all(
      screens.map(({ id, buoyancy }) =>
        call(reqWrapper, apiUpdateScreen, {
          id,
          data: {
            buoyancy,
          },
        }),
      ),
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const res of results) {
      if (res.error) {
        yield put(
          enqueueSnackbar({
            message: res.error,
            options: { variant: 'error' },
          }),
        );
      }
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to reorder screens',
        options: { variant: 'error' },
      }),
    );
  }
}
