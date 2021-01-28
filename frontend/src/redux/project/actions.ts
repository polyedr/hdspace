import React from 'react';
import { DropPosition } from '@Constants/dragAndDrop';
import {
  ChildEntity,
  ChildrenElements,
  CreatedElement,
  Entity,
  Indices,
  LibraryElement,
  LibraryElementPatch,
  Normalized,
  ParentIds,
  Project,
  SavedElementsValues,
  StateElement,
  Screen,
  NNBlockType,
  SCREEN_FORMATS,
  PaginatedResponse,
  PropertyName,
} from '@Src/types';
import TYPES from '../actionTypes';
import {
  Action,
  ActivateScreen,
  AddChildToElement,
  AddElementClassName,
  AddElements,
  CreateProject,
  CreateScreen,
  ChangeScreensOrder,
  ClearAfterPrevScreen,
  CopyActiveElement,
  CopyElementStyles,
  CreateElements,
  DeleteElement,
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
  PasteCopiedElement,
  PopHistory,
  PopUndoAction,
  RedoAction,
  RedoWrapIntoContainer,
  RemoveElementClassName,
  RemoveElementStyles,
  RemoveSharedStyles,
  RenameProject,
  RenameScreen,
  ReplaceElementStyles,
  ResetProjectState,
  RestoreElement,
  RestoreElementChildren,
  RestoreScreen,
  UpdateScreenImage,
  SetAnalyzerLoader,
  SetCurrentProjectId,
  SetCurrentScreenId,
  SetEditableStyles,
  SetGroupActionsUp,
  SetHoveredElementId,
  SetElementToCopy,
  SetUpdateImageLoader,
  SetProject,
  SetProjectListLoader,
  SetProjectLoader,
  SetRedoActions,
  SetProjectCreateLoader,
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
  SetScreenCreateLoader,
  SetBordersEnabled,
  SetEditorDocument,
  AddChildrenToElement,
} from '../types';

export const getProjectList = (): LoadProjects => ({
  type: TYPES.LOAD_PROJECTS,
});

export const setProjectList = (projects: Project[]): LoadProjectsSuccess => ({
  type: TYPES.SET_PROJECT_LIST,
  payload: { projects },
});

export const setProjectsData = (data: PaginatedResponse<Project>) => ({
  type: TYPES.SET_PROJECTS_DATA,
  payload: data,
});

export const createProject = (name: string): CreateProject => ({
  type: TYPES.CREATE_PROJECT,
  payload: { name },
});

export const deleteProject = (id: number): DeleteProject => ({
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

export const setUpdateImageLoader = (
  active: boolean,
): SetUpdateImageLoader => ({
  type: TYPES.SET_UPDATE_IMAGE_LOADER,
  payload: { active },
});

export const setProjectCreateLoader = (
  active: boolean,
): SetProjectCreateLoader => ({
  type: TYPES.SET_PROJECT_CREATE_LOADER,
  payload: { active },
});

export const setAnalyzerLoader = (active: boolean): SetAnalyzerLoader => ({
  type: TYPES.SET_ANALYZER_LOADER,
  payload: { active },
});

export const deleteScreen = (
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

export const createScreen = (
  projectID: number,
  name: string,
  buoyancy: number,
  skip: boolean = false,
): CreateScreen => ({
  type: TYPES.CREATE_SCREEN,
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

export const resetProjectState = (): ResetProjectState => ({
  type: TYPES.RESET_SCREEN_STATE,
});

export const updateScreenImage = (screenId: number): UpdateScreenImage => ({
  type: TYPES.UPDATE_SCREEN_IMAGE,
  payload: {
    screenId,
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

export const setBordersEnabled = (enabled: boolean): SetBordersEnabled => ({
  type: TYPES.SET_BORDERS_ENABLED,
  payload: enabled,
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

export const deleteElement = (
  id: string,
  meta: ElementHistoryMeta,
): DeleteElement => ({
  type: TYPES.DELETE_ELEMENT,
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

export const addChildrenToElement = (
  children: {
    childType: ChildEntity;
    parameters: ChildrenElements[ChildEntity]['parameters'];
  }[],
  elementId: string,
  meta: ElementHistoryMeta,
): AddChildrenToElement => ({
  type: TYPES.ADD_CHILDREN_TO_ELEMENT,
  payload: { children, elementId },
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

export const setElementCanBeEdited = (edited: boolean) => ({
  type: TYPES.SET_ELEMENT_CAN_BE_EDITED,
  payload: edited,
});

export const setElementBeingEdited = (edited: boolean) => ({
  type: TYPES.SET_ELEMENT_BEING_EDITED,
  payload: edited,
});

export const resetElementEditState = () => ({
  type: TYPES.RESET_ELEMENT_EDIT_STATE,
});

export const setHoveredElementId = (
  id: string | null,
): SetHoveredElementId => ({
  type: TYPES.SET_HOVERED_ELEMENT,
  payload: id,
});

export const setEditableStyles = (className: string): SetEditableStyles => ({
  type: TYPES.SET_EDITABLE_STYLES,
  payload: { className },
});

export const copyActiveElement = (): CopyActiveElement => ({
  type: TYPES.COPY_ACTIVE_ELEMENT,
});

export const pasteCopiedElement = (
  meta: ElementHistoryMeta,
): PasteCopiedElement => ({
  type: TYPES.PASTE_COPIED_ELEMENT,
  meta,
});

export const setElementToCopy = (
  id: string,
  screenID: number,
): SetElementToCopy => ({
  type: TYPES.SET_ELEMENT_TO_COPY,
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
  paginatedResult: PaginatedResponse<LibraryElement<Entity>>,
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

export const setScreenCreateLoader = (
  active: boolean,
): SetScreenCreateLoader => ({
  type: TYPES.SET_SCREEN_CREATE_LOADER,
  payload: active,
});

export const convertFreeCanvas = () => ({
  type: TYPES.CONVERT_FREE_CANVAS,
});

export const importHtml = (files: File[]) => ({
  type: TYPES.IMPORT_HTML,
  payload: files,
});

export const setEditorDocument = (doc: Document): SetEditorDocument => ({
  type: TYPES.SET_EDITOR_DOCUMENT,
  payload: doc,
});
