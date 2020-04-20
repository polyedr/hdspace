import { CSSProperties } from 'react';

import { IChooseElement } from '$components/ModalAddElements/ModalAddElements/ModalAddElements';
import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryElements } from '$domain/libraryElements';

import * as T from './types';

export const getLibraryElements = (): T.LoadLibraryElements => ({
  type: 'PROJECTS:LOAD_LIBRARY_ELEMENTS',
});

export const setLibraryElements = (libraryElements: LibraryElements): T.LoadLibraryElementsSuccess => ({
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

export const exportProject = (): T.ExportProject => ({
  type: 'PROJECTS:EXPORT_PROJECT',
})

export const changeScreensOrder = (screens: T.IProjectScreen[]): T.ChangeScreensOrder => ({
  type: 'PROJECTS:CHANGE_SCREENS_ORDER',
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

export const addScreen = (projectID: number, name: string, buoyancy: number): T.AddScreen => ({
  type: 'PROJECTS:ADD_SCREEN',
  payload: { projectID, name, buoyancy },
});

export const duplicateScreen = (name: string, screenID: number): T.DuplicateScreen => ({
  type: 'PROJECTS:DUPLICATE_SCREEN',
  payload: { name, screenID },
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

export const updateViewTree = ({ screen, scenarios, scenarioElements }: Partial<{
  screen: T.IProjectScreen,
  scenarios: T.IScenarios,
  scenarioElements: T.IScenarioElements,
}>): T.UpdateViewTree => ({
  type: 'PROJECTS:UPDATE_VIEW_TREE',
  payload: { currentScreen: screen , scenarios, scenarioElements }
});

export const resetScreenState = (): T.ResetScreenState => ({
  type: 'PROJECTS:RESET_SCREEN_STATE',
});

export const saveScreen = (canvas: HTMLCanvasElement): T.SaveScreen => ({
  type: 'PROJECTS:SAVE_SCREEN',
  payload: { canvas },
});

export const setScreen = (screen: T.IProjectScreen): T.SetScreen => ({
  type: 'PROJECTS:SET_SCREEN',
  payload: { screen },
});

export const setScreens = (screens: T.IProjectScreen[]): T.SetScreens => ({
  type: 'PROJECTS:SET_SCREENS',
  payload: { screens },
});

export const addElement = (parentID: string, type: string): T.AddElement => ({
  type: 'PROJECTS:ADD_ELEMENT',
  payload: { parentID, type },
});

export const setScenarioElements = (elements: T.IScenarioElements): T.SetScenarioElements => ({
  type: 'PROJECTS:SET_SCENARIO_ELEMENTS',
  payload: { elements },
});

export const updateElementStyles = (id: string, styles: CssLikeStyles): T.UpdateElementStyles => ({
  type: 'PROJECTS:UPDATE_ELEMENT_STYLES',
  payload: { id, styles },
});

export const updateChildStyles = (parentID: string, id: string, styles: CssLikeStyles): T.UpdateChildStyles => ({
  type: 'PROJECTS:UPDATE_CHILD_STYLES',
  payload: { parentID, id, styles },
});

// TODO: here is not CSSProperties, here css-like properties written in lower-case-hyphenated
export const updateScenarioStyles = (
  id: string,
  styles: CSSProperties & { 'flex-direction'?: string },
): T.UpdateScenarioStyles => ({
  type: 'PROJECTS:UPDATE_SCENARIO_STYLES',
  payload: { id, styles },
});

// export const updateStylesGroup = (itemId: string, styles: IScreenProps) => ({
//   type: TYPES.UPDATE_STYLES_GROUP,
//   payload: { itemId, styles },
// });

export const updateElementImage = (itemID: string, image: File ): T.UpdateElementImage => ({
  type: 'PROJECTS:UPDATE_ELEMENT_IMAGE',
  payload: { itemID, image },
});

export const updateElementParameters = (itemID: string, parameters: T.IScreenProps): T.UpdateElementParameters => ({
  type: 'PROJECTS:UPDATE_ELEMENT_PARAMETERS',
  payload: { itemID, parameters },
});

export const updateSavedElementsValues = (elementsValues: T.SavedElementsValues): T.UpdateSavedElementsValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES',
  payload: { elementsValues },
});

export const updateSavedElementValues = (itemID: string, savedValue: string): T.UpdateSavedElementValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES',
  payload: { itemID, savedValue },
});

export const deleteActiveItem = (): T.DeleteActiveItem => ({
  type: 'PROJECTS:DELETE_ACTIVE_ITEM',
});

export const addElementsIntoContainer = (elements: IChooseElement[]): T.AddElementsIntoContainer => ({
  type: 'PROJECTS:ADD_ELEMENTS_INTO_CONTAINER',
  payload: { elements },
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

export const wrapIntoContainer = (): T.WrapIntoContainer => ({ type: 'PROJECTS:WRAP_INTO_CONTAINER' });

export const runLayoutAlgorithm = (
  scenarios: T.IScenarios,
  elements: T.IScenarioElements,
): T.RunLayoutAlgorithm => ({
  type: 'PROJECTS:RUN_LAYOUT_ALGORITHM',
  payload: { scenarios, elements },
});

export const runLayoutAlgorithmFinished = (): T.RunLayoutAlgorithmFinished => ({
  type: 'PROJECTS:RUN_LAYOUT_ALGORITHM_FINISHED',
});

export const setActiveItem = (activeItem: T.ActiveItem): T.SetActiveItem => ({
  type: 'PROJECTS:SET_ACTIVE_ITEM',
  payload: { activeItem },
});

export const setIsAddElementsModalOpened = (isOpened: boolean): T.SetIsAddElementsModalOpened => ({
  type: 'PROJECTS:SET_IS_ADD_ELEMENTS_MODAL_OPENED',
  payload: { isOpened },
});

export const copyActiveItem = (): T.CopyActiveItem => ({
  type: 'PROJECTS:COPY_ACTIVE_ITEM',
});

export const pasteCopiedItem = (): T.PasteCopiedItem => ({
  type: 'PROJECTS:PASTE_COPIED_ITEM',
});

export const setItemToCopy = (id: string, screenID: number): T.SetItemToCopy => ({
  type: 'PROJECTS:SET_ITEM_TO_COPY',
  payload: { id, screenID }
});
