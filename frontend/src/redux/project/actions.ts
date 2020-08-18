import { CssLikeStyles } from '$utils/StyleHelper';
import {
  LibraryEntities,
  ChildrenElements,
} from '$domain/libraryElements/libraryElements';
import { ChildEntity, Entity } from '$domain/core';
import { LibraryElement, Project } from '$api/types';

import * as T from './types';
import { TYPES } from '$constants/actions';
import { HistoryMeta } from './types';

export const getLibraryElements = (): T.LoadLibraryElements => ({
  type: TYPES.GET_LIBRARY_ELEMENTS,
});

export const setLibraryElements = (
  libraryElements: LibraryEntities,
): T.LoadLibraryElementsSuccess => ({
  type: TYPES.LOAD_LIBRARY_ELEMENTS_SUCCESS,
  payload: { libraryElements },
});

export const getProjectList = (): T.LoadProjects => ({
  type: TYPES.LOAD_PROJECTS,
});

export const setProjectList = (projects: Project[]): T.LoadProjectsSuccess => ({
  type: TYPES.LOAD_PROJECTS_SUCCESS,
  payload: { projects },
});

export const addProject = (name: string): T.AddProject => ({
  type: TYPES.ADD_PROJECT,
  payload: { name },
});

export const delProject = (id: number): T.DeleteProject => ({
  type: TYPES.DELETE_PROJECT,
  payload: { id },
});

export const getProject = (id: number, screenID?: number): T.GetProject => ({
  type: TYPES.GET_PROJECT,
  payload: { id, screenID },
});

export const setProject = (project: Project): T.SetProject => ({
  type: TYPES.SET_PROJECT,
  payload: { project },
});

export const updateProject = (
  project: Project,
  options: T.HistoryMeta = {},
): T.UpdateProject => ({
  type: TYPES.UPDATE_PROJECT,
  payload: { project },
  meta: options,
});

export const exportProject = (): T.ExportProject => ({
  type: TYPES.EXPORT_PROJECT,
});

export const changeScreensOrder = (
  screens: T.IProjectScreen[],
): T.ChangeScreensOrder => ({
  type: TYPES.CHANGE_SCREENS_ORDER,
  payload: { screens },
});

export const renameProject = (
  projectID: number,
  name: string,
): T.RenameProject => ({
  type: TYPES.RENAME_PROJECT,
  payload: { projectID, name },
});

export const setProjectListLoader = (
  active: boolean,
): T.SetProjectListLoader => ({
  type: TYPES.SET_PROJECT_LIST_LOADER,
  payload: { active },
});

export const setProjectLoader = (active: boolean): T.SetProjectLoader => ({
  type: TYPES.SET_PROJECT_LOADER,
  payload: { active },
});

export const setScreenLoader = (active: boolean): T.SetScreenLoader => ({
  type: TYPES.SET_SCREEN_LOADER,
  payload: { active },
});

export const setLoader = (active: boolean): T.SetLoader => ({
  type: TYPES.SET_LOADER,
  payload: { active },
});

export const setScenarioLoader = (active: boolean): T.SetScenarioLoader => ({
  type: TYPES.SET_SCENARIO_LOADER,
  payload: { active },
});

export const setNotification = (text: string): T.SetNotification => ({
  type: TYPES.SET_NOTIFICATION,
  payload: { text },
});

export const removeNotification = (): T.RemoveNotification => ({
  type: TYPES.REMOVE_NOTIFICATION,
});

export const delScreen = (
  projectID: number,
  screenID: number,
  meta: HistoryMeta = {},
): T.DeleteScreen => ({
  type: TYPES.DELETE_SCREEN,
  payload: { projectID, screenID },
  meta,
});

export const restoreScreen = (
  screenId: number,
  projectId: number,
): T.RestoreScreen => ({
  type: TYPES.RESTORE_SCREEN,
  payload: {
    screenId,
    projectId,
  },
});

export const renameScreen = (
  projectID: number,
  screenID: number,
  name: string,
): T.RenameScreen => ({
  type: TYPES.RENAME_SCREEN,
  payload: { projectID, screenID, name },
});

export const addScreen = (
  projectID: number,
  name: string,
  buoyancy: number,
): T.AddScreen => ({
  type: TYPES.ADD_SCREEN,
  payload: { projectID, name, buoyancy },
});

export const duplicateScreen = (
  name: string,
  screenID: number,
): T.DuplicateScreen => ({
  type: TYPES.DUPLICATE_SCREEN,
  payload: { name, screenID },
});

export const activateScreen = (
  screenID: number,
  meta: HistoryMeta = {},
): T.ActivateScreen => ({
  type: TYPES.ACTIVATE_SCREEN,
  payload: { screenID },
  meta,
});

export const moveElement = (
  indices: T.Indices,
  elementID: string,
  parentID: string,
  isRemote: boolean = false,
  options: T.HistoryMeta = {},
): T.MoveElement => ({
  type: TYPES.MOVE_ELEMENT,
  payload: {
    indices,
    elementID,
    parentID,
    isRemote,
  },
  meta: options,
});

