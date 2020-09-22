/* eslint-disable camelcase */
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import {
  ServerElement,
  HeadingType,
  InputType,
  LibraryElement,
  LibraryElement as RootElement,
  Project,
  VideoSettingsType,
} from '../../api/types';
import { LibraryElements } from '../../domain/libraryElements/libraryElements';
import { IAction, IPlainAction, IPlainFailAction } from '../../shared/redux';
import { Entity } from '../../domain/core';
import TYPES from '../../constants/actions';
import { CssLikeStyles } from '../../utils/StyleHelper';
import {
  addStateElements,
  insertStateElement,
  moveStateElement,
  removeStateElement,
  updateStateElement,
} from './actions';

export type ProjectState = {
  data: ProjectDataState;
  ui: ProjectUiState;
  edit: ProjectEditState;
  communication: ProjectCommunicationState;
  control: ProjectControlState;
};

export type ProjectLibraryElements = {
  [id: number]: IScenarioElement;
};

export type NamedLibraryElements = {
  [name: string]: LibraryElement<Entity>;
};

export type NamedServerElements = {
  [name: string]: ServerElement<Entity, ServerElement<Entity>[]>;
};

export type StateElement = {
  id: string;
  name: string;
  type: Entity | 'none';
  buoyancy: number;
  parent?: string;
  children: string[];
  image: string | null | undefined;
  styles: {
    classNames: string[];
    ownStyles: CssLikeStyles;
  };
  parameters: any;
};

export type ProjectDataState = {
  projects: Map<Project>;
  screens: Map<Screen>;
  elements: Map<StateElement>;
};

export type ProjectUiState = {
  editableStyles: string;
  isAddElementsModalOpened: boolean;
  itemToCopyInfo: ItemToCopyInfo | null;
  savedElementsValues: SavedElementsValues;
  showContainersBorders: boolean;
  customLibraryElements: NamedServerElements;
  draggableItemId: string | null;
};

export type ProjectEditState = {
  currentProjectId: number;
  currentScreenId: number;
  activeElementId: string;
  uploadedImageInfo?: UploadedImageInfo;
  notification: Notification | null;
};

export type ProjectCommunicationState = {
  projectListLoader: boolean;
  loader: boolean; // TODO: pick more suitable name
  screenLoader: boolean;
  projectLoader: boolean;
  scenarioLoader: boolean;
  initialProjectLoadDone: boolean;
};

export type ProjectControlState = {
  undoActions: Action[] | Action[][];
  redoActions: Action[];
  history: Action[];
  groupActionsUp: boolean;
};

export type Indices = {
  newIndex: number;
  oldIndex: number;
};

export type Notification = {
  text: string;
};

export type SavedElementsValues = {
  [elementID: string]: { id: number; savedValue: string | boolean };
};

export type CreatedElement = {
  type: Entity | string;
  name: string;
  custom: boolean;
};

export type LoadLibraryElements = IPlainAction<
  typeof TYPES.GET_LIBRARY_ELEMENTS
>;
export type LoadLibraryElementsSuccess = IAction<
  typeof TYPES.LOAD_LIBRARY_ELEMENTS_SUCCESS,
  { libraryElements: LibraryElements }
>;
export type LoadLibraryElementsFail = IPlainFailAction<
  'PROJECTS:LOAD_LIBRARY_ELEMENTS_FAIL'
>;

export type LoadProjects = IPlainAction<typeof TYPES.LOAD_PROJECTS>;
export type LoadProjectsSuccess = IAction<
  typeof TYPES.LOAD_PROJECTS_SUCCESS,
  { projects: Project[] }
>;
export type LoadProjectsFail = IPlainFailAction<'PROJECTS:LOAD_PROJECTS_FAIL'>;

export type AddProject = IAction<typeof TYPES.ADD_PROJECT, { name: string }>;
export type DeleteProject = IAction<
  typeof TYPES.DELETE_PROJECT,
  { id: number }
