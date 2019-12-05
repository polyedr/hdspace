import { CSSProperties } from 'react';

import { TYPES } from '$constants/actions';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';

import * as T from './types';

export const getLibraryElements = (): T.LoadLibraryElements => ({
  type: 'PROJECTS:LOAD_LIBRARY_ELEMENTS',
});

export const setLibraryElements = (libraryElements: T.ILibraryElements): T.LoadLibraryElementsSuccess => ({
  type: 'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS',
  payload: { libraryElements },
});

export const getListProject = (): T.LoadProjects => ({
  type: 'PROJECTS:LOAD_PROJECTS',
});

export const setListProject = (projects: T.IListProject[]): T.LoadProjectsSuccess => ({
  type: 'PROJECTS:LOAD_PROJECTS_SUCCESS',
  payload: { projects },
});

export const addProject = (name: string): T.AddProject => ({
  type: 'PROJECTS:ADD_PROJECT',
  payload: { name },
});

export const delProject = (id: number): T.DeleteProject => ({
  type: 'PROJECTS:DELETE_PROJECT',
  payload: { id },
});

export const getProject = (id: number, screenID?: string): T.GetProject => ({
  type: 'PROJECTS:GET_PROJECT',
  payload: { id, screenID },
});

export const setProject = (project: T.IProject): T.SetProject => ({
  type: 'PROJECTS:SET_PROJECT',
  payload: { project },
});

export const setProjectScreens = (screens: T.IProjectListItem[]): T.SetProjectScreens => ({
  type: 'PROJECTS:SET_PROJECT_SCREENS',
  payload: { screens },
});

export const renameProject = (projectID: number, name: string): T.RenameProject => ({
  type: 'PROJECTS:RENAME_PROJECT',
  payload: { projectID, name },
});

export const setListProjectLoader = (active: boolean): T.SetListProjectLoader => ({
  type: 'PROJECTS:SET_LIST_PROJECT_LOADER',
  payload: { active },
});

export const setProjectLoader = (active: boolean): T.SetProjectLoader => ({
  type: 'PROJECTS:SET_PROJECT_LOADER',
  payload: { active },
});

export const setScreenLoader = (active: boolean): T.SetScreenLoader => ({
  type: 'PROJECTS:SET_SCREEN_LOADER',
  payload: { active },
});

export const setLoader = (active: boolean): T.SetLoader => ({
  type: 'PROJECTS:SET_LOADER',
  payload: { active },
});

export const setScenarioLoader = (active: boolean): T.SetScenarioLoader => ({
  type: 'PROJECTS:SET_SCENARIO_LOADER',
  payload: { active },
});

export const delScreen = (projectID: number, screenID: number): T.DeleteScreen => ({
  type: 'PROJECTS:DELETE_SCREEN',
  payload: { projectID, screenID },
});

export const renameScreen = (projectID: number, screenID: number, name: string): T.RenameScreen => ({
  type: 'PROJECTS:RENAME_SCREEN',
  payload: { projectID, screenID, name },
});

export const addScreen = (projectID: number, name: string): T.AddScreen => ({
  type: 'PROJECTS:ADD_SCREEN',
  payload: { projectID, name },
});

// projectID is unused
export const activateScreen = (projectID: number, screenID: number): T.ActivateScreen => ({
  type: 'PROJECTS:ACTIVATE_SCREEN',
  payload: { projectID, screenID: screenID },
});

export const setListSortable = (
  itemIndex: number, items: string[], id: string, parentID: string
): T.SetListSortable => ({
  type: 'PROJECTS:SET_LIST_SORTABLE',
  payload: {
    itemIndex,
    items,
    id,
    parentID,
  },
});

export const clearAfterPrevScreen = (): T.ClearAfterPrevScreen => ({
  type: 'PROJECTS:CLEAN_AFTER_PREV_SCREEN',
});

export const saveScreen = (canvas: HTMLCanvasElement): T.SaveScreen => ({
  type: 'PROJECTS:SAVE_SCREEN',
  payload: { canvas },
});

export const setScreen = (screen: T.IProjectScreen): T.SetScreen => ({
  type: 'PROJECTS:SET_SCREEN',
  payload: { screen },
});

export const addElement = (parentID: string, type: string): T.AddElement => ({
  type: 'PROJECTS:ADD_ELEMENT',
  payload: { parentID, type },
});