export const clearAfterPrevScreen = (): T.ClearAfterPrevScreen => ({
  type: TYPES.CLEAN_AFTER_PREV_SCREEN,
});

export const updateElementsTree = (
  root: LibraryElement<'root'>,
  sourceAction: T.Action | null = null,
  meta: T.HistoryMeta = {},
): T.UpdateElementsTree => ({
  type: TYPES.UPDATE_ELEMENTS_TREE,
  payload: { root, sourceAction },
  meta,
});

export const resetScreenState = (): T.ResetScreenState => ({
  type: TYPES.RESET_SCREEN_STATE,
});

export const saveScreen = (canvas: HTMLCanvasElement): T.SaveScreen => ({
  type: TYPES.SAVE_SCREEN,
  payload: { canvas },
});

export const setScreen = (screen: T.IProjectScreen): T.SetScreen => ({
  type: TYPES.SET_SCREEN,
  payload: { screen },
});

export const setScreens = (screens: T.IProjectScreen[]): T.SetScreens => ({
  type: TYPES.SET_SCREENS,
  payload: { screens },
});

export const addElement = (parentID: string, type: string): T.AddElement => ({
  type: TYPES.ADD_ELEMENT,
  payload: { parentID, type },
});

export const renameElement = (
  elementID: string,
  name: string,
): T.RenameElement => ({
  type: TYPES.RENAME_ELEMENT,
  payload: { elementID, name },
});

export const toggleContainersBorders = (): T.ToggleContainersBorders => ({
  type: TYPES.TOGGLE_CONTAINERS_BORDERS,
});

export const setScenarioElements = (
  elements: T.IScenarioElements,
): T.SetScenarioElements => ({
  type: TYPES.SET_SCENARIO_ELEMENTS,
  payload: { elements },
});

export const updateSharedStyles = (
  className: Entity,
  styles: CssLikeStyles,
  options: T.HistoryMeta = {},
): T.UpdateSharedStyles => ({
  type: TYPES.UPDATE_SHARED_STYLES,
  payload: { className, styles },
  meta: options,
});

export const copyElementStyles = (
  elementType: Entity,
  elementID: string,
  styles: CssLikeStyles,
  options: T.HistoryMeta = {},
): T.CopyElementStyles => ({
  type: TYPES.COPY_ELEMENT_STYLES,
  payload: { elementType, elementID, styles },
  meta: options,
});

export const addElementClassName = (
  elementID: string,
  className: string,
  options: T.HistoryMeta = {},
): T.AddElementClassName => ({
  type: TYPES.ADD_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta: options,
});

export const removeElementClassName = (
  elementID: string,
  className: string,
  options: T.HistoryMeta = {},
): T.RemoveElementClassName => ({
  type: TYPES.REMOVE_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta: options,
});

export const removeSharedStyles = (
  className: Entity,
  cssPropertiesNames: string[],
  options: T.HistoryMeta = {},
): T.RemoveSharedStyles => ({
  type: TYPES.REMOVE_SHARED_STYLES,
  payload: { className, cssPropertiesNames },
  meta: options,
});

export const replaceElementStyles = (
  id: string,
  styles: CssLikeStyles,
  options: T.HistoryMeta = {},
): T.ReplaceElementStyles => ({
  type: TYPES.REPLACE_ELEMENT_STYLES,
  payload: { id, styles },
  meta: options,
});

export const updateElementStyles = (
  id: string,
  styles: CssLikeStyles,
  options: T.HistoryMeta = {},
): T.UpdateElementStyles => ({
  type: TYPES.UPDATE_ELEMENT_STYLES,
  payload: { id, styles },
  meta: options,
});

export const removeElementStyles = (
  id: string,
  cssPropertiesNames: string[],
  options: T.HistoryMeta = {},
): T.RemoveElementStyles => ({
  type: TYPES.REMOVE_ELEMENT_STYLES,
  payload: { id, cssPropertiesNames },
  meta: options,
});

export const updateElementImage = (
  itemID: string,
  image: File,
): T.UpdateElementImage => ({
  type: TYPES.UPDATE_ELEMENT_IMAGE,
  payload: { itemID, image },
});

export const updateElementParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters']
>(
  itemID: string,
  parameters: K,
  options: T.HistoryMeta = {},
): T.UpdateElementParameters => ({
  type: TYPES.UPDATE_ELEMENT_PARAMETERS,
  payload: { itemID, parameters },
  meta: options,
});

export const updateSavedElementsValues = (
  elementsValues: T.SavedElementsValues,
): T.UpdateSavedElementsValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENTS_VALUES,
  payload: { elementsValues },
});

export const updateSavedElementValues = (
  itemID: string,
  savedValue: string | boolean,
): T.UpdateSavedElementValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENT_VALUES,
  payload: { itemID, savedValue },
});

