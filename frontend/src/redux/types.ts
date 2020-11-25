import { RouterState } from 'connected-react-router';
import React from 'react';
import { OptionsObject, SnackbarKey } from 'notistack';
import {
  BorderedElementsRef,
  CreatedElement,
  DropTargetParams,
  Entity,
  Indices,
  ItemToCopyInfo,
  TokenPair,
  LibraryElement,
  LibraryElementPatch,
  NNBlockType,
  Normalized,
  PaginatedArray,
  PaginatedData,
  ParentIds,
  Project,
  PropertyName,
  RightPanelTab,
  SavedElementsValues,
  Screen,
  SCREEN_FORMATS,
  ServerStructType,
  StateElement,
  TotalUserData,
  UploadedImageInfo,
} from '../types';
import TYPES from './actionTypes';
import { DropPosition } from '../constants/dragAndDrop';

export type ProjectDataState = {
  projectsData: PaginatedData<Project>;
  screens: Normalized<Screen>;
  elements: Normalized<StateElement>;
  customElementsData: PaginatedArray<LibraryElement<Entity>>;
  elementInputs: { [id: string]: File };
};

export type ProjectUiState = {
  editableStyles: string;
  itemToCopyInfo: ItemToCopyInfo | null;
  rightPanel: {
    activeTab: RightPanelTab;
  };
  savedElementsValues: SavedElementsValues;
  showContainersBorders: boolean;
  borderedElementsRef: BorderedElementsRef;
  currentDropTargetParams: DropTargetParams | null;
  elementCanBeEdited: boolean;
  elementBeingEdited: boolean;
  screenFormat: {
    format: SCREEN_FORMATS;
    rotated: boolean;
  };
};

export type ProjectEditState = {
  currentProjectId: number;
  currentScreenId: number;
  activeElementId: string;
  hoveredElementId: string;
  uploadedImageInfo?: UploadedImageInfo;
  freeCanvas: {
    enabled: boolean;
    lastElements: {
      [id: string]: {
        offset: number;
        elements: string[];
      };
    };
  };
};

export type ProjectCommunicationState = {
  screenCreateLoader: boolean;
  updateImageLoader: boolean;
  screenLoader: boolean; // TODO: make sure this loader is useless
  projectLoader: boolean;
  projectCreateLoader: boolean;
  analyzerLoader: boolean;
};

export type ProjectControlState = {
  undoActions: Action[] | Action[][];
  redoActions: Action[];
  history: Action[];
  groupActionsUp: boolean;
};

export type ProjectState = {
  data: ProjectDataState;
  ui: ProjectUiState;
  edit: ProjectEditState;
  communication: ProjectCommunicationState;
  control: ProjectControlState;
};

export type UserState = {
  isLPanelMinimized: boolean;
  isPrototypeMode: boolean;
  freeCanvasMode: {
    enabled: boolean;
  };
  tokenPair: TokenPair;
  isTokenLoaded: boolean;
  isLoggedIn: boolean;
  error: Error | null;
  userData: TotalUserData;
  restorePasswordEmail?: string;
  restoreUserId?: number;
  isLoading: boolean;
  confirmMessage: string;
};

export type Notification = {
  key: SnackbarKey;
  message: string;
  dismissed?: boolean;
  options?: OptionsObject;
};

export type NotificationState = {
  notifications: Notification[];
};

export type AppReduxState = {
  user: UserState;
  project: ProjectState;
  router: RouterState;
  notification: NotificationState;
};

export type LoadProjects = IPlainAction<typeof TYPES.LOAD_PROJECTS>;
export type LoadProjectsSuccess = IAction<
  typeof TYPES.SET_PROJECT_LIST,
  { projects: Project[] }
>;
export type LoadProjectsFail = IPlainFailAction<'PROJECTS:LOAD_PROJECTS_FAIL'>;

export type CreateProject = IAction<
  typeof TYPES.CREATE_PROJECT,
  { name: string }
>;
export type DeleteProject = IAction<
  typeof TYPES.DELETE_PROJECT,
  { id: number }
>;
export type GetProject = IAction<typeof TYPES.GET_PROJECT, { id: number }>;
export type SetCurrentProjectId = IAction<
  typeof TYPES.SET_CURRENT_PROJECT_ID,
  { projectId: number }
>;
export type SetProject = IAction<
  typeof TYPES.SET_PROJECT,
  { project: Project }
