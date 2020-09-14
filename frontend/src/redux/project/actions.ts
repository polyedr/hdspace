import { ElementHistoryMeta, HistoryMeta, Screen } from './types';
import TYPES from '../../constants/actions';
import { LibraryElement, Project } from '../../api/types';
import { ChildEntity, Entity } from '../../domain/core';
import { ChildrenElements } from '../../domain/libraryElements/libraryElements';
import { CssLikeStyles } from '../../utils/StyleHelper';
import * as T from './types';

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

export const setCurrentProjectId = (
  projectId: number,
): T.SetCurrentProjectId => ({
  type: TYPES.SET_CURRENT_PROJECT_ID,
  payload: { projectId },
});

export const setProject = (project: Project): T.SetProject => ({
  type: TYPES.SET_PROJECT,
  payload: { project },
});

export const updateProject = (
  project: Project,
  meta: T.HistoryMeta = {},
): T.UpdateProject => ({
  type: TYPES.UPDATE_PROJECT,
  payload: { project },
  meta,
});

export const exportProject = (): T.ExportProject => ({
  type: TYPES.EXPORT_PROJECT,
});

export const changeScreensOrder = (
  screens: T.Screen[],
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
  projectId: number,
  screenId: number,
  meta: HistoryMeta = {},
): T.DeleteScreen => ({
  type: TYPES.DELETE_SCREEN,
  payload: { projectId, screenId },
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
  skip: boolean = false,
): T.AddScreen => ({
  type: TYPES.ADD_SCREEN,
  payload: { projectID, name, buoyancy, skip },
});

export const duplicateScreen = (
  name: string,
  screenID: number,
): T.DuplicateScreen => ({
  type: TYPES.DUPLICATE_SCREEN,
  payload: { name, screenID },
});

export const activateScreen = (screenId: number): T.ActivateScreen => ({
  type: TYPES.ACTIVATE_SCREEN,
  payload: { screenId },
});

export const moveElement = (
  indices: T.Indices,
  elementID: string,
  parentID: string,
  isRemote: boolean = false,
  meta: T.ElementHistoryMeta,
): T.MoveElement => ({
  type: TYPES.MOVE_ELEMENT,
  payload: {
    indices,
    elementID,
    parentID,
    isRemote,
  },
  meta,
});

export const clearAfterPrevScreen = (): T.ClearAfterPrevScreen => ({
  type: TYPES.CLEAN_AFTER_PREV_SCREEN,
});

export const updateElementsTree = (
  root: LibraryElement<'root'>,
  sourceAction: T.Action | null = null,
  meta: T.ElementHistoryMeta,
): T.UpdateElementsTree => ({
  type: TYPES.UPDATE_ELEMENTS_TREE,
  payload: { root, sourceAction },
  meta,
});

export const resetScreenState = (): T.ResetScreenState => ({
  type: TYPES.RESET_SCREEN_STATE,
});

export const saveScreenImage = (
  screenId: number,
  canvas: HTMLCanvasElement,
): T.SaveScreen => ({
  type: TYPES.SAVE_SCREEN,
  payload: {
    screenId,
    canvas,
  },
});

export const setCurrentScreenId = (screenId: number): T.SetCurrentScreenId => ({
  type: TYPES.SET_CURRENT_SCREEN_ID,
  payload: { screenId },
});

export const updateScreen = (screen: Screen): T.UpdateScreen => ({
  type: TYPES.UPDATE_SCREEN,
  payload: {
    screen,
  },
});

export const setScreens = (screens: T.Screen[]): T.SetScreens => ({
  type: TYPES.SET_SCREENS,
  payload: { screens },
});

export const renameElement = (
  elementID: string,
  name: string,
  meta: ElementHistoryMeta,
): T.RenameElement => ({
  type: TYPES.RENAME_ELEMENT,
  payload: { elementID, name },
  meta,
});

export const toggleContainersBorders = (): T.ToggleContainersBorders => ({
  type: TYPES.TOGGLE_CONTAINERS_BORDERS,
});

export const updateSharedStyles = (
  className: Entity,
  styles: CssLikeStyles,
  meta: T.ElementHistoryMeta,
): T.UpdateSharedStyles => ({
  type: TYPES.UPDATE_SHARED_STYLES,
  payload: { className, styles },
  meta,
});

export const copyElementStyles = (
  elementType: Entity,
  elementID: string,
  styles: CssLikeStyles,
  meta: T.ElementHistoryMeta,
): T.CopyElementStyles => ({
  type: TYPES.COPY_ELEMENT_STYLES,
  payload: { elementType, elementID, styles },
  meta,
});

export const addElementClassName = (
  elementID: string,
  className: string,
  meta: T.ElementHistoryMeta,
): T.AddElementClassName => ({
  type: TYPES.ADD_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta,
});

export const removeElementClassName = (
  elementID: string,
  className: string,
  meta: T.ElementHistoryMeta,
): T.RemoveElementClassName => ({
  type: TYPES.REMOVE_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta,
});

export const removeSharedStyles = (
  className: Entity,
  cssPropertiesNames: string[],
  meta: T.ElementHistoryMeta,
): T.RemoveSharedStyles => ({
  type: TYPES.REMOVE_SHARED_STYLES,
  payload: { className, cssPropertiesNames },
  meta,
});

export const replaceElementStyles = (
  id: string,
  styles: CssLikeStyles,
  meta: T.ElementHistoryMeta,
): T.ReplaceElementStyles => ({
  type: TYPES.REPLACE_ELEMENT_STYLES,
  payload: { id, styles },
  meta,
});

export const updateElementStyles = (
  id: string,
  styles: CssLikeStyles,
  meta: T.ElementHistoryMeta,
): T.UpdateElementStyles => ({
  type: TYPES.UPDATE_ELEMENT_STYLES,
  payload: { id, styles },
  meta,
});

export const removeElementStyles = (
  id: string,
  cssPropertiesNames: string[],
  meta: T.ElementHistoryMeta,
): T.RemoveElementStyles => ({
  type: TYPES.REMOVE_ELEMENT_STYLES,
  payload: { id, cssPropertiesNames },
  meta,
});

export const updateElementImage = (
  itemID: string,
  image: File,
  meta: ElementHistoryMeta,
): T.UpdateElementImage => ({
  type: TYPES.UPDATE_ELEMENT_IMAGE,
  payload: { itemID, image },
  meta,
});

export const updateElementParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters']
>(
  itemID: string,
  parameters: K,
  meta: T.ElementHistoryMeta,
): T.UpdateElementParameters => ({
  type: TYPES.UPDATE_ELEMENT_PARAMETERS,
  payload: { itemID, parameters },
  meta,
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
  meta: T.ElementHistoryMeta,
): T.DeleteItem => ({
  type: TYPES.DELETE_ITEM,
  payload: { id },
  meta,
});

export const createElements = (
  createdElements: T.CreatedElement[],
  meta: ElementHistoryMeta,
): T.CreateElements => ({
  type: TYPES.CREATE_ELEMENTS,
  payload: { createdElements },
  meta,
});

export const addChildToElement = (
  childType: ChildEntity,
  elementID: string,
  parameters: ChildrenElements[ChildEntity]['parameters'],
  meta: ElementHistoryMeta,
): T.AddChildToElement => ({
  type: TYPES.ADD_CHILD_TO_ELEMENT,
  payload: { childType, elementID, parameters },
  meta,
});

export const uploadFile = (
  file: any,
  meta: ElementHistoryMeta,
): T.UploadFile => ({
  type: TYPES.UPLOAD_FILE,
  payload: {
    file,
  },
  meta,
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
  meta: T.ElementHistoryMeta,
): T.WrapIntoContainer => ({
  type: TYPES.WRAP_INTO_CONTAINER,
  payload: { id },
  meta,
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

export const pasteCopiedItem = (
  meta: ElementHistoryMeta,
): T.PasteCopiedItem => ({
  type: TYPES.PASTE_COPIED_ITEM,
  meta,
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
  meta: T.ElementHistoryMeta,
): T.UnwrapFromContainer => ({
  type: TYPES.UNWRAP_FROM_CONTAINER,
  payload: {
    elementID,
    wrapperID,
    parentID,
  },
  meta,
});

export const restoreElementChildren = (
  elementId: string,
  childrenIds: string[],
  meta: T.ElementHistoryMeta,
): T.RestoreElementChildren => ({
  type: TYPES.RESTORE_ELEMENT_CHILDREN,
  payload: {
    elementId,
    childrenIds,
  },
  meta,
});

export const redoWrapIntoContainer = (
  elementId: string,
  wrapperId: string,
  parentId: string,
  meta: T.ElementHistoryMeta,
): T.RedoWrapIntoContainer => ({
  type: TYPES.REDO_WRAP_INTO_CONTAINER,
  payload: {
    elementId,
    wrapperId,
    parentId,
  },
  meta,
});

export const popHistory = (): T.PopHistory => ({
  type: TYPES.POP_HISTORY,
});

export const setGroupActionsUp = (groupUp: boolean): T.SetGroupActionsUp => ({
  type: TYPES.SET_GROUP_UP,
  payload: groupUp,
});

export const addElements = (
  elements: LibraryElement<any>[],
  parentId?: string,
): T.AddElements => ({
  type: TYPES.ADD_ELEMENTS,
  payload: { elements, parentId },
});

export const removeElements = (elementIds: string[]): T.RemoveElements => ({
  type: TYPES.REMOVE_ELEMENTS,
  payload: elementIds,
});

export const updateElement = (
  elementId: string,
  data: Partial<LibraryElement<any>>,
): T.UpdateElement => ({
  type: TYPES.UPDATE_ELEMENT,
  payload: {
    elementId,
    data,
  },
});
