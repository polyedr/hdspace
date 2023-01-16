import React from 'react';
import { DropPosition, ElementType } from '@Constants/dragAndDrop';
import {
  ChildEntity,
  ChildrenElements,
  CreateElementsData,
  Entity,
  Indices,
  LibraryElement,
  Normalized,
  ParentIds,
  Project,
  SavedElementsValues,
  StateElement,
  Screen,
  NNBlockType,
  Layout,
  PaginatedResponse,
  PropertyName,
  AssetsList,
  Asset,
  PaginatedArray,
  ProjectsSearchParameter,
  DateRange,
  UpdateElementData,
  StateElementsToAdd,
  VIARegion,
  UserData,
  EditScreenData,
  ProfileDataUIParameters,
  VIAData,
  FileToUpload,
  UIFramework,
  ElementData,
  NNModelName,
  VIARegions,
  canvasData,
  ParsedImagePalette,
} from '@Src/types';
import { XYCoord } from 'react-dnd';
import {
  UpdateUISettingsParameters,
  Action,
  ActivateScreen,
  AddChildToElement,
  CreateLibraryElements,
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
  GetSharedProject,
  HistoryMeta,
  LoadProjects,
  LoadProjectsSuccess,
  MoveElement,
  PasteCopiedElement,
  RedoWrapIntoContainer,
  RemoveElementClassName,
  RemoveElementStyles,
  RemoveSharedStyles,
  RemoveAsset,
  RestoreAsset,
  UpdateNameAndTagsProject,
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
  SetHoveredElementId,
  SetElementToCopy,
  SetUpdateImageLoader,
  SetProject,
  SetProjectListLoader,
  SetProjectLoader,
  SetProjectCreateLoader,
  SetScreenLoader,
  SetScreens,
  ToggleContainersBorders,
  ToggleGrid,
  ExportScreenFlag,
  UnwrapFromContainer,
  UpdateElement,
  UpdateElementImage,
  UpdateElementParameters,
  UpdateElementsTree,
  UpdateElementStyles,
  UpdateMultipleElementsParameters,
  UpdateProject,
  UpdateSavedElementsValues,
  UpdateSavedElementValues,
  UpdateScreen,
  UpdateSharedStyles,
  AutoAnalyzeImage,
  WrapIntoContainer,
  SetScreenCreateLoader,
  SetBordersEnabled,
  SetEditorDocument,
  SetAssetsListsLoader,
  UploadElementAsset,
  RemoveAssetList,
  AddChildrenToElement,
  SearchProjects,
  SetProjectSearchParameter,
  AddSelectedElement,
  RemoveSelectedElement,
  SetSelectedElements,
  UpdateMultipleElementsStyles,
  RemoveMultipleElementsStyles,
  UpdateMultipleStateElements,
  AddAssetList,
  UploadAsset,
  AddStateAsset,
  MoveStateElement,
  MoveStateElementsInside,
  SetMasterScreenId,
  SetMasterScreenLoader,
  SetMasterCoreElementId,
  SetMasterGroupsElementId,
  SetMasterElementsIds,
  WrapStateElements,
  InsertStateElement,
  UnwrapStateElements,
  StartHistoryRecord,
  RecognizeImage,
  FinishAnnotaion,
  //  CloseHistoryRecord,
  ExecuteUndoActions,
  ExecuteRedoActions,
  AddUndoActions,
  AddRedoActions,
  MoveHistoryForward,
  MoveHistoryBackward,
  AddHistoryActions,
  CreateScreenData,
  ReplaceElementParameters,
  ReplaceMultipleElementsParameters,
  WrapMultipleElementsIntoContainer,
  UploadImageByUrl,
  AddImageList,
  AddBackgroundImageList,
  UpdateStateAssetImage,
  SetSelectedAssetListId,
  RestoreMultipleElementsChildren,
  RestoreChildrenData,
  SoftDeleteMultipleElements,
  SoftDeleteElement,
  CreateGroupChildren,
  AddStateElements,
  SetVIAMode,
  SetViaRegions as SetVIARegions,
  UpdateVIARegion,
  SetActiveVIARegion,
  CreateVIARegionSuccess,
  DeleteVIARegionSuccess,
  SetAnnotatedElement,
  UpdateVIARegionLayer,
  SetNewScreenModal,
  SetUsersSearchValue,
  CreateChildElements,
  SetAnnotatedImageURL,
  CopyVIARegion,
  PasteVIARegion,
  SetPreSelectedElementId,
  SetMasterSourceElementId,
  SetSidebarOpen,
  SetSidebarHost,
  SetSidebarIframe,
  AssetData,
  SetValueImportLoader,
  setImportValue,
  EditScreenNameAndData,
  CreateVIARegion,
  DeleteVIARegion,
  RestoreVIARegion,
  UpdateVIARegionSuccess,
  UpdateVIARegionLayerSuccess,
  SetVIAResultId,
  SetVIAData,
  SetBlockType,
  UpdateCurrentUIFramework,
  ProcessDropTargetParams,
  ProcessDropElement,
  SetEnabledPseudoClass,
  ReplaceMultipleElementsStyles,
  SetStatePseudoClass,
  LoadAssetLists,
  LoadAssets,
  ImageData,
  UpdateDefaultStyles,
  GenerateImagePalette,
  SetImagePalette,
  UpdateLayoutProjects,
  ProjectError,
} from '../types';