>;
export type UpdateProject = IAction<
  typeof TYPES.UPDATE_PROJECT,
  { project: Project }
>;
export type ChangeScreensOrder = IAction<
  typeof TYPES.CHANGE_SCREENS_ORDER,
  { screens: Screen[] }
>;
export type RenameProject = IAction<
  typeof TYPES.RENAME_PROJECT,
  { projectID: number; name: string }
>;
export type SetProjectListLoader = IAction<
  typeof TYPES.SET_PROJECT_LIST_LOADER,
  { active: boolean }
>;
export type SetProjectLoader = IAction<
  typeof TYPES.SET_PROJECT_LOADER,
  { active: boolean }
>;
export type SetScreenLoader = IAction<
  typeof TYPES.SET_SCREEN_LOADER,
  { active: boolean }
>;
export type SetUpdateImageLoader = IAction<
  typeof TYPES.SET_UPDATE_IMAGE_LOADER,
  { active: boolean }
>;
export type SetProjectCreateLoader = IAction<
  typeof TYPES.SET_PROJECT_CREATE_LOADER,
  { active: boolean }
>;
export type SetAnalyzerLoader = IAction<
  typeof TYPES.SET_ANALYZER_LOADER,
  { active: boolean }
>;
export type DeleteScreen = IAction<
  typeof TYPES.DELETE_SCREEN,
  { projectId: number; screenId: number }
>;
export type RestoreScreen = IAction<
  typeof TYPES.RESTORE_SCREEN,
  { projectId: number; screenId: number }
>;
export type RenameScreen = IAction<
  typeof TYPES.RENAME_SCREEN,
  { projectID: number; screenID: number; name: string }
>;
export type CreateScreen = IAction<
  typeof TYPES.CREATE_SCREEN,
  { projectID: number; name: string; buoyancy: number; skip: boolean }
>;
export type DuplicateScreen = IAction<
  typeof TYPES.DUPLICATE_SCREEN,
  { name: string; screenID: number }
>;
export type ActivateScreen = IAction<
  typeof TYPES.ACTIVATE_SCREEN,
  { screenId: number }
>;
export type MoveElement = IAction<
  typeof TYPES.MOVE_ELEMENT,
  {
    indices: Indices;
    elementId: string;
    parents: ParentIds;
  },
  ElementHistoryMeta
>;
export type UpdateElementsTree = IAction<
  typeof TYPES.UPDATE_ELEMENTS_TREE,
  Normalized<StateElement>,
  ElementHistoryMeta
>;
export type ClearAfterPrevScreen = IPlainAction<
  typeof TYPES.CLEAN_AFTER_PREV_SCREEN
>;
export type UpdateScreenImage = IAction<
  typeof TYPES.UPDATE_SCREEN_IMAGE,
  { screenId: number }
>;
export type UpdateScreen = IAction<
  typeof TYPES.UPDATE_SCREEN,
  { screen: Screen }
>;
export type SetCurrentScreenId = IAction<
  typeof TYPES.SET_CURRENT_SCREEN_ID,
  { screenId: number }
>;
export type SetScreens = IAction<
  typeof TYPES.SET_SCREENS,
  { screens: Screen[] }
>;
export type RenameElement = IAction<
  typeof TYPES.RENAME_ELEMENT,
  { elementID: string; name: string },
  ElementHistoryMeta
>;
export type UpdateElement = IAction<
  typeof TYPES.UPDATE_ELEMENT,
  {
    elementID: string;
    data: LibraryElementPatch<Entity>;
    active?: boolean;
  }
>;
export type ToggleContainersBorders = IPlainAction<
  typeof TYPES.TOGGLE_CONTAINERS_BORDERS
>;
export type CopyElementStyles = IAction<
  typeof TYPES.COPY_ELEMENT_STYLES,
  {
    elementType: Entity;
    elementID: string;
    styles: React.CSSProperties;
  },
  ElementHistoryMeta
>;
export type AddSharedStyles = IAction<
  'PROJECTS:ADD_SHARED_STYLES',
  {
    elementID: string;
    className: string;
    elementType: Entity;
    styles: React.CSSProperties;
  }
>;
export type AddElementClassName = IAction<
  typeof TYPES.ADD_ELEMENT_CLASSNAME,
  { elementID: string; className: string },
  ElementHistoryMeta
