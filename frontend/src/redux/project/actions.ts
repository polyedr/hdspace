import React from 'react';
import { DropPosition } from '../../constants/dragAndDrop';
import TYPES from '../actionTypes';
import {
  ChildEntity,
  ChildrenElements,
  CreatedElement,
  Entity,
  Indices,
  LibraryElement,
  LibraryElementPatch,
  Normalized,
  PaginatedArray,
  ParentIds,
  Project,
  SavedElementsValues,
  StateElement,
  Screen,
  NNBlockType,
  SCREEN_FORMATS,
  RightPanelTab,
  PropertyName,
} from '../../types';
import {
  Action,
  ActivateScreen,
  AddChildToElement,
  AddElementClassName,
  AddElements,
  AddProject,
  AddScreen,
  ChangeScreensOrder,
  ClearAfterPrevScreen,
  CopyActiveItem,
  CopyElementStyles,
  CreateElements,
  DeleteItem,
  DeleteProject,
  DeleteScreen,
  DuplicateScreen,
  ElementHistoryMeta,
  GetProject,
  GetScreenNN,
  HistoryMeta,
  LoadProjects,
  LoadProjectsSuccess,
  MoveElement,
  PasteCopiedItem,
  PopHistory,
  PopUndoAction,
  RedoAction,
  RedoWrapIntoContainer,
  RemoveElementClassName,
  RemoveElementStyles,
  RemoveNotification,
  RemoveSharedStyles,
  RenameProject,
  RenameScreen,
  ReplaceElementStyles,
  ResetScreenState,
  RestoreElement,
  RestoreElementChildren,
  RestoreScreen,
  SaveScreen,
  SetAnalyzerLoader,
  SetCurrentProjectId,
  SetCurrentScreenId,
  SetEditableStyles,
  SetGroupActionsUp,
  SetHoveredElement,
  SetItemToCopy,
  SetLoader,
  SetNotification,
  SetProject,
  SetProjectListLoader,
  SetProjectLoader,
  SetRedoActions,
  SetScenarioLoader,
  SetScreenLoader,
  SetScreens,
  SetUndoActions,
  ToggleContainersBorders,
  UndoAction,
  UnwrapFromContainer,
  UpdateElement,
  UpdateElementImage,
  UpdateElementParameters,
  UpdateElementsTree,
  UpdateElementStyles,
  UpdateProject,
  UpdateSavedElementsValues,
  UpdateSavedElementValues,
  UpdateScreen,
  UpdateSharedStyles,
  UploadFile,
  WrapIntoContainer,
} from '../types';

export const getProjectList = (): LoadProjects => ({
  type: TYPES.LOAD_PROJECTS,
});

export const setProjectList = (projects: Project[]): LoadProjectsSuccess => ({
  type: TYPES.LOAD_PROJECTS_SUCCESS,
  payload: { projects },
});

export const setProjectsData = (data: PaginatedArray<Project>) => ({
  type: TYPES.SET_PROJECTS_DATA,
  payload: data,
});

export const addProject = (name: string): AddProject => ({
  type: TYPES.ADD_PROJECT,
  payload: { name },
});

export const delProject = (id: number): DeleteProject => ({
  type: TYPES.DELETE_PROJECT,
  payload: { id },
});

export const getProject = (id: number): GetProject => ({
  type: TYPES.GET_PROJECT,
  payload: { id },
});

export const setCurrentProjectId = (
  projectId: number,
): SetCurrentProjectId => ({
  type: TYPES.SET_CURRENT_PROJECT_ID,
  payload: { projectId },
});

export const setProject = (project: Project): SetProject => ({
  type: TYPES.SET_PROJECT,
  payload: { project },
});

export const updateProject = (
  project: Project,
  meta: HistoryMeta = {},
): UpdateProject => ({
  type: TYPES.UPDATE_PROJECT,
  payload: { project },
  meta,
});

export const changeScreensOrder = (screens: Screen[]): ChangeScreensOrder => ({
  type: TYPES.CHANGE_SCREENS_ORDER,
  payload: { screens },
});

