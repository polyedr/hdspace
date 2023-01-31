// @ts-nocheck
import { all, call, fork, put, select } from 'redux-saga/effects';
import { omit, head, assoc, prepend } from 'ramda';
import { push } from 'connected-react-router';
import html2canvas from 'html2canvas';
import { convertElementFromResponse } from '@Api/converters/fromResponse';
import {
  convertCreatedElementToRequest,
  convertScreenToPatchRequest,
} from '@Api/converters/toRequest';
import { apiCreateElements, apiGetElements } from '@Api/element';
import { apiUpdateProject } from '@Api/project';
import { apiUpdateScenarios } from '@Api/scenario';
import {
  apiCreateScreen,
  apiGetScreen,
  apiPostFreeCanvas,
  apiUpdateScreen,
} from '@Api/screen';
import logger from 'loglevel';
import {
  EditableScreenUser,
  LibraryElement,
  Normalized,
  Project,
  Result,
  ScenarioItem,
  Screen,
  ServerElement,
  StateElement,
  UserProjectPermission,
} from '@Src/types';
import generateUniqueName from '@Utils/generateUniqueName';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { compose } from 'redux';
import * as Actions from '../actions';
import {
  activateScreen,
  addElements,
  createScreen,
  deleteScreen,
  editScreenNameAndData,
  restoreScreen,
  setCurrentScreenId,
  setProject,
  setScreenLoader,
  setScreens,
  setUpdateImageLoader,
  updateScreen,
  updateScreenImage,
  setActiveElementId,
} from '../actions';
import { createScenarios } from './scenario';
import { reqWrapper } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import {
  selectCurrentScreen,
  selectCurrentScreenId,
  selectInfoUser,
  selectMasterScreen,
  selectScreenById,
  selectScreensWithoutMaster,
  selectSortedScreens,
} from '../selectors/screen';
import {
  selectAllElements,
  selectCurrentRootElement,
  selectCurrentRootId,
  selectPreSelectedElementId,
  selectScreenRootElement,
} from '../selectors/element';
import { selectCurrentProject, selectEditorDocument } from '../selectors/base';
import withActionsHistory from '../wrappers/withActionsHistory';

export const activateScreenSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
)(function* ({ payload: { screenId } }: ReturnType<typeof activateScreen>) {
  try {
    const currentScreenId = yield select(selectCurrentScreenId);
    if (currentScreenId === screenId) return;

    yield put(setScreenLoader(true));
    yield put(setActiveElementId('none'));

    const screen: Screen = yield select(selectScreenById, screenId);

    yield put(setCurrentScreenId(screen.id));

    const preSelectedElementId = yield select(selectPreSelectedElementId);

    const screenElement = yield select(selectScreenRootElement(screenId));

    const elementToSelect = preSelectedElementId || screenElement?.id;

    if (elementToSelect) {
      yield put(Actions.setActiveElement(elementToSelect));
    }
  } catch (e) {
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
  } finally {
    yield put(setScreenLoader(false));
  }
});