>;
export type RemoveElementClassName = IAction<
  typeof TYPES.REMOVE_ELEMENT_CLASSNAME,
  { elementID: string; className: string },
  ElementHistoryMeta
>;
export type UpdateSharedStyles = IAction<
  typeof TYPES.UPDATE_SHARED_STYLES,
  { className: Entity; styles: React.CSSProperties },
  ElementHistoryMeta
>;
export type RemoveSharedStyles = IAction<
  typeof TYPES.REMOVE_SHARED_STYLES,
  { className: Entity; cssPropertiesNames: PropertyName[] },
  ElementHistoryMeta
>;
export type RemoveElementStyles = IAction<
  typeof TYPES.REMOVE_ELEMENT_STYLES,
  { id: string; cssPropertiesNames: string[] },
  ElementHistoryMeta
>;
export type ReplaceElementStyles = IAction<
  typeof TYPES.REPLACE_ELEMENT_STYLES,
  { id: string; styles: React.CSSProperties },
  ElementHistoryMeta
>;
export type UpdateElementStyles = IAction<
  typeof TYPES.UPDATE_ELEMENT_STYLES,
  { id: string; styles: React.CSSProperties },
  ElementHistoryMeta
>;
export type UpdateElementImage = IAction<
  typeof TYPES.UPDATE_ELEMENT_IMAGE,
  { itemID: string; image: File },
  ElementHistoryMeta
>;
export type UpdateElementParameters = IAction<
  typeof TYPES.UPDATE_ELEMENT_PARAMETERS,
  {
    elementId: string;
    parameters: LibraryElement<Entity>['parameters'];
  },
  ElementHistoryMeta
>;
export type UpdateSavedElementsValues = IAction<
  typeof TYPES.UPDATE_SAVED_ELEMENTS_VALUES,
  { elementsValues: SavedElementsValues }
>;
export type UpdateSavedElementValues = IAction<
  typeof TYPES.UPDATE_SAVED_ELEMENT_VALUES,
  { itemID: string; savedValue: string | boolean }
>;
export type DeleteElement = IAction<
  typeof TYPES.DELETE_ELEMENT,
  { id: string },
  ElementHistoryMeta
>;
export type CreateElements = IAction<
  typeof TYPES.CREATE_ELEMENTS,
  { createdElements: CreatedElement[]; parentId?: string; index?: number },
  ElementHistoryMeta
>;

export type AddChildToElement = IAction<
  typeof TYPES.ADD_CHILD_TO_ELEMENT,
  {
    childType: ServerStructType;
    elementId: string;
    parameters: {};
  },
  ElementHistoryMeta
>;
export type UploadFile = IAction<
  typeof TYPES.UPLOAD_FILE,
  { file: any; parentId: string; blockType: NNBlockType },
  ElementHistoryMeta
>;
export type uploadImageForNNSuccess = IAction<
  typeof TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS,
  { imageURL: string; screenID: number }
>;
export type GetScreenNN = IPlainAction<typeof TYPES.GET_SCREEN_NN>;
export type WrapIntoContainer = IAction<
  typeof TYPES.WRAP_INTO_CONTAINER,
  { id: string },
  ElementHistoryMeta
>;
export type SetHoveredElement = IAction<
  typeof TYPES.SET_HOVERED_ELEMENT,
  string | null
>;
export type SetCurrentDropTargetParams = IAction<
  typeof TYPES.SET_CURRENT_DROP_TARGET_PARAMS,
  { id: string; position: DropPosition }
>;
export type SetEditableStyles = IAction<
  typeof TYPES.SET_EDITABLE_STYLES,
  { className: string }
>;
export type SetElementToCopy = IAction<
  typeof TYPES.SET_ELEMENT_TO_COPY,
  ItemToCopyInfo
>;
export type SetRightPanelActiveTab = IAction<
  typeof TYPES.SET_RIGHT_PANEL_ACTIVE_TAB,
  RightPanelTab
>;
export type CopyActiveElement = IPlainAction<typeof TYPES.COPY_ACTIVE_ELEMENT>;
export type PasteCopiedElement = IPlainAction<
  typeof TYPES.PASTE_COPIED_ELEMENT,
  ElementHistoryMeta