export const renameProject = (
  projectID: number,
  name: string,
): RenameProject => ({
  type: TYPES.RENAME_PROJECT,
  payload: { projectID, name },
});

export const setProjectListLoader = (
  active: boolean,
): SetProjectListLoader => ({
  type: TYPES.SET_PROJECT_LIST_LOADER,
  payload: { active },
});

export const setProjectLoader = (active: boolean): SetProjectLoader => ({
  type: TYPES.SET_PROJECT_LOADER,
  payload: { active },
});

export const setScreenLoader = (active: boolean): SetScreenLoader => ({
  type: TYPES.SET_SCREEN_LOADER,
  payload: { active },
});

export const setLoader = (active: boolean): SetLoader => ({
  type: TYPES.SET_LOADER,
  payload: { active },
});

export const setScenarioLoader = (active: boolean): SetScenarioLoader => ({
  type: TYPES.SET_SCENARIO_LOADER,
  payload: { active },
});

export const setAnalyzerLoader = (active: boolean): SetAnalyzerLoader => ({
  type: TYPES.SET_ANALYZER_LOADER,
  payload: { active },
});

export const setNotification = (text: string): SetNotification => ({
  type: TYPES.SET_NOTIFICATION,
  payload: { text },
});

export const removeNotification = (): RemoveNotification => ({
  type: TYPES.REMOVE_NOTIFICATION,
});

export const delScreen = (
  projectId: number,
  screenId: number,
  meta: HistoryMeta = {},
): DeleteScreen => ({
  type: TYPES.DELETE_SCREEN,
  payload: { projectId, screenId },
  meta,
});

export const restoreScreen = (
  screenId: number,
  projectId: number,
): RestoreScreen => ({
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
): RenameScreen => ({
  type: TYPES.RENAME_SCREEN,
  payload: { projectID, screenID, name },
});

export const addScreen = (
  projectID: number,
  name: string,
  buoyancy: number,
  skip: boolean = false,
): AddScreen => ({
  type: TYPES.ADD_SCREEN,
  payload: { projectID, name, buoyancy, skip },
});

export const duplicateScreen = (
  name: string,
  screenID: number,
): DuplicateScreen => ({
  type: TYPES.DUPLICATE_SCREEN,
  payload: { name, screenID },
});

export const activateScreen = (screenId: number): ActivateScreen => ({
  type: TYPES.ACTIVATE_SCREEN,
  payload: { screenId },
});

export const moveElement = (
  elementId: string,
  indices: Indices,
  parents: ParentIds,
  meta: ElementHistoryMeta,
): MoveElement => ({
  type: TYPES.MOVE_ELEMENT,
  payload: {
    indices,
    elementId,
    parents,
  },
  meta,
});

export const clearAfterPrevScreen = (): ClearAfterPrevScreen => ({
  type: TYPES.CLEAN_AFTER_PREV_SCREEN,
});

export const updateElementsTree = (
  chunk: Normalized<StateElement>,
  meta: ElementHistoryMeta,
): UpdateElementsTree => ({
  type: TYPES.UPDATE_ELEMENTS_TREE,
  payload: chunk,
  meta,
});

export const moveStateElement = (
  elementId: string,
  indices: Indices,
  parents: ParentIds,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.MOVE_STATE_ELEMENT,
  payload: {
    elementId,
    indices,
    parents,
  },
  meta,
});

export const updateStateElement = (
  elementId: string,
  data: Partial<StateElement>,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.UPDATE_STATE_ELEMENT,
  payload: {
    elementId,
    data,
  },
  meta,
});

export const addStateElements = (
  elements: LibraryElement<any>[],
  parentId: string,
  meta: ElementHistoryMeta,
  index?: number,
) => ({
  type: TYPES.ADD_STATE_ELEMENTS,
  payload: {
    elements,
    parentId,
    index,
  },
  meta,
});

export const insertStateElement = (
  element: LibraryElement<any>,
  parentId: string,
  childId: string,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.INSERT_STATE_ELEMENT,
  payload: {
    parentId,
    element,
    childId,
  },
  meta,
});