>;
export type GetProject = IAction<
  typeof TYPES.GET_PROJECT,
  { id: number; screenID?: number }
>;
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
export type SetLoader = IAction<typeof TYPES.SET_LOADER, { active: boolean }>;
export type SetNotification = IAction<
  typeof TYPES.SET_NOTIFICATION,
  Notification
>;
export type RemoveNotification = IPlainAction<typeof TYPES.REMOVE_NOTIFICATION>;
export type SetScenarioLoader = IAction<
  typeof TYPES.SET_SCENARIO_LOADER,
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
export type AddScreen = IAction<
  typeof TYPES.ADD_SCREEN,
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
  Map<StateElement>,
  ElementHistoryMeta
>;
export type ClearAfterPrevScreen = IPlainAction<
  typeof TYPES.CLEAN_AFTER_PREV_SCREEN
>;
export type SaveScreen = IAction<
  typeof TYPES.SAVE_SCREEN,
  { screenId: number; canvas: HTMLCanvasElement }
>;
export type UpdateScreen = IAction<
  typeof TYPES.UPDATE_SCREEN,
  { screen: Screen }
>;
export type ExportProject = IPlainAction<typeof TYPES.EXPORT_PROJECT>;
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
export type ToggleContainersBorders = IPlainAction<
  typeof TYPES.TOGGLE_CONTAINERS_BORDERS
>;
export type CopyElementStyles = IAction<
  typeof TYPES.COPY_ELEMENT_STYLES,
  {
    elementType: Entity;
    elementID: string;
    styles: CssLikeStyles;
  },
  ElementHistoryMeta
