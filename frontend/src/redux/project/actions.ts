import { CSSProperties } from 'react';

import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryEntities, ChildrenElements } from '$domain/libraryElements/libraryElements';
import { ChildEntity, Entity } from '$domain/core';
import { LibraryElement, Project } from '$api/types';

import * as T from './types';

export const getLibraryElements = (): T.LoadLibraryElements => ({
  type: 'PROJECTS:LOAD_LIBRARY_ELEMENTS',
});

export const setLibraryElements = (libraryElements: LibraryEntities): T.LoadLibraryElementsSuccess => ({
  type: 'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS',
  payload: { libraryElements },
});

export const getListProject = (): T.LoadProjects => ({
  type: 'PROJECTS:LOAD_PROJECTS',
});

export const setListProject = (projects: Project[]): T.LoadProjectsSuccess => ({
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

export const setProject = (project: Project): T.SetProject => ({
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

export const setNotification = (text: string): T.SetNotification => ({
  type: 'PROJECTS:SET_NOTIFICATION',
  payload: { text },
});

export const removeNotification = (): T.RemoveNotification => ({
  type: 'PROJECTS:REMOVE_NOTIFICATION',
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

export const moveElement = (
  elementIndex: number, elementID: string, parentID: string
): T.MoveElement => ({
  type: 'PROJECTS:MOVE_ELEMENT',
  payload: {
    elementIndex,
    elementID,
    parentID,
  },
});

export const clearAfterPrevScreen = (): T.ClearAfterPrevScreen => ({
  type: 'PROJECTS:CLEAN_AFTER_PREV_SCREEN',
});

export const updateElementsTree = (root: LibraryElement<'root'>): T.UpdateElementsTree => ({
  type: 'PROJECTS:UPDATE_ELEMENTS_TREE',
  payload: { root },
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

export const renameElement = (elementID: string, name: string): T.RenameElement => ({
  type: 'PROJECTS:RENAME_ELEMENT',
  payload: { elementID, name },
});

export const toggleContainersBorders = (): T.ToggleContainersBorders => ({
  type: 'PROJECTS:TOGGLE_CONTAINERS_BORDERS',
});

export const setScenarioElements = (elements: T.IScenarioElements): T.SetScenarioElements => ({
  type: 'PROJECTS:SET_SCENARIO_ELEMENTS',
  payload: { elements },
});

export const updateSharedStyles = (className: Entity, styles: CssLikeStyles): T.UpdateSharedStyles => ({
  type: 'PROJECTS:UPDATE_SHARED_STYLES',
  payload: { className, styles },
});

export const copyElementStyles = (elementType: Entity, elementID: string, styles: CssLikeStyles): T.CopyElementStyles => ({
  type: 'PROJECTS:COPY_ELEMENT_STYLES',
  payload: { elementType, elementID, styles },
});

export const setCopiedStyles = (elementType: Entity, className: string, styles: CssLikeStyles): T.SetCopiedStyles => ({
  type: 'PROJECTS:SET_COPIED_STYLES',
  payload: { elementType, className, styles },
});

export const addElementClassName = (elementID: string, className: string): T.AddElementClassName => ({
  type: 'PROJECTS:ADD_ELEMENT_CLASSNAME',
  payload: { elementID, className },
});

export const removeElementClassName = (elementID: string, className: string): T.RemoveElementClassName => ({
  type: 'PROJECTS:REMOVE_ELEMENT_CLASSNAME',
  payload: { elementID, className },
});

// TODO remove this action
export const removeSharedStyles = (className: Entity, ruleName: string): T.RemoveSharedStyles => ({
  type: 'PROJECTS:REMOVE_SHARED_STYLES',
  payload: { className, ruleName },
});

export const updateElementStyles = (id: string, styles: CssLikeStyles): T.UpdateElementStyles => ({
  type: 'PROJECTS:UPDATE_ELEMENT_STYLES',
  payload: { id, styles },
});

export const removeElementStyles = (id: string, ruleNames: string[]): T.RemoveElementStyles => ({
  type: 'PROJECTS:REMOVE_ELEMENT_STYLES',
  payload: { id, ruleNames },
});

export const updateElementImage = (itemID: string, image: File ): T.UpdateElementImage => ({
  type: 'PROJECTS:UPDATE_ELEMENT_IMAGE',
  payload: { itemID, image },
});

export const updateElementParameters = <T extends Entity, K extends LibraryElement<T>['parameters']>(
  itemID: string,
  parameters: K
): T.UpdateElementParameters => ({
  type: 'PROJECTS:UPDATE_ELEMENT_PARAMETERS',
  payload: { itemID, parameters },
});

export const updateSavedElementsValues = (elementsValues: T.SavedElementsValues): T.UpdateSavedElementsValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES',
  payload: { elementsValues },
});

export const updateSavedElementValues = (itemID: string, savedValue: string | boolean): T.UpdateSavedElementValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES',
  payload: { itemID, savedValue },
});

export const deleteActiveItem = (): T.DeleteActiveItem => ({
  type: 'PROJECTS:DELETE_ACTIVE_ITEM',
});

export const createElements = (createdElements: T.CreatedElement[]): T.CreateElements => ({
  type: 'PROJECTS:CREATE_ELEMENTS',
  payload: { createdElements },
});

export const addChildToElement = (childType: ChildEntity, elementID: string, parameters: ChildrenElements[ChildEntity]['parameters']): T.AddChildToElement => ({
  type: 'PROJECTS:ADD_CHILD_TO_ELEMENT',
  payload: { childType, elementID, parameters },
});

export const deleteChildFromElement = (childID: string, elementID: string): T.DeleteChildFromElement => ({
  type: 'PROJECTS:DELETE_CHILD_FROM_ELEMENT',
  payload: { childID, elementID },
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

export const setActiveItem = (activeItem: T.ActiveItem): T.SetActiveItem => ({
  type: 'PROJECTS:SET_ACTIVE_ITEM',
  payload: { activeItem },
});

export const setEditableStyles = (className: string): T.SetEditableStyles => ({
  type: 'PROJECTS:SET_EDITABLE_STYLES',
  payload: { className },
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