>;
export type ResetProjectState = IPlainAction<typeof TYPES.RESET_SCREEN_STATE>;
export type UndoAction = IPlainAction<typeof TYPES.UNDO_ACTION>;
export type RedoAction = IPlainAction<typeof TYPES.REDO_ACTION>;
export type SetUndoActions = IAction<
  typeof TYPES.SET_UNDO_ACTIONS,
  Action | Action[]
>;
export type SetRedoActions = IAction<typeof TYPES.SET_REDO_ACTIONS, Action[]>;
export type UnwrapFromContainer = IAction<
  typeof TYPES.UNWRAP_FROM_CONTAINER,
  { elementId: string; wrapperId: string; parentId: string },
  ElementHistoryMeta
>;
export type RestoreElementChildren = IAction<
  typeof TYPES.RESTORE_ELEMENT_CHILDREN,
  { elementId: string; childrenIds: string[] },
  ElementHistoryMeta
>;
export type RestoreElement = IAction<
  typeof TYPES.RESTORE_ELEMENT,
  string,
  ElementHistoryMeta
>;
export type RedoWrapIntoContainer = IAction<
  typeof TYPES.REDO_WRAP_INTO_CONTAINER,
  { elementId: string; wrapperId: string; parentId: string },
  ElementHistoryMeta
>;
export type AddBorderedElementRef = IAction<
  typeof TYPES.ADD_BORDERED_ELEMENT_REF,
  { id: string; ref: React.RefObject<HTMLElement> }
>;

export type RemoveBorderedElementRef = IAction<
  typeof TYPES.REMOVE_BORDERED_ELEMENT_REF,
  { id: string }
>;
export type PopUndoAction = IPlainAction<typeof TYPES.POP_UNDO_ACTION>;
export type PopHistory = IPlainAction<typeof TYPES.POP_HISTORY>;
export type SetGroupActionsUp = IAction<typeof TYPES.SET_GROUP_UP, boolean>;
export type Logout = IPlainAction<typeof TYPES.LOGOUT>;
export type AddElements = IAction<
  typeof TYPES.ADD_ELEMENTS,
  { elements: LibraryElement<any>[]; parentId?: string }
>;
export type SetCustomElements = IAction<
  typeof TYPES.ADD_CUSTOM_ELEMENTS_PAGE,
  {
    paginatedResult: PaginatedArray<LibraryElement<Entity>>;
    initial: boolean;
  }
>;

export type AddCustomElement = IAction<
  typeof TYPES.ADD_CUSTOM_ELEMENT,
  { element: LibraryElement<Entity> }
>;

export type UpdateElementsLoading = IAction<
  typeof TYPES.UPDATE_CUSTOM_ELEMENTS_LOADING,
  { loading: boolean }
>;

export type RemoveCustomElement = IAction<
  typeof TYPES.REMOVE_CUSTOM_ELEMENT,
  { id: string }
>;

export type AddFileInput = IAction<
  typeof TYPES.ADD_FILE_INPUT,
  { id: string; file: File }
>;

export type RemoveFileInput = IAction<
  typeof TYPES.REMOVE_FILE_INPUT,
  { id: string }
>;

export type AddStateElements = IAction<
  typeof TYPES.ADD_STATE_ELEMENTS,
  { elements: LibraryElement<any>[]; parentId: string; index?: number },
  ElementHistoryMeta
>;

export type ChangeFreeCanvasMode = IAction<
  typeof TYPES.CHANGE_FREE_CANVAS_MODE,
  boolean
>;

export type ChangeScreenFormat = IAction<
  typeof TYPES.CHANGE_SCREEN_FORMAT,
  SCREEN_FORMATS
>;

export type ExtractStateElement = IAction<
  typeof TYPES.EXTRACT_STATE_ELEMENT,
  string
>;

export type InsertStateElement = IAction<
  typeof TYPES.INSERT_STATE_ELEMENT,
  { parentId: string; childId: string; element: LibraryElement<any> },
  ElementHistoryMeta
>;

export type MoveStateElement = IAction<
  typeof TYPES.MOVE_STATE_ELEMENT,
  { elementId: string; indices: Indices; parents: ParentIds },
  ElementHistoryMeta
>;

export type RemoveStateElement = IAction<
  typeof TYPES.REMOVE_STATE_ELEMENT,
  { elementId: string },
  ElementHistoryMeta
>;

export type RotateScreenFormat = IAction<
  typeof TYPES.ROTATE_SCREEN_FORMAT,
  boolean
>;