export const extractStateElement = (elementId: string) => ({
  type: TYPES.EXTRACT_STATE_ELEMENT,
  payload: elementId,
});

export const removeStateElement = (
  elementId: string,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.REMOVE_STATE_ELEMENT,
  payload: {
    elementId,
  },
  meta,
});

export const resetScreenState = (): ResetScreenState => ({
  type: TYPES.RESET_SCREEN_STATE,
});

export const saveScreenImage = (
  screenId: number,
  canvas: HTMLCanvasElement,
): SaveScreen => ({
  type: TYPES.SAVE_SCREEN,
  payload: {
    screenId,
    canvas,
  },
});

export const setCurrentScreenId = (screenId: number): SetCurrentScreenId => ({
  type: TYPES.SET_CURRENT_SCREEN_ID,
  payload: { screenId },
});

export const updateScreen = (screen: Screen): UpdateScreen => ({
  type: TYPES.UPDATE_SCREEN,
  payload: {
    screen,
  },
});

export const setScreens = (screens: Screen[]): SetScreens => ({
  type: TYPES.SET_SCREENS,
  payload: { screens },
});

export const updateElement = <T extends Entity>(
  elementID: string,
  data: LibraryElementPatch<T>,
  active?: boolean,
): UpdateElement => ({
  type: TYPES.UPDATE_ELEMENT,
  payload: { elementID, data, active },
});

export const toggleContainersBorders = (): ToggleContainersBorders => ({
  type: TYPES.TOGGLE_CONTAINERS_BORDERS,
});

export const updateSharedStyles = (
  className: Entity,
  styles: React.CSSProperties,
  meta: ElementHistoryMeta,
): UpdateSharedStyles => ({
  type: TYPES.UPDATE_SHARED_STYLES,
  payload: { className, styles },
  meta,
});

export const copyElementStyles = (
  elementType: Entity,
  elementID: string,
  styles: React.CSSProperties,
  meta: ElementHistoryMeta,
): CopyElementStyles => ({
  type: TYPES.COPY_ELEMENT_STYLES,
  payload: { elementType, elementID, styles },
  meta,
});

export const addElementClassName = (
  elementID: string,
  className: string,
  meta: ElementHistoryMeta,
): AddElementClassName => ({
  type: TYPES.ADD_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta,
});

export const removeElementClassName = (
  elementID: string,
  className: string,
  meta: ElementHistoryMeta,
): RemoveElementClassName => ({
  type: TYPES.REMOVE_ELEMENT_CLASSNAME,
  payload: { elementID, className },
  meta,
});

export const removeSharedStyles = (
  className: Entity,
  cssPropertiesNames: PropertyName[],
  meta: ElementHistoryMeta,
): RemoveSharedStyles => ({
  type: TYPES.REMOVE_SHARED_STYLES,
  payload: { className, cssPropertiesNames },
  meta,
});

export const replaceElementStyles = (
  id: string,
  styles: React.CSSProperties,
  meta: ElementHistoryMeta,
): ReplaceElementStyles => ({
  type: TYPES.REPLACE_ELEMENT_STYLES,
  payload: { id, styles },
  meta,
});

export const updateElementStyles = (
  id: string,
  styles: React.CSSProperties,
  meta: ElementHistoryMeta,
): UpdateElementStyles => ({
  type: TYPES.UPDATE_ELEMENT_STYLES,
  payload: { id, styles },
  meta,
});

export const removeElementStyles = (
  id: string,
  cssPropertiesNames: PropertyName[],
  meta: ElementHistoryMeta,
): RemoveElementStyles => ({
  type: TYPES.REMOVE_ELEMENT_STYLES,
  payload: { id, cssPropertiesNames },
  meta,
});

export const updateElementImage = (
  itemID: string,
  image: File,
  meta: ElementHistoryMeta,
): UpdateElementImage => ({
  type: TYPES.UPDATE_ELEMENT_IMAGE,
  payload: { itemID, image },
  meta,
});