// eslint-disable-next-line consistent-return
export const createScreenSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
  // eslint-disable-next-line consistent-return
)(function* (action: ReturnType<typeof createScreen>) {
  const { payload } = action;
  const useHistory = action.meta?.useHistory;
  try {
    yield put(Actions.setScreenCreateLoader(true));

    yield put(Actions.clearAfterPrevScreen());
    const { projectID, name, buoyancy, freeCanvas, styles } = payload;
    const screens: Screen[] = yield select(selectSortedScreens);
    const numberedName = generateUniqueName(
      name,
      screens.map((screen) => screen.name),
    );
    const { result: createdScreen, error: createScreenError }: Result<Screen> =
      yield call(reqWrapper, apiCreateScreen, {
        data: {
          project: projectID,
          name: numberedName,
          status: 'in_progress',
          buoyancy,
          image: null,
          screen_data_json: JSON.stringify({
            viewport:
              'width=device-width, initial-scale=1.0, minimum-scale=1.0', // default viewport value
            freeCanvas,
          }),
          styles_root: {},
        },
      });
    if (createdScreen) {
      if (!useHistory) {
        yield put(
          Actions.addUndoActions(
            deleteScreen(projectID, createdScreen.id, { ...action.meta }),
          ),
        );
      }

      const rootScenario: ScenarioItem = yield call(createScenarios, {
        screen: createdScreen.id,
      });

      if (!rootScenario) {
        throw new Error('Failed to create scenario');
      }

      const newScreen = omit(['screen_data_text'], createdScreen);

      const rootElement = convertCreatedElementToRequest(
        'root',
        String(rootScenario.id),
        payload.rootName || 'Root',
      );

      if (styles !== undefined) {
        rootElement.styles = styles;
      }
      const {
        result: elements,
        error: elementsError,
      }: Result<Array<LibraryElement<'root'>>> = yield call(
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

        const currentProject: ReturnType<typeof selectCurrentProject> =
          yield select(selectCurrentProject);

        const updateProject: Project = assoc(
          'projectscreen',
          prepend(newScreen.id, currentProject.projectscreen),
          currentProject,
        );

        const { result: savedScreen, error: savedScreenError }: Result<Screen> =
          yield call(reqWrapper, apiUpdateScreen, {
            id: newScreen.id,
            data: omit(
              ['screenLoader', 'image', 'screen_data_json', 'buoyancy'],
              newScreen,
            ),
          });

        if (savedScreen) {
          const updatedScreen = {
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
              useHistory,
            }),
          );
          if (!useHistory) {
            yield put(
              Actions.addRedoActions([
                restoreScreen(newScreen.id, projectID, {
                  ...action.meta,
                  useHistory: true,
                }),
              ]),
            );
          }

          yield put(Actions.setActiveElement(elements[0].id));

          yield put(push(`/project/${projectID}/${newScreen.id}`));

          if (!useHistory) {
            yield put(
              enqueueSnackbar({
                message: `Screen ${updatedScreen.name} created`,
                options: { variant: 'success' },
              }),
            );
          }

          yield put(Actions.setNewScreenModal(!freeCanvas));

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
      enqueueSnackbar(
        {
          message: e.message || 'Failed to create screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  } finally {
    yield put(Actions.setScreenCreateLoader(false));
  }
});

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataBlob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (blob) => (blob !== null ? resolve(blob) : undefined),
      'image/webp',
      0.1,
    ),
  );
  return dataBlob;
}

export const updateScreenImageSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({ payload: { screenId } }: ReturnType<typeof updateScreenImage>) {
  try {
    yield put(setUpdateImageLoader(true));

    const editorDocument = yield select(selectEditorDocument);
    const rootId = yield select(selectCurrentRootId);

    const screenBody = editorDocument.getElementById(rootId);
    const widgets = Array.from(editorDocument.querySelectorAll('iframe'));

    if (screenBody === null) {
      throw new Error('Failed updating screen image');
    }
    const ignore = (element: Element) =>
      widgets.some((widget) => element === widget);

    const canvas: HTMLCanvasElement = yield html2canvas(screenBody, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      ignoreElements: ignore,
    });

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
      result.element = rootId;
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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  } finally {
    yield put(setUpdateImageLoader(false));
  }
});