export const setScenarioElements = (elements: T.IScenarioElements): T.SetScenarioElements => ({
  type: 'PROJECTS:SET_SCENARIO_ELEMENTS',
  payload: { elements },
});

export const updateElementStyles = (id: string, styles: CSSProperties): T.UpdateElementStyles => ({
  type: 'PROJECTS:UPDATE_ELEMENT_STYLES',
  payload: { id, styles },
});

// TODO: here is not CSSProperties, here css-like properties written in lower-case-hyphenated
export const updateScenarioStyles = (
  id: string,
  styles: CSSProperties & { 'flex-direction'?: string },
): T.UpdateScenarioStyles => ({
  type: 'PROJECTS:UPDATE_SCENARIO_STYLES',
  payload: { id, styles },
});

export const updateRootStyles = (id: string, styles: CSSProperties): T.UpdateRootStyles => ({
  type: 'PROJECTS:UPDATE_ROOT_STYLES',
  payload: { id, styles },
});

// export const updateStylesGroup = (itemId: string, styles: IScreenProps) => ({
//   type: TYPES.UPDATE_STYLES_GROUP,
//   payload: { itemId, styles },
// });

export const updateElementParameters = (itemID: string, parameters: T.IScreenProps): T.UpdateElementParameters => ({
  type: 'PROJECTS:UPDATE_ELEMENT_PARAMETERS',
  payload: { itemID, parameters },
});

export const setAlign = (itemID: string, type: string): T.SetAlign => ({
  type: 'PROJECTS:SET_ALIGN',
  payload: { itemID, type },
});

export const changeScenario = (itemID: string, scenarioID: number): T.ChangeScenario => ({
  type: 'PROJECTS:CHANGE_SCENARIO',
  payload: { itemID, scenarioID },
});

export const changeElementType = (itemID: string, type: string): T.ChangeElementType => ({
  type: 'PROJECTS:CHANGE_ELEMENT_TYPE',
  payload: { type, itemID },
});

export const delScenarioItem = (id: string): T.DeleteScenarioItem => ({
  type: 'PROJECTS:DELETE_SCENARIO_ITEM',
  payload: { id },
});

export const changeScenarios = (screenID: number): T.ChangeScenarios => ({
  type: 'PROJECTS:CHANGE_SCENARIOS',
  payload: { screenID },
});

// unused
export const createScenario = (name: string, type: string, elements?: number[]) => ({
  type: TYPES.CREATE_SCENARIO,
  payload: { name, type, elements },
});

export const addScenario = (
  parentScenarioID: number | null,
  name: string,
  elements: IChooseElement[],
): T.AddScenario => ({
  type: 'PROJECTS:ADD_SCENARIO',
  payload: { parentScenarioID, name, elements },
});

export const delScenario = (id: string): T.DeleteScenario => ({
  type: 'PROJECTS:DELETE_SCENARIO',
  payload: { id },
});

export const renameScenario = (scenarioID: number, name: string): T.RenameScenario => ({
  type: 'PROJECTS:RENAME_SCENARIO',
  payload: { scenarioID, name },
});

export const setScenarios = (scenarios: T.IScenarios): T.SetScenarios => ({
  type: 'PROJECTS:SET_SCENARIOS',
  payload: { scenarios },
});

export const setModifyElements = (elements: number[]): T.SetModifyElements => ({
  type: 'PROJECTS:SET_MODIFY_ELEMENTS',
  payload: { elements },
});

export const uploadFile = (payload: { file: any }): T.UploadFile => ({
  type: 'PROJECTS:UPLOAD_FILE',
  payload,
});

export const uploadImageForNNSuccess = (payload: { imageURL: string, screenID: number }): T.uploadImageForNNSuccess => ({
  type: 'PROJECTS:UPLOAD_IMAGE_FOR_NN_SUCCESS',
  payload,
})

export const getScreenNN = (): T.GetScreenNN => ({ type: 'PROJECTS:GET_SCREEN_NN' });

export const addContainer = (itemID: string): T.AddContainer => ({
  type: 'PROJECTS:ADD_CONTAINER',
  payload: { itemID },
});

// export const setScreenData: ISetScreenData = screen_data => ({
//   type: TYPES.SET_SCREEN_DATA,
//   screen_data,
// });