export type SetActiveElementId = IAction<
  typeof TYPES.SET_ACTIVE_ELEMENT_ID,
  string
>;

export type SetElementCanBeEdited = IAction<
  typeof TYPES.SET_ELEMENT_CAN_BE_EDITED,
  boolean
>;

export type SetElementBeingEdited = IAction<
  typeof TYPES.SET_ELEMENT_BEING_EDITED,
  boolean
>;

export type ResetElementEditState = IAction<
  typeof TYPES.RESET_ELEMENT_EDIT_STATE,
  unknown
>;

export type SetProjectsData = IAction<
  typeof TYPES.SET_PROJECTS_DATA,
  PaginatedArray<Project>
>;

export type UpdateLastElements = IAction<
  typeof TYPES.UPDATE_LAST_ELEMENTS,
  { parentId: string; ids: string[]; offset: number }
>;

export type UpdateStateElement = IAction<
  typeof TYPES.UPDATE_STATE_ELEMENT,
  { elementId: string; data: Partial<StateElement> },
  ElementHistoryMeta
>;

export type SetScreenCreateLoader = IAction<
  typeof TYPES.SET_SCREEN_CREATE_LOADER,
  boolean
>;

export type Action =
  | LoadProjects
  | LoadProjectsSuccess
  | LoadProjectsFail
  | CreateProject
  | DeleteProject
  | GetProject
  | SetCurrentProjectId
  | ChangeScreensOrder
  | RenameProject
  | SetProjectListLoader
  | SetProjectLoader
  | SetScreenLoader
  | SetUpdateImageLoader
  | SetProjectCreateLoader
  | SetAnalyzerLoader
  | DeleteScreen
  | RenameScreen
  | CreateScreen
  | ActivateScreen
  | ClearAfterPrevScreen
  | UpdateScreenImage
  | SetCurrentScreenId
  | CopyElementStyles
  | UpdateElementStyles
  | UpdateElementImage
  | UpdateElementParameters
  | CreateElements
  | DeleteElement
  | AddChildToElement
  | UploadFile
  | uploadImageForNNSuccess
  | GetScreenNN
  | WrapIntoContainer
  | SetHoveredElement
  | ToggleContainersBorders
  | SetElementToCopy
  | SetRightPanelActiveTab
  | CopyActiveElement
  | PasteCopiedElement
  | ResetProjectState
  | UpdateSavedElementsValues
  | UpdateSavedElementValues
  | UpdateElementsTree
  | SetEditableStyles
  | SetUndoActions
  | SetRedoActions
  | UnwrapFromContainer
  | RestoreElementChildren
  | RedoWrapIntoContainer
  | PopUndoAction
  | PopHistory
  | SetGroupActionsUp
  | MoveElement
  | RemoveElementStyles
  | ReplaceElementStyles
  | RemoveElementClassName
  | UpdateProject
  | RemoveSharedStyles
  | UpdateSharedStyles
  | AddElementClassName
  | Logout
  | RestoreScreen
  | SetProject
  | UpdateScreen
  | AddElements
  | RestoreElement
  | SetActiveElementId
  | SetElementCanBeEdited
  | SetElementBeingEdited
  | ResetElementEditState
  | MoveStateElement
  | UpdateStateElement
  | AddStateElements
  | InsertStateElement
  | RemoveStateElement
  | SetProjectsData
  | ExtractStateElement
  | ChangeFreeCanvasMode
  | UpdateLastElements
  | ChangeScreenFormat
  | RotateScreenFormat
  | SetScreens
  | AddBorderedElementRef
  | RemoveBorderedElementRef
  | SetCurrentDropTargetParams
  | UpdateElement
  | UpdateElementsLoading
  | SetCustomElements
  | AddCustomElement
  | RemoveCustomElement
  | AddFileInput
  | RemoveFileInput
  | SetScreenCreateLoader;

export type HistoryMeta = {
  undo?: boolean;
  redo?: boolean;
};
export type ElementHistoryMeta = HistoryMeta & {
  screenId: number;
  sourceAction?: Action | null;
};

export interface IPlainAction<T, M = HistoryMeta> {
  type: T;
  meta?: M;
}

export interface IAction<T, P, M = HistoryMeta> extends IPlainAction<T, M> {
  payload: P;
}

export interface IPlainFailAction<T, E = string> extends IPlainAction<T> {
  error: E;
}