export const deleteScreenSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* ({
  payload: { projectId, screenId },
  meta,
  type,
}: ReturnType<typeof deleteScreen>) {
  try {
    if (!meta) {
      logger.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    const { useHistory } = meta;

    const currentScreenId = yield select(selectCurrentScreenId);

    if (currentScreenId === screenId) {
      yield put(setActiveElementId('none'));
      yield put(setCurrentScreenId(-1));
    }

    const currentProject: ReturnType<typeof selectCurrentProject> =
      yield select(selectCurrentProject);
    const screenList = currentProject.projectscreen;

    if (screenList.length <= 2) {
      throw new Error('Project must have at least 2 screens');
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
      if (!useHistory) {
        yield put(
          Actions.addUndoActions(
            restoreScreen(screenId, projectId, {
              ...meta,
              useHistory: true,
            }),
          ),
        );
      }

      yield put(setProject(result));

      const lastScreenID = head(result.projectscreen);

      if (!lastScreenID) {
        yield put(setCurrentScreenId(-1));
        yield put(push(`/project/${projectId}`));
        return;
      }

      const screens: ReturnType<typeof selectSortedScreens> = yield select(
        selectSortedScreens,
      );

      const newScreens = screens.filter((screen) => screen.id !== screenId);
      if (lastScreenID !== currentScreenId) {
        yield put(push(`/project/${projectId}/${lastScreenID}`));
      }

      yield put(setScreens(newScreens));

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
      enqueueSnackbar(
        {
          message: e.message || 'Failed to delete screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const restoreScreenSaga = withActionsHistory(function* ({
  type,
  payload: { projectId, screenId },
  meta,
}: ReturnType<typeof restoreScreen>) {
  try {
    if (!meta) {
      logger.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    yield put(Actions.setScreenCreateLoader(true));

    yield put(Actions.clearAfterPrevScreen());

    const { projectscreen }: Project = yield select(selectCurrentProject);

    const { result, error } = yield call(reqWrapper, apiUpdateProject, {
      data: {
        id: projectId,
        projectscreen: [...projectscreen, screenId],
      },
    });

    if (result) {
      if (!meta.useHistory) {
        yield put(
          Actions.addUndoActions(
            deleteScreen(projectId, screenId, { ...meta }),
          ),
        );
      }

      const screens = yield select(selectSortedScreens);
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
      enqueueSnackbar(
        {
          message: e.message || 'Failed to restore screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  } finally {
    yield put(Actions.setScreenCreateLoader(false));
  }
});

export const editScreenNameAndDataSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({ payload }: ReturnType<typeof editScreenNameAndData>) {
  try {
    const { screenID, editData } = payload;
    const { name, data } = editData;
    const oldScreen = yield select(selectScreenById, screenID);
    if (!oldScreen) {
      throw new Error('Screen not found');
    }

    const screens: ReturnType<typeof selectSortedScreens> = yield select(
      selectSortedScreens,
    );

    let allowUniqueName = true;
    screens.forEach((screen) => {
      if (name === screen.name && screenID !== screen.id) {
        allowUniqueName = true;
        throw new Error(`Screen '${name}' already exists.`);
      }
      if (name === screen.name && screenID === screen.id) {
        allowUniqueName = false;
      }
    });

    const metaData = data?.meta ?? oldScreen.screenData.meta;

    const newMetaData = metaData || {};
    const newScreen: Screen = {
      ...oldScreen,
      name:
        name && allowUniqueName
          ? generateUniqueName(
              name.trim(),
              screens.map((screen) => screen.name),
            )
          : oldScreen.name,
      screenData: {
        freeCanvas: oldScreen.screenData.freeCanvas,
        editableScreenUser: [...oldScreen.screenData.editableScreenUser],
        meta: {
          ...newMetaData,
          faviconUrl:
            data?.meta?.faviconUrl === undefined
              ? null
              : data?.meta?.faviconUrl
              ? data?.meta?.faviconUrl
              : oldScreen?.screenData?.meta?.faviconUrl,
        },
        uiFramework: data?.uiFramework || oldScreen.screenData.uiFramework,
        wireframePosition:
          data.wireframePosition ?? oldScreen.screenData?.wireframePosition,
      },
    };
    yield put(Actions.updateScreen(newScreen));
    const convertedScreen = convertScreenToPatchRequest(newScreen);

    const { error }: Result<Screen> = yield call(reqWrapper, apiUpdateScreen, {
      id: screenID,
      data: convertedScreen,
    });

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to update screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const setEditableScreenSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({
  payload: idScreen,
}: ReturnType<typeof Actions.setEditableScreen>) {
  try {
    const oldScreen = yield select(selectScreenById, idScreen);
    if (!oldScreen) {
      throw new Error('Screen not found');
    }
    const infoUser = yield select(selectInfoUser);
    const newScreen: Screen = {
      ...oldScreen,
      screenData: {
        ...oldScreen.screenData,
        editableScreenUser: [
          ...oldScreen.screenData.editableScreenUser.filter(
            (item: EditableScreenUser) => infoUser.idUser !== item.idUser,
          ),
          infoUser,
        ],
      },
    };
    yield put(Actions.updateScreen(newScreen));

    const convertedScreen = convertScreenToPatchRequest(newScreen);
    const { error }: Result<Screen> = yield call(reqWrapper, apiUpdateScreen, {
      id: idScreen,
      data: convertedScreen,
    });

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to update screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const clearEditableScreenSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({
  payload: screen,
}: ReturnType<typeof Actions.clearEditableScreen>) {
  try {
    const { idUser } = yield select(selectInfoUser);

    const newScreen: Screen = {
      ...screen,
      screenData: {
        ...screen.screenData,
        editableScreenUser: screen.screenData.editableScreenUser.filter(
          (item) => idUser !== item.idUser,
        ),
      },
    };
    yield put(Actions.updateScreen(newScreen));

    const convertedScreen = convertScreenToPatchRequest(newScreen);

    const { error }: Result<Screen> = yield call(reqWrapper, apiUpdateScreen, {
      id: screen.id,
      data: convertedScreen,
    });

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to update screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export function* getScreensSaga(screens: Screen[]) {
  try {
    const { result: elements, error }: Result<Array<ServerElement<'root'>>> =
      yield call(reqWrapper, apiGetElements, {
        scenariosIDs: [screens.map((screen) => screen.screenscenario)],
      });
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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* changeScreensOrder(
  action: ReturnType<typeof Actions.changeScreensOrder>,
) {
  try {
    const { newIndex, oldIndex } = action.payload;
    const screens: Screen[] = yield select(selectScreensWithoutMaster);
    const masterScreen = yield select(selectMasterScreen);

    const copy = [...screens];

    const [target] = copy.splice(oldIndex, 1);
    copy.splice(newIndex, 0, target);
    const newScreenList = copy.map((screen, i) => ({
      ...screen,
      buoyancy: i + 1, // MasterScreen should always have buoyancy 0
    }));

    yield put(setScreens([masterScreen, ...newScreenList]));

    const results: Array<Result<Screen>> = yield all(
      newScreenList.map(({ id, buoyancy }) =>
        call(reqWrapper, apiUpdateScreen, {
          id,
          data: {
            buoyancy,
          },
        }),
      ),
    );

    yield all(
      results
        .filter((res) => res.error)
        .map((res) =>
          put(
            enqueueSnackbar({
              message: res.error || 'Failed to reorder screens',
              options: { variant: 'error' },
            }),
          ),
        ),
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to reorder screens',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export const changeScreensOrderSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(changeScreensOrder);

export const convertFreeCanvasSaga = compose(
  withRequiredPermissions(UserProjectPermission.VIEW_PROJECT),
  withActionsHistory,
)(function* () {
  try {
    const rootElement: LibraryElement<'root'> = yield select(
      selectCurrentRootElement,
    );

    const convert = (elem: LibraryElement<any>) => ({
      ...elem,
      id: undefined,
      parent_id: parseInt(elem.id),
      children: elem.children.map((child) => convert(child)),
    });

    const convertedTree = convert(rootElement);

    const { result, error }: Result<ServerElement<any>> = yield call(
      reqWrapper,
      apiPostFreeCanvas,
      {
        tree: convertedTree,
      },
    );

    if (error) {
      throw new Error(error);
    }
    if (!result) {
      throw new Error('Something went wrong');
    }

    const screen: Screen = yield select(selectCurrentScreen);

    yield all(
      rootElement.children.map((child) =>
        put(Actions.removeStateElement(child.id, { screenId: screen.id })),
      ),
    );

    yield put(
      Actions.addStateElements(
        [
          {
            elements: [convertElementFromResponse(result)],
            parentId: rootElement.id,
          },
        ],
        { screenId: screen.id },
      ),
    );

    const updatedScreen: Screen = {
      ...screen,
      screenData: {
        ...screen.screenData,
        freeCanvas: false,
      },
    };

    yield put(updateScreen(updatedScreen));

    const convertedScreen = convertScreenToPatchRequest(updatedScreen);

    const { error: screenError } = yield call(reqWrapper, apiUpdateScreen, {
      id: screen.id,
      data: convertedScreen,
    });

    if (screenError) throw new Error(screenError);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});