export const updateElementParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters']
>(
  elementId: string,
  parameters: K,
  meta: ElementHistoryMeta,
): UpdateElementParameters => ({
  type: TYPES.UPDATE_ELEMENT_PARAMETERS,
  payload: { elementId, parameters },
  meta,
});

export const updateSavedElementsValues = (
  elementsValues: SavedElementsValues,
): UpdateSavedElementsValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENTS_VALUES,
  payload: { elementsValues },
});

export const updateSavedElementValues = (
  itemID: string,
  savedValue: string | boolean,
): UpdateSavedElementValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENT_VALUES,
  payload: { itemID, savedValue },
});

export const deleteItem = (
  id: string,
  meta: ElementHistoryMeta,
): DeleteItem => ({
  type: TYPES.DELETE_ITEM,
  payload: { id },
  meta,
});

export const createElements = (
  createdElements: CreatedElement[],
  meta: ElementHistoryMeta,
  parentId: string,
  index?: number,
): CreateElements => ({
  type: TYPES.CREATE_ELEMENTS,
  payload: { createdElements, parentId, index },
  meta,
});

export const addChildToElement = (
  childType: ChildEntity,
  elementID: string,
  parameters: ChildrenElements[ChildEntity]['parameters'],
  meta: ElementHistoryMeta,
): AddChildToElement => ({
  type: TYPES.ADD_CHILD_TO_ELEMENT,
  payload: { childType, elementId: elementID, parameters },
  meta,
});

export const uploadFile = (
  file: any,
  parentId: string,
  blockType: NNBlockType,
  meta: ElementHistoryMeta,
): UploadFile => ({
  type: TYPES.UPLOAD_FILE,
  payload: {
    file,
    parentId,
    blockType,
  },
  meta,
});

export const getScreenNN = (): GetScreenNN => ({
  type: TYPES.GET_SCREEN_NN,
});

export const wrapIntoContainer = (
  id: string,
  meta: ElementHistoryMeta,
): WrapIntoContainer => ({
  type: TYPES.WRAP_INTO_CONTAINER,
  payload: { id },
  meta,
});

export const setActiveElement = (id: string) => ({
  type: TYPES.SET_ACTIVE_ELEMENT_SAGA,
  payload: id,
});

export const setActiveElementId = (id: string) => ({
  type: TYPES.SET_ACTIVE_ELEMENT_ID,
  payload: id,
});

export const setHoveredElement = (id: string | null): SetHoveredElement => ({
  type: TYPES.SET_HOVERED_ELEMENT,
  payload: id,
});

export const setEditableStyles = (className: string): SetEditableStyles => ({
  type: TYPES.SET_EDITABLE_STYLES,
  payload: { className },
});

export const copyActiveItem = (): CopyActiveItem => ({
  type: TYPES.COPY_ACTIVE_ITEM,
});

export const pasteCopiedElement = (
  meta: ElementHistoryMeta,
): PasteCopiedItem => ({
  type: TYPES.PASTE_COPIED_ELEMENT,
  meta,
});

export const setItemToCopy = (id: string, screenID: number): SetItemToCopy => ({
  type: TYPES.SET_ITEM_TO_COPY,
  payload: { id, screenID },
});

export const undoAction = (): UndoAction => ({
  type: TYPES.UNDO_ACTION,
});

export const redoAction = (): RedoAction => ({
  type: TYPES.REDO_ACTION,
});

export const setUndoActions = (action: Action | Action[]): SetUndoActions => ({
  type: TYPES.SET_UNDO_ACTIONS,
  payload: action,
});

export const setRedoActions = (actions: Action[]): SetRedoActions => ({
  type: TYPES.SET_REDO_ACTIONS,
  payload: actions,
});

export const popUndoAction = (): PopUndoAction => ({
  type: TYPES.POP_UNDO_ACTION,
});

export const unwrapFromContainer = (
  elementID: string,
  wrapperID: string,
  parentID: string,
  meta: ElementHistoryMeta,
): UnwrapFromContainer => ({
  type: TYPES.UNWRAP_FROM_CONTAINER,
  payload: {
    elementId: elementID,
    wrapperId: wrapperID,
    parentId: parentID,
  },
  meta,
});

