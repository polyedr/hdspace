/* eslint-disable no-console */

import { all, call, fork, put, select } from 'redux-saga/effects';
import * as R from 'ramda';
import { push } from 'connected-react-router';
import html2canvas from 'html2canvas';
import { convertElementFromResponse } from '@Api/converters/fromResponse';
import { convertCreatedElementToRequest } from '@Api/converters/toRequest';
import {
  apiChangeRecursiveElement,
  apiCreateElement,
  apiCreateElements,
  apiGetElements,
} from '@Api/element';
import DOMPurify from 'dompurify';
import { apiUpdateProject } from '@Api/project';
import { apiUpdateScenarios } from '@Api/scenario';
import { apiCreateScreen, apiGetScreen, apiUpdateScreen } from '@Api/screen';
import {
  LibraryElement,
  NNBlockType,
  Normalized,
  Project,
  Result,
  ScenarioItem,
  Screen,
  ServerElement,
  StateElement,
} from '@Src/types';
import generateUniqueName from '@Utils/generateUniqueName';
import convertHtml from '@Utils/convertHtml';
import CSSOM from 'cssom';
import { extractStyles } from '@Utils/stringHelper';
import IMAGES from '@Constants/images';
import * as Actions from '../actions';
import {
  activateScreen,
  addElements,
  createScreen,
  changeFreeCanvasMode,
  deleteElement,
  deleteScreen,
  renameScreen,
  restoreScreen,
  setCurrentScreenId,
  setProject,
  setScreenLoader,
  setScreens,
  setUndoActions,
  setUpdateImageLoader,
  updateScreen,
  updateScreenImage,
  uploadFile,
  importHtml,
  updateElementImage,
  updateElementParameters,
  setActiveElementId,
} from '../actions';
import { createScenarios } from './scenario';
import { reqWrapper } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import { uploadFileSaga } from './element';
import {
  selectCurrentScreenId,
  selectScreenById,
  selectScreens,
} from '../selectors/screen';
import {
  selectAllElements,
  selectCurrentRootId,
  selectElementById,
  selectElementsForScreen,
  selectScreenRootElement,
} from '../selectors/element';
import { selectCurrentProject } from '../selectors/base';