>;
export type AddSharedStyles = IAction<
  'PROJECTS:ADD_SHARED_STYLES',
  {
    elementID: string;
    className: string;
    elementType: Entity;
    styles: CssLikeStyles;
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
  { className: Entity; styles: CssLikeStyles },
  ElementHistoryMeta
>;
export type RemoveSharedStyles = IAction<
  typeof TYPES.REMOVE_SHARED_STYLES,
  { className: Entity; cssPropertiesNames: string[] },
  ElementHistoryMeta
>;
export type RemoveElementStyles = IAction<
  typeof TYPES.REMOVE_ELEMENT_STYLES,
  { id: string; cssPropertiesNames: string[] },
  ElementHistoryMeta
>;
export type ReplaceElementStyles = IAction<
  typeof TYPES.REPLACE_ELEMENT_STYLES,
  { id: string; styles: CssLikeStyles },
  ElementHistoryMeta
>;
export type UpdateElementStyles = IAction<
  typeof TYPES.UPDATE_ELEMENT_STYLES,
  { id: string; styles: CssLikeStyles },
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
    parameters: RootElement<Entity>['parameters'];
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
export type DeleteItem = IAction<
  typeof TYPES.DELETE_ITEM,
  { id: string },
  ElementHistoryMeta
>;
export type CreateElements = IAction<
  typeof TYPES.CREATE_ELEMENTS,
  { createdElements: CreatedElement[] },
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
  { file: any },
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
export type SetActiveElementId = IAction<
  typeof TYPES.SET_ACTIVE_ELEMENT_ID,
  string
>;
export type SetEditableStyles = IAction<
  typeof TYPES.SET_EDITABLE_STYLES,
  { className: string }
>;
export type SetIsAddElementsModalOpened = IAction<
  typeof TYPES.SET_IS_ADD_ELEMENTS_MODAL_OPENED,
  { isOpened: boolean }
>;
export type SetItemToCopy = IAction<
  typeof TYPES.SET_ITEM_TO_COPY,
  ItemToCopyInfo
>;
export type CopyActiveItem = IPlainAction<typeof TYPES.COPY_ACTIVE_ITEM>;
export type PasteCopiedItem = IPlainAction<
  typeof TYPES.PASTE_COPIED_ELEMENT,
  ElementHistoryMeta
>;
export type ResetScreenState = IPlainAction<typeof TYPES.RESET_SCREEN_STATE>;
export type UndoAction = IPlainAction<typeof TYPES.UNDO_ACTION>;
export type RedoAction = IPlainAction<typeof TYPES.REDO_ACTION>;
export type SetUndoActions = IAction<
  typeof TYPES.SET_UNDO_ACTIONS,
  Action | Action[]
>;
export type SetRedoActions = IAction<typeof TYPES.SET_REDO_ACTIONS, Action[]>;
export type SaveLibraryElement = IAction<
  typeof TYPES.SAVE_LIBRARY_ELEMENT_TO_STATE,
  ServerElement<Entity, ServerElement<Entity>[]>
>;
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
export type ClearHistory = IPlainAction<typeof TYPES.CLEAR_HISTORY>;
export type PopUndoAction = IPlainAction<typeof TYPES.POP_UNDO_ACTION>;
export type PopHistory = IPlainAction<typeof TYPES.POP_HISTORY>;
export type SetGroupActionsUp = IAction<typeof TYPES.SET_GROUP_UP, boolean>;
export type Logout = IPlainAction<typeof TYPES.LOGOUT>;
export type AddElements = IAction<
  typeof TYPES.ADD_ELEMENTS,
  { elements: LibraryElement<any>[]; parentId?: string }
>;
export type RemoveElements = IAction<typeof TYPES.REMOVE_ELEMENTS, string[]>;

export type Action =
  | LoadProjects
  | LoadProjectsSuccess
  | LoadProjectsFail
  | AddProject
  | DeleteProject
  | GetProject
  | SetCurrentProjectId
  | ChangeScreensOrder
  | RenameProject
  | SetProjectListLoader
  | SetProjectLoader
  | SetScreenLoader
  | SetLoader
  | SetScenarioLoader
  | DeleteScreen
  | RenameScreen
  | AddScreen
  | ActivateScreen
  | ClearAfterPrevScreen
  | SaveScreen
  | SetCurrentScreenId
  | SetScreens
  | CopyElementStyles
  | UpdateElementStyles
  | UpdateElementImage
  | UpdateElementParameters
  | CreateElements
  | DeleteItem
  | AddChildToElement
  | UploadFile
  | uploadImageForNNSuccess
  | GetScreenNN
  | WrapIntoContainer
  | SetActiveElementId
  | ToggleContainersBorders
  | SetIsAddElementsModalOpened
  | SetItemToCopy
  | CopyActiveItem
  | PasteCopiedItem
  | ResetScreenState
  | UpdateSavedElementsValues
  | UpdateSavedElementValues
  | UpdateElementsTree
  | SetNotification
  | RemoveNotification
  | SetEditableStyles
  | SetUndoActions
  | SetRedoActions
  | UnwrapFromContainer
  | RestoreElementChildren
  | RedoWrapIntoContainer
  | ClearHistory
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
  | RemoveElements
  | SaveLibraryElement
  | RestoreElement
  | ReturnType<typeof moveStateElement>
  | ReturnType<typeof updateStateElement>
  | ReturnType<typeof addStateElements>
  | ReturnType<typeof insertStateElement>
  | ReturnType<typeof removeStateElement>;

export type ItemToCopyInfo = {
  id: string;
  screenID: number;
};

type Block = {
  display: 'block';
};

type InlineBlock = {
  display: 'inline-block';
};

type Inline = {
  display: 'inline';
};

export type Flex = {
  display: 'flex';
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
};

export type ScreenDisplay = Block | Inline | InlineBlock | Flex;

export interface ICenterProp {
  lat: number;
  lng: number;
}

export interface IMapProps {
  center: ICenterProp;
  zoom: number;
  markerText?: string;
}

export type Option = { name: string; value: any };

export type ListItem = {
  textContent: string;
  isLink: boolean;
  link: string;
};

export type ScenarioLibraryElement = {
  struct_type: ServerStructType;
  func_type: ServerStructType;
  func_type_human?: string;
  buoyancy: number;
  parameters: {
    tags?: string;
    group: string;
    placeholder?: string;
    map_props?: IMapProps;
  };
  styles: CssLikeStyles;
  name: ServerStructType;
};

export type ServerStructType = Entity;

export type ElementParameters = {
  group?: string;
  placeholder?: string;
  url?: string;
  imageURL?: string;
  textContent?: string;
  value?: string;
  name?: string;
  defaultChecked?: boolean;
  map_props?: IMapProps;
  showRipple?: boolean;
  options?: Option[];
  type?: InputType;
  dropdownItems?: string[];
  headingType?: HeadingType;
  labelFor?: string;
  listItems?: ListItem[];
  isOrdered?: boolean;
  isLink?: boolean;
  link?: string;
  isOpen?: boolean;
  videoSettings?: VideoSettingsType;
};

export interface IScenarioElement {
  // compare with entity on backend
  id: number;
  scenario: number;
  name: string;
  struct_type: ServerStructType;
  func_type: ServerStructType;
  func_type_human?: string; // possibly has fallback value as 'undefined'
  buoyancy: number;
  dynamic_buoyancy: number;
  image: string | null;
  parameters: { parent_id?: number } & ElementParameters;
  styles: CssLikeStyles;
  children: IScenarioElement[];
}

export interface IScenarioElements {
  [elementID: string]: IScenarioElement;
}

export interface IScenarioItem {
  // compare with entity on backend
  id: number;
  name: string;
  type?: string;
  struct_type: ServerStructType; // 'scenario' | 'block' | 'group' | 'container' | 'undefined'. it seems that it also contains keyof of RENDERERS
  screen: number;
  parent_id: number; // id in database table
  buoyancy: number;
  direction: string; // 'vertical' | 'horizontal'
  elements: number[]; // elements ids as foreign keys
  parameters: {
    children: string[]; // listSortable-specific ids
  } & ElementParameters;
  styles: CssLikeStyles;
}

export interface IScenarios {
  [scenarioID: string]: IScenarioItem;
}

export interface ILSItem {
  id: number;
  type: ServerStructType;
  children: string[];
}

export interface Screen {
  id: number;
  name: string;
  status: string; // compare with entity on backend!
  project: number;
  image: string | null;
  screenscenario: number[];
  buoyancy: number;
  element: string;
  // removed screen_data_json, ask if it will be needed on backend
}

export type UploadedImageInfo = {
  imageURL: string;
  screenID: number;
};

export type Page = {
  screenInfo: {
    name: string;
    id: number;
  };
  renderTree: {
    containers: IScenarioItem[];
    elements: IScenarioElement[];
  };
};

export type HistoryMeta = {
  undo?: boolean;
  redo?: boolean;
};
export type ElementHistoryMeta = HistoryMeta & {
  screenId: number;
  sourceAction?: Action | null;
};

export type Map<T> = {
  [id in number | string]: T;
};

export type ElementData = {
  type: Entity;
  icon: OverridableComponent<SvgIconTypeMap> | undefined;
  name: string;
  custom: boolean;
};

export type ElementsHierarchy = {
  elements: {
    layout: {
      [elementName in Entity]: ElementData;
    };
    basic: {
      [elementName in Entity]: ElementData;
    };
    form: {
      [elementName in Entity]: ElementData;
    };
    widget: {
      [elementName in Entity]: ElementData;
    };
  };
  templates: {
    [elementName in Entity]: ElementData;
  };
  library: {
    adeviLibrary: {
      [elementName in Entity]: ElementData;
    };
    customUI: {
      [elementName in Entity]: ElementData;
    };
  };
};

export type ParentIds = {
  oldParentId: string;
  newParentId: string;
};