export const restoreElementChildren = (
  elementId: string,
  childrenIds: string[],
  meta: ElementHistoryMeta,
): RestoreElementChildren => ({
  type: TYPES.RESTORE_ELEMENT_CHILDREN,
  payload: {
    elementId,
    childrenIds,
  },
  meta,
});

export const restoreElement = (
  elementId: string,
  meta: ElementHistoryMeta,
): RestoreElement => ({
  type: TYPES.RESTORE_ELEMENT,
  payload: elementId,
  meta,
});

export const redoWrapIntoContainer = (
  elementId: string,
  wrapperId: string,
  parentId: string,
  meta: ElementHistoryMeta,
): RedoWrapIntoContainer => ({
  type: TYPES.REDO_WRAP_INTO_CONTAINER,
  payload: {
    elementId,
    wrapperId,
    parentId,
  },
  meta,
});

export const popHistory = (): PopHistory => ({
  type: TYPES.POP_HISTORY,
});

export const setGroupActionsUp = (groupUp: boolean): SetGroupActionsUp => ({
  type: TYPES.SET_GROUP_UP,
  payload: groupUp,
});

export const addElements = (
  elements: LibraryElement<any>[],
  parentId?: string,
): AddElements => ({
  type: TYPES.ADD_ELEMENTS,
  payload: { elements, parentId },
});

export const addBorderedElementRef = (
  id: string,
  ref: React.RefObject<HTMLElement>,
) => ({
  type: TYPES.ADD_BORDERED_ELEMENT_REF,
  payload: { id, ref },
});

export const removeBorderedElementRef = (id: string) => ({
  type: TYPES.REMOVE_BORDERED_ELEMENT_REF,
  payload: { id },
});

export const setCurrentDropTargetParams = (
  id: string | null,
  position?: DropPosition,
) => ({
  type: TYPES.SET_CURRENT_DROP_TARGET_PARAMS,
  payload: { id, position },
});

export const loadCustomElements = (initial: boolean) => ({
  type: TYPES.LOAD_CUSTOM_ELEMENTS,
  payload: { initial },
});

export const updateElementsLoading = (loading: boolean) => ({
  type: TYPES.UPDATE_CUSTOM_ELEMENTS_LOADING,
  payload: { loading },
});

export const addCustomElementsPage = (
  paginatedResult: PaginatedArray<LibraryElement<Entity>>,
  initial: boolean,
) => ({
  type: TYPES.ADD_CUSTOM_ELEMENTS_PAGE,
  payload: { paginatedResult, initial },
});

export const addCustomElement = (element: LibraryElement<Entity>) => ({
  type: TYPES.ADD_CUSTOM_ELEMENT,
  payload: { element },
});

export const removeCustomElement = (id: string) => ({
  type: TYPES.REMOVE_CUSTOM_ELEMENT,
  payload: { id },
});

export const addFileInput = (id: string, file: File) => ({
  type: TYPES.ADD_FILE_INPUT,
  payload: { id, file },
});

export const changeFreeCanvasMode = (enabled: boolean) => ({
  type: TYPES.CHANGE_FREE_CANVAS_MODE,
  payload: enabled,
});

export const updateLastElements = (
  parentId: string,
  ids: string[],
  offset: number,
) => ({
  type: TYPES.UPDATE_LAST_ELEMENTS,
  payload: {
    parentId,
    ids,
    offset,
  },
});

export const changeScreenFormat = (format: SCREEN_FORMATS) => ({
  type: TYPES.CHANGE_SCREEN_FORMAT,
  payload: format,
});

export const rotateScreenFormat = (rotated: boolean) => ({
  type: TYPES.ROTATE_SCREEN_FORMAT,
  payload: rotated,
});

export const setRightPanelActiveTab = (tabIndex: RightPanelTab) => ({
  type: TYPES.SET_RIGHT_PANEL_ACTIVE_TAB,
  payload: tabIndex,
});