export const deleteItem = (
  id: string,
  options: T.HistoryMeta = {},
): T.DeleteItem => ({
  type: TYPES.DELETE_ITEM,
  payload: { id },
  meta: options,
});

export const createElements = (
  createdElements: T.CreatedElement[],
): T.CreateElements => ({
  type: TYPES.CREATE_ELEMENTS,
  payload: { createdElements },
});

export const addChildToElement = (
  childType: ChildEntity,
  elementID: string,
  parameters: ChildrenElements[ChildEntity]['parameters'],
  undo: boolean = false,
): T.AddChildToElement => ({
  type: TYPES.ADD_CHILD_TO_ELEMENT,
  payload: { childType, elementID, parameters },
  meta: {
    undo,
  },
});

export const setScenarios = (scenarios: T.IScenarios): T.SetScenarios => ({
  type: TYPES.SET_SCENARIOS,
  payload: { scenarios },
});

export const setModifyElements = (elements: number[]): T.SetModifyElements => ({
  type: TYPES.SET_MODIFY_ELEMENTS,
  payload: { elements },
});

export const uploadFile = (payload: { file: any }): T.UploadFile => ({
  type: TYPES.UPLOAD_FILE,
  payload,
});

export const uploadImageForNNSuccess = (payload: {
  imageURL: string;
  screenID: number;
}): T.uploadImageForNNSuccess => ({
  type: TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS,
  payload,
});

export const getScreenNN = (): T.GetScreenNN => ({
  type: TYPES.GET_SCREEN_NN,
});

export const wrapIntoContainer = (
  id: string,
  options: T.HistoryMeta = {},
): T.WrapIntoContainer => ({
  type: TYPES.WRAP_INTO_CONTAINER,
  payload: { id },
  meta: options,
});

export const setActiveItem = (activeItem: T.ActiveItem): T.SetActiveItem => ({
  type: TYPES.SET_ACTIVE_ITEM,
  payload: { activeItem },
});

export const setEditableStyles = (className: string): T.SetEditableStyles => ({
  type: TYPES.SET_EDITABLE_STYLES,
  payload: { className },
});

export const setIsAddElementsModalOpened = (
  isOpened: boolean,
): T.SetIsAddElementsModalOpened => ({
  type: TYPES.SET_IS_ADD_ELEMENTS_MODAL_OPENED,
  payload: { isOpened },
});

export const copyActiveItem = (): T.CopyActiveItem => ({
  type: TYPES.COPY_ACTIVE_ITEM,
});

export const pasteCopiedItem = (): T.PasteCopiedItem => ({
  type: TYPES.PASTE_COPIED_ITEM,
});

export const setItemToCopy = (
  id: string,
  screenID: number,
): T.SetItemToCopy => ({
  type: TYPES.SET_ITEM_TO_COPY,
  payload: { id, screenID },
});

export const undoAction = (): T.UndoAction => ({
  type: TYPES.UNDO_ACTION,
});

export const redoAction = (): T.RedoAction => ({
  type: TYPES.REDO_ACTION,
});

export const setUndoActions = (
  action: T.Action | T.Action[],
): T.SetUndoActions => ({
  type: TYPES.SET_UNDO_ACTIONS,
  payload: action,
});

export const setRedoActions = (actions: T.Action[]): T.SetRedoActions => ({
  type: TYPES.SET_REDO_ACTIONS,
  payload: actions,
});

export const popUndoAction = (): T.PopUndoAction => ({
  type: TYPES.POP_UNDO_ACTION,
});

export const setRemoteMove = (isRemote: boolean): T.SetRemoteMove => ({
  type: TYPES.SET_REMOTE_MOVE,
  payload: isRemote,
});

export const unwrapFromContainer = (
  elementID: string,
  wrapperID: string,
  parentID: string,
  options: T.HistoryMeta = {},
): T.UnwrapFromContainer => ({
  type: TYPES.UNWRAP_FROM_CONTAINER,
  payload: {
    elementID,
    wrapperID,
    parentID,
  },
  meta: options,
});

export const restoreElementChildren = (
  elementId: string,
  childrenIds: string[],
  options: T.HistoryMeta = {},
): T.RestoreElementChildren => ({
  type: TYPES.RESTORE_ELEMENT_CHILDREN,
  payload: {
    elementId,
    childrenIds,
  },
  meta: options,
});

export const redoWrapIntoContainer = (
  elementId: string,
  wrapperId: string,
  parentId: string,
  options: T.HistoryMeta = {},
): T.RedoWrapIntoContainer => ({
  type: TYPES.REDO_WRAP_INTO_CONTAINER,
  payload: {
    elementId,
    wrapperId,
    parentId,
  },
  meta: options,
});

export const clearHistory = (): T.ClearHistory => ({
  type: TYPES.CLEAR_HISTORY,
});

export const popHistory = (): T.PopHistory => ({
  type: TYPES.POP_HISTORY,
});

export const setGroupActionsUp = (groupUp: boolean): T.SetGroupActionsUp => ({
  type: TYPES.SET_GROUP_UP,
  payload: groupUp,
});
