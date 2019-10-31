import { CSSProperties } from 'react';

import { TYPES } from '$constants/actions';
import {
  IListProject,
  IProject,
  IProjectScreen,
  IScreenProps,
  IScenarios,
  IScenarioElements,
  ILibraryElements,
  IProjectListItem,
} from '$redux/project/reducer';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';

export const getLibraryElements = () => ({
  type: TYPES.GET_LIBRARY_ELEMENTS,
});

export const setLibraryElements = (libraryElements: ILibraryElements) => ({
  type: TYPES.SET_LIBRARY_ELEMENTS,
  libraryElements,
});

export const getListProject = () => ({
  type: TYPES.GET_LIST_PROJECT,
});

export const setListProject = (listProject: IListProject[]) => ({
  type: TYPES.SET_LIST_PROJECT,
  listProject,
});

export const addProject = (name: string) => ({
  type: TYPES.ADD_PROJECT,
  name,
});

export const delProject = (id: number) => ({
  type: TYPES.DEL_PROJECT,
  id,
});

export const getProject = (id: number) => ({
  type: TYPES.GET_PROJECT,
  id,
});

export const setProject = (project: IProject) => ({
  type: TYPES.SET_PROJECT,
  project,
});

export const setProjectScreens = (projectScreens: IProjectListItem[]) => ({
  type: TYPES.SET_PROJECT_SCREENS,
  payload: { projectScreens },
});

export const renameProject = (projectId: number, newName: string) => ({
  type: TYPES.RENAME_PROJECT,
  payload: { projectId, newName },
});

export const setListProjectLoader = (active: boolean) => ({
  type: TYPES.SET_LIST_PROJECT_LOADER,
  active,
});

export const setProjectLoader = (active: boolean) => ({
  type: TYPES.SET_PROJECT_LOADER,
  active,
});

export const setScreenLoader = (active: boolean) => ({
  type: TYPES.SET_SCREEN_LOADER,
  active,
});

export const setLoader = (active: boolean) => ({
  type: TYPES.SET_LOADER,
  active,
});

export const setScenarioLoader = (active: boolean) => ({
  type: TYPES.SET_SCENARIO_LOADER,
  active,
});

export const delScreen = (projectId: number, screenId: number) => ({
  type: TYPES.DEL_SCREEN,
  payload: { projectId, screenId },
});

export const renameScreen = (projectId: number, screenId: number, newName: string) => ({
  type: TYPES.RENAME_SCREEN,
  payload: { projectId, screenId, newName },
});

export const addScreen = (projectId: number, name: string) => ({
  type: TYPES.ADD_SCREEN,
  payload: { projectId, name },
});

export const activateScreen = (projectId: number, screenId: number) => ({
  type: TYPES.ACTIVATE_SCREEN,
  payload: { projectId, screenId },
});

export const setListSortable = (
  itemIndex: number, items: string[], id: string, parentId: string
) => ({
  type: TYPES.SET_LIST_SORTABLE,
  payload: {
    itemIndex,
    items,
    id,
    parentId,
  },
});

export const saveScreen = (canvas: HTMLCanvasElement) => ({
  type: TYPES.SAVE_SCREEN,
  canvas,
});

export const setScreen = (screen: IProjectScreen) => ({
  type: TYPES.SET_SCREEN,
  screen,
});

export const addElement = (parentId: string, type: string) => ({
  type: TYPES.ADD_ELEMENT,
  payload: { parentId, type },
});

export const setScenarioElements = (elements: IScenarioElements) => ({
  type: TYPES.SET_ELEMENTS,
  elements,
});

export const updateElementStyles = (id: string, styles: CSSProperties) => ({
  type: TYPES.UPDATE_ELEMENT_STYLES,
  payload: { id, styles },
});

export const updateScenarioStyles = (id: string, styles: CSSProperties) => ({
  type: TYPES.UPDATE_SCENARIO_STYLES,
  payload: { id, styles },
});

export const updateRootStyles = (id: string, styles: CSSProperties) => ({
  type: TYPES.UPDATE_ROOT_STYLES,
  payload: { id, styles },
});

// export const updateStylesGroup = (itemId: string, styles: IScreenProps) => ({
//   type: TYPES.UPDATE_STYLES_GROUP,
//   payload: { itemId, styles },
// });

export const updateElementParameters = (itemId: string, parameters: IScreenProps) => ({
  type: TYPES.UPDATE_ELEMENT_PARAMETERS,
  payload: { itemId, parameters },
});

export const setAlign = (itemId: string, type: string) => ({
  type: TYPES.SET_ALIGN,
  payload: { itemId, type },
});

export const changeScenario = (itemId: string, scenarioId: number) => ({
  type: TYPES.CHANGE_SCENARIO,
  payload: { itemId, scenarioId },
});

export const changeElementType = (itemId: string, type: string) => ({
  type: TYPES.CHANGE_ELEMENT_TYPE,
  payload: { type, itemId },
});

export const delScenarioItem = (id: string) => ({
  type: TYPES.DEL_SCENARIO_ITEM,
  id,
});

export const changeScenarios = (screenId: number) => ({
  type: TYPES.CHANGE_SCENARIOS,
  screenId,
});

export const createScenario = (name: string, type: string, elements?: number[]) => ({
  type: TYPES.CREATE_SCENARIO,
  payload: { name, type, elements },
});

export const addScenario = (
  scenarioId: number,
  name: string,
  listElementType: IChooseElement[],
) => ({
  type: TYPES.ADD_SCENARIO,
  payload: {
    scenarioId,
    name,
    listElementType,
  },
});

export const delScenario = (id: string) => ({
  type: TYPES.DEL_SCENARIO,
  id,
});

export const renameScenario = (scenarioId: number, newName: string) => ({
  type: TYPES.RENAME_SCENARIO,
  scenarioId,
  newName,
});

export const setScenarios = (scenarios: IScenarios) => ({
  type: TYPES.SET_SCENARIO,
  scenarios,
});

export const setModifyElements = (elements: number[]) => ({
  type: TYPES.SET_MODIFY_ELEMENTS,
  elements,
});

export const uploadFile = (payload: { file: any }) => ({
  type: TYPES.UPLOAD_FILE,
  payload,
});

export const uploadImageForNNSuccess = (payload: { imageURL: string, screenID: number }) => ({
  type: TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS,
  payload,
})

export const getScreenNN = () => ({ type: TYPES.GET_SCREEN_NN });

export const addContainer = (itemId: string) => ({
  type: TYPES.ADD_CONTAINER,
  itemId,
});

// export const setScreenData: ISetScreenData = screen_data => ({
//   type: TYPES.SET_SCREEN_DATA,
//   screen_data,
// });