export function* activateScreenSaga({
  payload: { screenId },
}: ReturnType<typeof activateScreen>) {
  try {
    const currentScreenId = yield select(selectCurrentScreenId);
    if (currentScreenId === screenId) return;

    yield put(setScreenLoader(true));
    yield put(setActiveElementId('none'));

    const screen: Screen = yield select(selectScreenById(screenId));

    yield put(setCurrentScreenId(screen.id));

    const screenElement = yield select(selectScreenRootElement(screenId));
    if (!screenElement) return;

    yield put(Actions.setActiveElementId(screenElement.id));
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
    yield put(Actions.setScreenCreateLoader(true));

    yield put(Actions.clearAfterPrevScreen());
    const { projectID, name, buoyancy, skip } = payload;

    const screens: Screen[] = yield select(selectScreens);
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

        const currentProject: ReturnType<
          typeof selectCurrentProject
        > = yield select(selectCurrentProject);

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

          yield put(Actions.setActiveElementId(elements[0].id));

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
  } finally {
    yield put(Actions.setScreenCreateLoader(false));
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

export function* updateScreenImageSaga({
  payload: { screenId },
}: ReturnType<typeof updateScreenImage>) {
  try {
    yield put(setUpdateImageLoader(true));

    const screenBody = document.getElementById('root');
    const widgets = Array.from(document.querySelectorAll('iframe'));

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
    yield put(setUpdateImageLoader(false));
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

    const currentScreenId = yield select(selectCurrentScreenId);

    if (currentScreenId === screenId) {
      yield put(setActiveElementId('none'));
      yield put(setCurrentScreenId(-1));
    }

    const currentProject: ReturnType<
      typeof selectCurrentProject
    > = yield select(selectCurrentProject);
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

      const screens: ReturnType<typeof selectScreens> = yield select(
        selectScreens,
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
      if (!meta.undo) {
        yield put(setUndoActions(deleteScreen(projectId, screenId)));
      }

      const screens = yield select(selectScreens);
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
  } finally {
    yield put(Actions.setScreenCreateLoader(false));
  }
}

export function* renameScreenSaga({
  payload,
}: ReturnType<typeof renameScreen>) {
  try {
    const { screenID, name } = payload;

    const screens: ReturnType<typeof selectScreens> = yield select(
      selectScreens,
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

export function* convertFreeCanvasSaga() {
  try {
    const root = document.getElementById('free-canvas-root');
    if (!root) throw new Error('Failed to find the root element');

    const rootId: string = yield select(selectCurrentRootId);
    yield put(setActiveElementId(rootId));

    const canvas: HTMLCanvasElement = yield call(html2canvas, root, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      ignoreElements: (element: Element) =>
        (element as HTMLElement).dataset.role === 'borders',
    });

    const screenId: number = yield select(selectCurrentScreenId);

    const rootElement: StateElement = yield select(selectElementById(rootId));

    yield all(
      rootElement.children.map((id) => put(deleteElement(id, { screenId }))),
    );

    const blob = yield call(canvasToBlob, canvas);

    yield call(
      uploadFileSaga,
      uploadFile(
        { file: new File([blob], 'test.png'), name: 'test.png' },
        rootId,
        NNBlockType.WEBPAGE,
        {
          screenId,
        },
      ),
    );
    yield put(changeFreeCanvasMode(false));
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* importHtmlSaga(action: ReturnType<typeof importHtml>) {
  try {
    const files = action.payload;

    const htmlFiles = files.filter((file) => file.type === 'text/html');
    if (htmlFiles.length !== 1) {
      throw new Error(
        htmlFiles.length
          ? 'Only one HTML file allowed'
          : 'At least one HTML file required',
      );
    }
    const html: string = yield htmlFiles[0].text();
    const clearHtml = DOMPurify.sanitize(html);

    const cssFiles = files.filter((file) => file.type === 'text/css');

    const externalStyles: string = yield Promise.all(
      cssFiles.map((file) => file.text()),
    ).then((result) => result.reduce((acc, curr) => acc + curr, ''));
    const htmlStyles = extractStyles(clearHtml);
    const css = externalStyles + htmlStyles;

    const doc = new DOMParser().parseFromString(clearHtml, 'text/html');

    const { cssRules } = CSSOM.parse(css); // the actual type of cssRules is CSSStyleRule[] while the declared one is CSSOM.CSSRule[]
    // @ts-ignore
    const data = convertHtml(doc, cssRules);

    const { result: element, error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiCreateElement,
      {
        data,
      },
    );
    if (element) {
      const { id: projectId, projectscreen }: Project = yield select(
        selectCurrentProject,
      );

      const screen: Screen = yield call(
        createScreenSaga,
        createScreen(projectId, 'Screen 1', projectscreen.length),
      );

      const root: StateElement = yield select(
        selectElementById(screen.element),
      );

      yield put(
        Actions.addStateElements([element], root.id, { screenId: screen.id }),
      );

      const elements: StateElement[] = yield select(
        selectElementsForScreen(screen.id),
      );
      const imageElements = Object.values(elements).filter(
        (element) => element.type === 'image',
      );

      const imageFiles = files.filter((file) => file.type.includes('image/'));

      yield all(
        imageElements.map((element) => {
          const image = imageFiles.find((img) =>
            element.parameters.imageURL.includes(img.name),
          );
          return image
            ? put(
                updateElementImage(element.id, image, { screenId: screen.id }),
              )
            : put(
                updateElementParameters(
                  element.id,
                  {
                    imageURL: IMAGES.imageIcon,
                  },
                  {
                    screenId: screen.id,
                  },
                ),
              );
        }),
      );

      const { error } = yield call(reqWrapper, apiChangeRecursiveElement, {
        data: { children: [element.id] },
        id: root.id,
      });
      if (error) throw new Error(error);
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