import TYPES from '../actionTypes';

export const getProjectList = (): LoadProjects => ({
  type: TYPES.LOAD_PROJECTS,
});

export const setUsersSearchValue = (search: string): SetUsersSearchValue => ({
  type: TYPES.SET_USERS_SEARCH,
  payload: { search },
});

export const searchProjects = (): SearchProjects => ({
  type: TYPES.SEARCH_PROJECTS,
});

export const setProjectsSearchParameter = (
  parameter: [ProjectsSearchParameter, string | DateRange],
): SetProjectSearchParameter => ({
  type: TYPES.SET_PROJECT_SEARCH_PARAMETER,
  payload: parameter,
});

export const setProjectList = (projects: Project[]): LoadProjectsSuccess => ({
  type: TYPES.SET_PROJECT_LIST,
  payload: { projects },
});

export const setProjectsData = (data: PaginatedResponse<Project>) => ({
  type: TYPES.SET_PROJECTS_DATA,
  payload: data,
});

export const setProjectUsersData = (data: PaginatedResponse<UserData>) => ({
  type: TYPES.SET_PROJECT_USERS_DATA,
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
export const getSharedProject = (
  shortuuid_token: string,
): GetSharedProject => ({
  type: TYPES.GET_SHARED_PROJECT,
  payload: { shortuuid_token },
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

export const updateCurrentUIFramework = (
  uiFramework: UIFramework,
): UpdateCurrentUIFramework => ({
  type: TYPES.UPDATE_CURRENT_UI_FRAMEWORK,
  payload: { uiFramework },
});

export const updateCurrentUIFrameworkVariables = (
  variables: Record<string, string>,
) => ({
  type: TYPES.UPDATE_CURRENT_UI_FRAMEWORK_VARIABLES,
  payload: variables,
});

export const setProjectError = (errorResponse): ProjectError => ({
  type: TYPES.SET_PROJECT_ERROR,
  payload: { errorResponse },
});

export const resetCurrentUIFrameworkVariables = () => ({
  type: TYPES.RESET_CURRENT_UI_FRAMEWORK_VARIABLES,
});

export const changeScreensOrder = (indices: Indices): ChangeScreensOrder => ({
  type: TYPES.CHANGE_SCREENS_ORDER,
  payload: indices,
});

export const updateNameAndTagsProject = (
  projectID: number,
  name: string,
  tags: any,
): UpdateNameAndTagsProject => ({
  type: TYPES.UPDATE_NAME_AND_TAGS_PROJECT,
  payload: { projectID, name, tags },
});

export const updateLayoutProject = (
  projectID: number,
  projectDataJson: string,
): UpdateLayoutProjects => ({
  type: TYPES.UPDATE_LAYOUT_PROJECT,
  payload: { projectID, projectDataJson },
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

export const setMasterScreenLoader = (
  active: boolean,
): SetMasterScreenLoader => ({
  type: TYPES.SET_MASTER_SCREEN_LOADER,
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

export const setAssetsListsLoader = (
  active: boolean,
): SetAssetsListsLoader => ({
  type: TYPES.SET_ASSETS_LISTS_LOADER,
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
  meta: HistoryMeta,
): RestoreScreen => ({
  type: TYPES.RESTORE_SCREEN,
  payload: {
    screenId,
    projectId,
  },
  meta,
});

export const editScreenNameAndData = (
  projectID: number,
  screenID: number,
  editData: EditScreenData,
): EditScreenNameAndData => ({
  type: TYPES.EDIT_SCREEN_NAME_AND_DATA,
  payload: {
    projectID,
    screenID,
    editData,
  },
});

export const setEditableScreen = (idScreen: number) => ({
  type: TYPES.SET_EDITABLE_SCREEN,
  payload: idScreen,
});

export const clearEditableScreen = (screen: Screen) => ({
  type: TYPES.CLEAR_EDITABLE_SCREEN,
  payload: screen,
});

export const createScreen = (
  { projectID, name, buoyancy, rootName, freeCanvas, styles }: CreateScreenData,
  meta?: HistoryMeta,
): CreateScreen => ({
  type: TYPES.CREATE_SCREEN,
  payload: { projectID, name, buoyancy, rootName, freeCanvas, styles },
  meta,
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
): MoveStateElement => ({
  type: TYPES.MOVE_STATE_ELEMENT,
  payload: {
    elementId,
    indices,
    parents,
  },
  meta,
});

export const moveStateElementsInside = (
  ids: string[],
  parents: ParentIds,
  meta: ElementHistoryMeta,
): MoveStateElementsInside => ({
  type: TYPES.MOVE_STATE_ELEMENTS_INSIDE,
  payload: {
    ids,
    parents,
  },
  meta,
});

export const updateStateElement = (
  elementId: string,
  data: Partial<StateElement>,
) => ({
  type: TYPES.UPDATE_STATE_ELEMENT,
  payload: {
    elementId,
    data,
  },
});

// add new elements to existing ones
export const addStateElements = (
  stateElementsToAdd: Array<StateElementsToAdd<Entity>>,
  meta: ElementHistoryMeta,
): AddStateElements => ({
  type: TYPES.ADD_STATE_ELEMENTS,
  payload: {
    elements: stateElementsToAdd,
  },
  meta,
});

// insert new element in the tree between existing parent and child elements
export const insertStateElement = (
  element: LibraryElement<any>,
  parentId: string,
  childId: string,
  meta: ElementHistoryMeta,
): InsertStateElement => ({
  type: TYPES.INSERT_STATE_ELEMENT,
  payload: {
    parentId,
    element,
    childId,
  },
  meta,
});

export const wrapStateElements = (
  element: LibraryElement<any>,
  parentId: string,
  childIds: string[],
  meta: ElementHistoryMeta,
): WrapStateElements => ({
  type: TYPES.WRAP_STATE_ELEMENTS,
  payload: {
    parentId,
    element,
    childIds,
  },
  meta,
});

export const unwrapStateElements = (
  ids: string[],
  parentId: string,
  wrapperId: string,
  meta: ElementHistoryMeta,
): UnwrapStateElements => ({
  type: TYPES.UNWRAP_STATE_ELEMENTS,
  payload: {
    childIds: ids,
    parentId,
    wrapperId,
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
  { elementID, data, active }: UpdateElementData<T>,
  meta?: HistoryMeta,
): UpdateElement => ({
  type: TYPES.UPDATE_ELEMENT,
  payload: { elementID, data, active },
  meta: meta || {},
});

export const toggleContainersBorders = (
  enabled: boolean,
): ToggleContainersBorders => ({
  type: TYPES.TOGGLE_CONTAINERS_BORDERS,
  payload: enabled,
});

export const toggleGrid = (enabled: boolean): ToggleGrid => ({
  type: TYPES.TOGGLE_GRID,
  payload: enabled,
});

export const exportScreenFlag = (enabled: boolean): ExportScreenFlag => ({
  type: TYPES.EXPORT_SCREEN_FLAG,
  payload: enabled,
});

export const setBordersEnabled = (enabled: boolean): SetBordersEnabled => ({
  type: TYPES.SET_BORDERS_ENABLED,
  payload: enabled,
});

export const updateDefaultStyles = (
  classNames: Entity[],
  styles: React.CSSProperties,
  controlKey: string,
  meta: ElementHistoryMeta,
): UpdateDefaultStyles => ({
  type: TYPES.UPDATE_DEFAULT_STYLES,
  payload: { classNames, styles, controlKey },
  meta,
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

export const updateMultipleStateElements = (
  elements: Normalized<StateElement>,
): UpdateMultipleStateElements => ({
  type: TYPES.UPDATE_MULTIPLE_STATE_ELEMENTS,
  payload: { elements },
});

export const updateMultipleElementsStyles = (
  ids: string[],
  styles: Record<string, React.CSSProperties>,
  meta: ElementHistoryMeta,
): UpdateMultipleElementsStyles => ({
  type: TYPES.UPDATE_MULTIPLE_ELEMENTS_STYLES,
  payload: { ids, styles },
  meta,
});

export const replaceMultipleElementsStyles = (
  ids: string[],
  styles: Record<string, React.CSSProperties>,
  meta: ElementHistoryMeta,
): ReplaceMultipleElementsStyles => ({
  type: TYPES.REPLACE_MULTIPLE_ELEMENTS_STYLES,
  payload: {
    ids,
    styles,
  },
  meta,
});

export const removeMultipleElementsStyles = (
  ids: string[],
  cssPropertiesNames: string[],
  meta: ElementHistoryMeta,
): RemoveMultipleElementsStyles => ({
  type: TYPES.REMOVE_MULTIPLE_ELEMENTS_STYLES,
  payload: { ids, cssPropertiesNames },
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

export const uploadElementAsset = (
  elementId: string,
  { file, imageURL, useInBackground }: AssetData,
  listId: string,
  meta?: ElementHistoryMeta,
): UploadElementAsset => ({
  type: TYPES.UPLOAD_ELEMENT_ASSET,
  payload: {
    elementId,
    asset: {
      file,
      imageURL,
      useInBackground,
    },
    listId,
  },
  meta,
});

export const updateElementParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters'],
>(
  elementId: string,
  parameters: K,
  meta: ElementHistoryMeta,
): UpdateElementParameters => ({
  type: TYPES.UPDATE_ELEMENT_PARAMETERS,
  payload: {
    elementId,
    parameters,
  },
  meta,
});

export const replaceElementParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters'],
>(
  elementId: string,
  parameters: K,
  meta: ElementHistoryMeta,
): ReplaceElementParameters => ({
  type: TYPES.REPLACE_ELEMENT_PARAMETERS,
  payload: {
    elementId,
    parameters,
  },
  meta,
});

export const updateMultipleElementsParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters'],
>(
  ids: string[],
  parameters: Record<string, K>,
  meta: ElementHistoryMeta,
): UpdateMultipleElementsParameters => ({
  type: TYPES.UPDATE_MULTIPLE_ELEMENTS_PARAMETERS,
  payload: {
    ids,
    parameters,
  },
  meta,
});

export const replaceMultipleElementsParameters = <
  T extends Entity,
  K extends LibraryElement<T>['parameters'],
>(
  ids: string[],
  parameters: Record<string, K>,
  meta: ElementHistoryMeta,
): ReplaceMultipleElementsParameters => ({
  type: TYPES.REPLACE_MULTIPLE_ELEMENTS_PARAMETERS,
  payload: {
    ids,
    parameters,
  },
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

export const softDeleteElement = (
  id: string,
  meta: ElementHistoryMeta,
): SoftDeleteElement => ({
  type: TYPES.SOFT_DELETE_ELEMENT,
  payload: { id },
  meta,
});

export const softDeleteMultipleElements = (
  ids: string[],
  meta: ElementHistoryMeta,
): SoftDeleteMultipleElements => ({
  type: TYPES.SOFT_DELETE_MULTIPLE_ELEMENTS,
  payload: { ids },
  meta,
});

export const createChildElements = (
  { createdElements, parentId, index }: CreateElementsData,
  meta: ElementHistoryMeta,
): CreateChildElements => ({
  type: TYPES.CREATE_CHILD_ELEMENTS,
  payload: { createdElements, parentId, index },
  meta,
});

export const createGroupChildren = (
  { createdElements, parentId, index }: CreateElementsData,
  meta: ElementHistoryMeta,
): CreateGroupChildren => ({
  type: TYPES.CREATE_GROUP_CHILDREN,
  payload: { createdElements, parentId, index },
  meta,
});

export const createLibraryElements = (
  { createdElements, parentId, index }: CreateElementsData,
  meta: ElementHistoryMeta,
): CreateLibraryElements => ({
  type: TYPES.CREATE_LIBRARY_ELEMENTS,
  payload: { createdElements, parentId, index },
  meta,
});

export const createElements = (
  { createdElements, parentId, index }: CreateElementsData,
  meta: ElementHistoryMeta,
): CreateElements => ({
  type: TYPES.CREATE_ELEMENTS,
  payload: { createdElements, parentId, index },
  meta,
});

export const addChildrenToElement = (
  children: Array<{
    childType: ChildEntity;
    parameters: ReturnType<ChildrenElements[ChildEntity]>['parameters'];
  }>,
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
  parameters: Partial<ReturnType<ChildrenElements[ChildEntity]>['parameters']>,
  meta: ElementHistoryMeta,
): AddChildToElement => ({
  type: TYPES.ADD_CHILD_TO_ELEMENT,
  payload: { childType, elementId: elementID, parameters },
  meta,
});

export const autoAnalyzeImage = (
  file: FileToUpload,
  parentId: string,
  blockType: NNBlockType,
  meta: ElementHistoryMeta,
): AutoAnalyzeImage => ({
  type: TYPES.AUTO_ANALYZE_IMAGE,
  payload: {
    file,
    parentId,
    blockType,
  },
  meta,
});

export const recognizeImage = (
  file: FileToUpload,
  parentId: string,
  blockType: NNBlockType,
): RecognizeImage => ({
  type: TYPES.RECOGNIZE_IMAGE,
  payload: {
    file,
    parentId,
    blockType,
  },
});

export const wrapIntoContainer = (
  id: string,
  meta: ElementHistoryMeta,
): WrapIntoContainer => ({
  type: TYPES.WRAP_INTO_CONTAINER,
  payload: { id },
  meta,
});

export const wrapMultipleElementsIntoContainer = (
  ids: string[],
  meta: ElementHistoryMeta,
): WrapMultipleElementsIntoContainer => ({
  type: TYPES.WRAP_MULTIPLE_ELEMENTS_INTO_CONTAINER,
  payload: { ids },
  meta,
});

export const setActiveElement = (id: string) => ({
  type: TYPES.SET_ACTIVE_ELEMENT_SAGA,
  payload: id,
});

export const setActiveNNModel = (model: NNModelName) => ({
  type: TYPES.SET_ACTIVE_NN_MODEL,
  payload: { model },
});

export const isLibraryTab = (isLibraryTab: Boolean) => ({
  type: TYPES.IS_LIBRARY_TAB,
  payload: { isLibraryTab },
});

export const setActiveElementId = (id: string) => ({
  type: TYPES.SET_ACTIVE_ELEMENT_ID,
  payload: id,
});

export const setPreSelectedElementId = (
  id: string | null,
): SetPreSelectedElementId => ({
  type: TYPES.SET_PRESELECTED_ELEMENT_ID,
  payload: id,
});

export const setMasterSourceElementId = (
  id: string | null,
): SetMasterSourceElementId => ({
  type: TYPES.SET_MASTER_SOURCE_ELEMENT_ID,
  payload: id,
});

export const setHoveredElementId = (
  id: string | null,
): SetHoveredElementId => ({
  type: TYPES.SET_HOVERED_ELEMENT,
  payload: id,
});

export const setMasterCoreElementId = (id = '-1'): SetMasterCoreElementId => ({
  type: TYPES.SET_MASTER_CORE_ELEMENT_ID,
  payload: { id },
});

export const setMasterGroupsElementId = (
  id = '-1',
): SetMasterGroupsElementId => ({
  type: TYPES.SET_MASTER_GROUPS_ELEMENT_ID,
  payload: { id },
});

export const setMasterElementsIds = (
  masterCoreId = '-1',
  masterGroupsId = '-1',
): SetMasterElementsIds => ({
  type: TYPES.SET_MASTER_ELEMENTS_IDS,
  payload: {
    masterCoreId,
    masterGroupsId,
  },
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

export const unwrapFromContainer = (
  ids: string[],
  wrapperID: string,
  parentID: string,
  meta: ElementHistoryMeta,
): UnwrapFromContainer => ({
  type: TYPES.UNWRAP_FROM_CONTAINER,
  payload: {
    ids,
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

export const restoreMultipleElementsChildren = (
  elements: RestoreChildrenData[],
  meta: ElementHistoryMeta,
): RestoreMultipleElementsChildren => ({
  type: TYPES.RESTORE_MULTIPLE_ELEMENTS_CHILDREN,
  payload: { elements },
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
  ids: string[],
  wrapperId: string,
  parentId: string,
  meta: ElementHistoryMeta,
): RedoWrapIntoContainer => ({
  type: TYPES.REDO_WRAP_INTO_CONTAINER,
  payload: {
    ids,
    wrapperId,
    parentId,
  },
  meta,
});

export const addElements = (
  elements: Array<LibraryElement<any>>,
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

export const changeLayout = (layout: Layout) => ({
  type: TYPES.CHANGE_LAYOUT,
  payload: layout,
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

export const importHtml = (importHtmlData: canvasData) => ({
  type: TYPES.IMPORT_HTML,
  payload: {
    importHtmlData,
  },
});

export const checkImportHTML = (files: File[], url?: string) => ({
  type: TYPES.IMPORT_HTML_CHECK,
  payload: {
    files,
    url,
  },
});

export const uploadUrlForCheckRobots = (url: string) => ({
  type: TYPES.UPLOAD_URL_CHECK_ROBOTS,
  payload: url,
});

export const setValueCheckRobots = (value: boolean) => ({
  type: TYPES.SET_VALUE_CHECK_ROBOTS,
  payload: value,
});

export const setValueImportLoader = (value: boolean): SetValueImportLoader => ({
  type: TYPES.SET_VALUE_IMPORT_LOADER,
  payload: value,
});

export const setValueImport = (value: any): setImportValue => ({
  type: TYPES.SET_IMPORT_VALUE,
  payload: value,
});

export const setEditorDocument = (doc: Document): SetEditorDocument => ({
  type: TYPES.SET_EDITOR_DOCUMENT,
  payload: doc,
});

export const loadAssetLists = (projectId: string): LoadAssetLists => ({
  type: TYPES.LOAD_ASSET_LISTS,
  payload: projectId,
});

export const loadAssets = (selectedListId: string): LoadAssets => ({
  type: TYPES.LOAD_ASSETS,
  payload: {
    selectedListId,
  },
});

export const setAssetLists = (
  assetLists: PaginatedArray<AssetsList> | null,
) => ({
  type: TYPES.SET_ASSET_LISTS,
  payload: assetLists,
});

export const addAssetList = (
  name: string,
  meta?: HistoryMeta,
): AddAssetList => ({
  type: TYPES.ADD_ASSET_LIST,
  payload: { name },
  meta,
});

export const removeAssetList = (
  id: string,
  meta?: HistoryMeta,
): RemoveAssetList => ({
  type: TYPES.REMOVE_ASSET_LIST,
  payload: id,
  meta,
});

export const removeAsset = (
  id: string,
  listId: string,
  meta?: HistoryMeta,
): RemoveAsset => ({
  type: TYPES.REMOVE_ASSET,
  payload: { id, listId },
  meta,
});

export const restoreAsset = (
  asset: Asset,
  listId: string,
  meta?: HistoryMeta,
): RestoreAsset => ({
  type: TYPES.RESTORE_ASSET,
  payload: { asset, listId },
  meta,
});

export const removeAssetListRedux = (id: string) => ({
  type: TYPES.REMOVE_ASSET_LIST_REDUX,
  payload: id,
});
export const removeAssetRedux = (id: string, listId: string) => ({
  type: TYPES.REMOVE_ASSET_REDUX,
  payload: { id, listId },
});

export const addAssetListToState = (list: AssetsList, meta?: HistoryMeta) => ({
  type: TYPES.ADD_STATE_ASSET_LIST,
  payload: list,
  meta,
});

export const uploadAsset = (
  assetFile: any,
  listId?: string,
  meta?: HistoryMeta,
): UploadAsset => ({
  type: TYPES.UPLOAD_ASSET,
  payload: {
    listId,
    assetFile,
  },
  meta,
});

export const setAssets = (listId: string, assets: PaginatedArray<Asset>) => ({
  type: TYPES.SET_ASSETS,
  payload: {
    listId,
    assets,
  },
});

export const uploadIcoScreen = (file: any, project: number, id: number) => ({
  type: TYPES.UPLOAD_ICO_SCREEN,
  payload: {
    file,
    project,
    id,
  },
});

export const addAssetToState = (
  listId: string,
  asset: Asset,
  meta?: HistoryMeta,
): AddStateAsset => ({
  type: TYPES.ADD_STATE_ASSET,
  payload: {
    listId,
    asset,
  },
  meta,
});

export const setSelectedAssetListId = (
  listId: string | null,
): SetSelectedAssetListId => ({
  type: TYPES.SET_SELECTED_ASSET_LIST_ID,
  payload: {
    assetListId: listId,
  },
});

export const addSelectedElement = (id: string): AddSelectedElement => ({
  type: TYPES.ADD_SELECTED_ELEMENT,
  payload: { id },
});

export const removeSelectedElement = (id: string): RemoveSelectedElement => ({
  type: TYPES.REMOVE_SELECTED_ELEMENT,
  payload: { id },
});

export const setSelectedElements = (ids: string[]): SetSelectedElements => ({
  type: TYPES.SET_SELECTED_ELEMENTS,
  payload: { ids },
});

export const toggleSelectedElement = (id: string) => ({
  type: TYPES.TOGGLE_SELECTED_ELEMENT_SAGA,
  payload: { id },
});

export const setMasterScreenId = (
  screenId: number | null,
): SetMasterScreenId => ({
  type: TYPES.SET_MASTER_SCREEN_ID,
  payload: screenId,
});

export const setCanCreateGroup = (canCreateGroup: boolean) => ({
  type: TYPES.SET_CAN_CREATE_GROUP,
  payload: canCreateGroup,
});

export const createElementsGroup = (
  name: string,
  ids: string[],
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.CREATE_ELEMENTS_GROUP,
  payload: { name, ids },
  meta,
});

export const removeGroupBindings = (
  ids: string[],
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.REMOVE_GROUP_BINDING,
  payload: { ids },
  meta,
});

// history actions
export const startHistoryRecord = (source: Action): StartHistoryRecord => ({
  type: TYPES.START_HISTORY_RECORD,
  payload: { source },
});

export const addUndoActions = (actions: Action | Action[]): AddUndoActions => ({
  type: TYPES.ADD_UNDO_ACTIONS,
  payload: { actions: Array.isArray(actions) ? actions : [actions] },
});

export const addRedoActions = (actions: Action | Action[]): AddRedoActions => ({
  type: TYPES.ADD_REDO_ACTIONS,
  payload: { actions: Array.isArray(actions) ? actions : [actions] },
});

export const addHistoryActions = ({ undo, redo }): AddHistoryActions => ({
  type: TYPES.ADD_HISTORY_ACTIONS,
  payload: { undo, redo },
});

export const executeUndoActions = (): ExecuteUndoActions => ({
  type: TYPES.EXECUTE_UNDO_ACTIONS,
});

export const executeRedoActions = (): ExecuteRedoActions => ({
  type: TYPES.EXECUTE_REDO_ACTIONS,
});

export const moveHistoryForward = (): MoveHistoryForward => ({
  type: TYPES.MOVE_HISTORY_FORWARD,
});

export const moveHistoryBackward = (): MoveHistoryBackward => ({
  type: TYPES.MOVE_HISTORY_BACKWARD,
});

export const uploadImageByUrl = (
  elementId: string,
  imageData: ImageData,
  listId: string,
  meta: ElementHistoryMeta,
): UploadImageByUrl => ({
  type: TYPES.UPLOAD_IMAGE_BY_URL,
  payload: { elementId, imageData, listId },
  meta,
});

export const setImageList = (valueImage: boolean): AddImageList => ({
  type: TYPES.SET_IMAGE_LIST,
  payload: { valueImage },
});

export const setBackgroundList = (
  backGroundValue: boolean,
): AddBackgroundImageList => ({
  type: TYPES.SET_BACKGROUND_LIST,
  payload: { backGroundValue },
});

export const updateStateAssetImage = (
  assetId: string,
  listId: string,
  imageUrl: string,
  meta: HistoryMeta,
): UpdateStateAssetImage => ({
  type: TYPES.UPDATE_STATE_ASSET_IMAGE,
  payload: { assetId, listId, imageUrl },
  meta,
});

export const unbindGroupElementStyles = (
  id: string,
  styles: React.CSSProperties,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.UNBIND_GROUP_ELEMENT_STYLES,
  payload: {
    id,
    styles,
  },
  meta,
});

export const unbindMasterGroupInstance = (
  id: string,
  meta: ElementHistoryMeta,
) => ({
  type: TYPES.UNBIND_MASTER_INSTANCE,
  payload: { id },
  meta,
});

export const setVIAMode = (active: boolean): SetVIAMode => ({
  type: TYPES.SET_VIA_MODE,
  payload: active,
});

export const setVIARegions = (regions: VIARegions): SetVIARegions => ({
  type: TYPES.SET_VIA_REGIONS,
  payload: regions,
});

export const updateVIARegion = (
  regionId: string,
  data: Partial<VIARegion>,
  meta?: HistoryMeta,
): UpdateVIARegion => ({
  type: TYPES.UPDATE_VIA_REGION,
  payload: {
    id: regionId,
    data,
  },
  meta,
});

export const updateVIARegionSuccess = (
  regionId: string,
  data: Partial<VIARegion>,
): UpdateVIARegionSuccess => ({
  type: TYPES.UPDATE_VIA_REGION_SUCCESS,
  payload: {
    id: regionId,
    data,
  },
});

export const setActiveVIARegion = (
  id: string,
  isUpdatingLayer: boolean,
): SetActiveVIARegion => ({
  type: TYPES.SET_ACTIVE_VIA_REGION,
  payload: {
    id,
    isUpdatingLayer,
  },
});

export const createVIARegion = (meta?: HistoryMeta): CreateVIARegion => ({
  type: TYPES.CREATE_VIA_REGION,
  meta,
});

export const createVIARegionSuccess = (
  region: VIARegion,
): CreateVIARegionSuccess => ({
  type: TYPES.CREATE_VIA_REGION_SUCCESS,
  payload: region,
});

export const restoreVIARegion = (
  region: VIARegion,
  meta?: HistoryMeta,
): RestoreVIARegion => ({
  type: TYPES.RESTORE_VIA_REGION,
  payload: region,
  meta,
});

export const deleteVIARegion = (
  id?: string,
  meta?: HistoryMeta,
): DeleteVIARegion => ({
  type: TYPES.DELETE_VIA_REGION,
  payload: id,
  meta,
});

export const deleteVIARegionSuccess = (id: string): DeleteVIARegionSuccess => ({
  type: TYPES.DELETE_VIA_REGION_SUCCESS,
  payload: id,
});

export const assembleVIARegions = () => ({
  type: TYPES.ASSEMBLE_VIA_REGIONS,
});

export const setAnnotatedElementId = (id: string): SetAnnotatedElement => ({
  type: TYPES.SET_ANNOTATED_ELEMENT_ID,
  payload: id,
});

export const setVIAResultId = (id: string): SetVIAResultId => ({
  type: TYPES.SET_VIA_RESULT_ID,
  payload: id,
});

export const updateVIARegionLayer = (
  id: string,
  layer: number,
  meta?: HistoryMeta,
): UpdateVIARegionLayer => ({
  type: TYPES.UPDATE_VIA_REGION_LAYER,
  payload: { id, layer },
  meta,
});

export const updateVIARegionLayerSuccess = (
  id: string,
  layer: number,
): UpdateVIARegionLayerSuccess => ({
  type: TYPES.UPDATE_VIA_REGION_LAYER_SUCCESS,
  payload: {
    id,
    layer,
  },
});

export const setAnnotatedImageFile = (
  file: FileToUpload,
): SetAnnotatedImageURL => ({
  type: TYPES.SET_ANNOTATED_IMAGE_URL,
  payload: file,
});

export const setVIAData = (value: VIAData): SetVIAData => ({
  type: TYPES.SET_VIA_DATA,
  payload: {
    value,
  },
});

export const setBlockType = (blockType: NNBlockType): SetBlockType => ({
  type: TYPES.SET_BLOCK_TYPE,
  payload: blockType,
});

export const cancelRecognizing = () => ({
  type: TYPES.CANCEL_RECOGNIZING,
});

export const finishAnnotation = (): FinishAnnotaion => ({
  type: TYPES.FINISH_ANNOTATION,
});

export const copyVIARegion = (): CopyVIARegion => ({
  type: TYPES.COPY_VIA_REGION,
});

export const pasteVIARegion = (): PasteVIARegion => ({
  type: TYPES.PASTE_VIA_REGION,
});

export const setNewScreenModal = (open: boolean): SetNewScreenModal => ({
  type: TYPES.SET_NEW_SCREEN_MODAL,
  payload: open,
});

export const setSidebarOpen = (open: boolean): SetSidebarOpen => ({
  type: TYPES.SET_SIDEBAR_OPEN,
  payload: open,
});

export const setUpSidebar = (iframe: HTMLIFrameElement, host: string) => ({
  type: TYPES.SET_UP_SIDEBAR,
  payload: {
    iframe,
    host,
  },
});

export const setSidebarIframe = (
  iframe: HTMLIFrameElement | null,
): SetSidebarIframe => ({
  type: TYPES.SET_SIDEBAR_IFRAME,
  payload: iframe,
});

export const setSidebarHost = (host: string): SetSidebarHost => ({
  type: TYPES.SET_SIDEBAR_HOST,
  payload: host,
});

export const updateUISettingsParameters = (
  uiParameters: Partial<ProfileDataUIParameters>,
): UpdateUISettingsParameters => ({
  type: TYPES.UPDATE_UI_SETTINGS_PARAMETERS,
  payload: uiParameters,
});

export const processDropTargetParams = (
  elementId: string,
  rect: DOMRect,
  isHorizontal: boolean,
  offset: XYCoord,
): ProcessDropTargetParams => ({
  type: TYPES.PROCESS_DROP_TARGET_PARAMS,
  payload: {
    elementId,
    rect,
    isHorizontal,
    offset,
  },
});

export const processDropElement = (
  dragSource: StateElement | ElementData,
  dropType: ElementType,
): ProcessDropElement => ({
  type: TYPES.PROCESS_DROP_ELEMENT,
  payload: {
    dragSource,
    dropType,
  },
});

export const setEnabledPseudoClass = (
  pseudoClass: string | null,
  elementId?: string | null,
): SetEnabledPseudoClass => ({
  type: TYPES.SET_ENABLED_PSEUDO_CLASS,
  payload: {
    pseudoClass,
    elementId,
  },
});

export const setStatePseudoClass = (
  pseudoClass: string | null,
): SetStatePseudoClass => ({
  type: TYPES.SET_STATE_PSEUDO_CLASS,
  payload: pseudoClass,
});

export const generateImagePalette = (
  imageUrl: string,
): GenerateImagePalette => ({
  type: TYPES.GENERATE_IMAGE_PALETTE,
  payload: imageUrl,
});

export const setImagePalette = (
  imagePalette: ParsedImagePalette,
): SetImagePalette => ({
  type: TYPES.SET_IMAGE_PALETTE,
  payload: imagePalette,
});
