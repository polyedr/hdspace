import { CSSProperties } from 'react';

import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryEntities, ChildrenElements } from '$domain/libraryElements/libraryElements';
import { ChildEntity, Entity } from '$domain/core';
import { LibraryElement } from '$api/types';

import * as T from './types';
import { Action, HistoryOptions, Indices } from './types';

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
  indices: Indices,
  elementID: string,
  parentID: string,
  isRemote: boolean = false,
  options: HistoryOptions = {},
): T.MoveElement => ({
  type: 'PROJECTS:MOVE_ELEMENT',
  payload: {
    indices,
    elementID,
    parentID,
    options,
    isRemote
  },
});

export const clearAfterPrevScreen = (): T.ClearAfterPrevScreen => ({
  type: 'PROJECTS:CLEAN_AFTER_PREV_SCREEN',
});

export const updateElementsTree = (root: LibraryElement<'root'>, skip: boolean = false, sourceAction: Action | null = null): T.UpdateElementsTree => ({
  type: 'PROJECTS:UPDATE_ELEMENTS_TREE',
  payload: { root, skip, sourceAction },
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

export const updateElementStyles = (id: string, styles: CssLikeStyles, options: T.HistoryOptions = {}): T.UpdateElementStyles => ({
  type: 'PROJECTS:UPDATE_ELEMENT_STYLES',
  payload: { id, styles, options },
});

export const updateElementImage = (itemID: string, image: File ): T.UpdateElementImage => ({
  type: 'PROJECTS:UPDATE_ELEMENT_IMAGE',
  payload: { itemID, image },
});

export const updateElementParameters = <T extends Entity, K extends LibraryElement<T>['parameters']>(
  itemID: string,
  parameters: K,
  options: HistoryOptions = {},
): T.UpdateElementParameters => ({
  type: 'PROJECTS:UPDATE_ELEMENT_PARAMETERS',
  payload: { itemID, parameters, options },
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

export const deleteElement = (id: string, undo: boolean = false): T.DeleteElement => ({
  type: 'PROJECTS:DELETE_ELEMENT',
  payload: { id, undo }
});

export const createElements = (createdElements: T.CreatedElement[]): T.CreateElements => ({
  type: 'PROJECTS:CREATE_ELEMENTS',
  payload: { createdElements },
});

export const addChildToElement = (childType: ChildEntity, elementID: string, parameters: ChildrenElements[ChildEntity]['parameters'], undo: boolean = false): T.AddChildToElement => ({
  type: 'PROJECTS:ADD_CHILD_TO_ELEMENT',
  payload: { childType, elementID, parameters, undo },
});

export const deleteChildFromElement = (id: string): T.DeleteChildFromElement => ({
  type: 'PROJECTS:DELETE_CHILD_FROM_ELEMENT',
  payload: { id },
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

export const undoAction = (): T.UndoAction => ({
  type: 'UNDO_ACTION',
});

export const redoAction = (): T.RedoAction => ({
  type: 'REDO_ACTION',
});

export const setUndoActions = (actions: Action[]): T.SetUndoActions => ({
  type: 'PROJECTS:SET_UNDO_ACTIONS',
  payload: [...actions],
});

export const setRedoActions = (actions: Action[]): T.SetRedoActions => ({
  type: 'PROJECTS:SET_REDO_ACTIONS',
  payload: [...actions],
});

export const addUndoAction = (action: Action): T.AddUndoAction => ({
  type: 'PROJECTS:ADD_UNDO_ACTION',
  payload: { ...action },
});

export const setAdd = (add: boolean): T.SetAddAction => ({
  type: 'PROJECTS:SET_ADD_ACTION',
  payload: add,
});

export const unwrapFromContainer = (elementID: string, wrapperID: string, parentID: string): T.UnwrapFromContainer => ({
  type: 'PROJECTS:UNWRAP_FROM_CONTAINER',
  payload: {
    elementID,
    wrapperID,
    parentID,
  }
});

export const restoreElementChildren = (elementId: string, childrenIds: string[]): T.RestoreElementChildren => ({
  type: 'PROJECTS:RESTORE_ELEMENT_CHILDREN',
  payload: {
    elementId,
    childrenIds,
  }
});