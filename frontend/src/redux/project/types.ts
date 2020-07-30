import { IPlainAction, IPlainFailAction, IAction } from '$shared/redux';
import { CssLikeStyles } from '$utils/StyleHelper';
import { LibraryEntities } from '$domain/libraryElements/libraryElements';
import { Entity } from '$domain/core';
import { LibraryElement as RootElement, LinkParams, HeadingType, VideoSettings, InputType, Project } from '$api/types';
import { StateWithHistory } from 'redux-undo';

export type ProjectState = {
  data: ProjectDataState;
  ui: ProjectUiState,
  edit: ProjectEditState;
  communication: ProjectCommunicationState;
  control: StateWithHistory<ProjectControlState>;
};

export type ProjectDataState = {
  libraryElements: LibraryEntities;
  listProject: Project[];
}

export type ProjectUiState = {
  activeItem: ActiveItem;
  isAddElementsModalOpened: boolean;
  itemToCopyInfo: ItemToCopyInfo | null;
  savedElementsValues: SavedElementsValues;
  showContainersBorders: boolean;
}

export type ProjectEditState = {
  currentProject: Project;
  currentScreen: IProjectScreen;
  screens: IProjectScreen[];
  scenarios: IScenarios;
  scenarioElements: IScenarioElements;
  modifyElements: number[];
  uploadedImageInfo?: UploadedImageInfo;
  notification: Notification | null;
}

export type ProjectCommunicationState = {
  listProjectLoader: boolean;
  loader: boolean; // TODO: pick more suitable name
  screenLoader: boolean,
  projectLoader: boolean,
  scenarioLoader: boolean;
}

export type ProjectControlState = {
  rootElement: RootElement<'root'>;
  undoActions: Action[];
  redoActions: Action[];
  sourceAction: Action | null;
  add: boolean;
}

export type Indices = {
  newIndex: number;
  oldIndex: number;
}

export type Notification = {
  text: string,
};

export type ActiveItem = {
  itemId: string;
  itemType: Entity | 'none';
  name: string;
};

export type SavedElementsValues = { [elementID: string]: { id: number, savedValue: string | boolean } };

export type CreatedElement = { type: Entity, parentID?: number };

export type LoadLibraryElements = IPlainAction<'PROJECTS:LOAD_LIBRARY_ELEMENTS'>;
export type LoadLibraryElementsSuccess = IAction<
  'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS', { libraryElements: LibraryEntities }
>;
export type LoadLibraryElementsFail = IPlainFailAction<'PROJECTS:LOAD_LIBRARY_ELEMENTS_FAIL'>;

export type LoadProjects = IPlainAction<'PROJECTS:LOAD_PROJECTS'>;
export type LoadProjectsSuccess = IAction<
  'PROJECTS:LOAD_PROJECTS_SUCCESS', { projects: Project[] }
>;
export type LoadProjectsFail = IPlainFailAction<'PROJECTS:LOAD_PROJECTS_FAIL'>;

export type AddProject = IAction<'PROJECTS:ADD_PROJECT', { name: string }>;
export type DeleteProject = IAction<'PROJECTS:DELETE_PROJECT', { id: number }>;
export type GetProject = IAction<'PROJECTS:GET_PROJECT', { id: number, screenID?: string }>;
export type SetProject = IAction<'PROJECTS:SET_PROJECT', { project: Project }>;
export type ChangeScreensOrder = IAction<'PROJECTS:CHANGE_SCREENS_ORDER', { screens: IProjectScreen[] }>;
export type RenameProject = IAction<'PROJECTS:RENAME_PROJECT', { projectID: number, name: string }>;
export type SetListProjectLoader = IAction<'PROJECTS:SET_LIST_PROJECT_LOADER', { active: boolean }>;
export type SetProjectLoader = IAction<'PROJECTS:SET_PROJECT_LOADER', { active: boolean }>;
export type SetScreenLoader = IAction<'PROJECTS:SET_SCREEN_LOADER', { active: boolean }>;
export type SetLoader = IAction<'PROJECTS:SET_LOADER', { active: boolean }>;
export type SetNotification = IAction<'PROJECTS:SET_NOTIFICATION', Notification>;
export type RemoveNotification = IPlainAction<'PROJECTS:REMOVE_NOTIFICATION'>;
export type SetScenarioLoader = IAction<'PROJECTS:SET_SCENARIO_LOADER', { active: boolean }>;
export type DeleteScreen = IAction<'PROJECTS:DELETE_SCREEN', { projectID: number, screenID: number }>;
export type RenameScreen = IAction<'PROJECTS:RENAME_SCREEN', { projectID: number, screenID: number, name: string }>;
export type AddScreen = IAction<'PROJECTS:ADD_SCREEN', { projectID: number, name: string, buoyancy: number }>;
export type DuplicateScreen = IAction<'PROJECTS:DUPLICATE_SCREEN', { name: string, screenID: number }>;
export type ActivateScreen = IAction<'PROJECTS:ACTIVATE_SCREEN', { projectID: number, screenID: number }>;
export type MoveElement = IAction<
  'PROJECTS:MOVE_ELEMENT',
  { indices: Indices, elementID: string, parentID: string, options: HistoryMeta, isRemote?: boolean },
  HistoryMeta
>;
export type UpdateElementsTree = IAction<'PROJECTS:UPDATE_ELEMENTS_TREE', { root: RootElement<'root'>, skip: boolean, sourceAction: any, parentID?: string }>;
export type ClearAfterPrevScreen = IPlainAction<'PROJECTS:CLEAN_AFTER_PREV_SCREEN'>;
export type SaveScreen = IAction<'PROJECTS:SAVE_SCREEN', { canvas: HTMLCanvasElement }>;
export type ExportProject = IPlainAction<'PROJECTS:EXPORT_PROJECT'>;
export type SetScreen = IAction<'PROJECTS:SET_SCREEN', { screen: IProjectScreen }>;
export type SetScreens = IAction<'PROJECTS:SET_SCREENS', { screens: IProjectScreen[] }>;
export type AddElement = IAction<'PROJECTS:ADD_ELEMENT', { parentID: string, type: string }>;
export type RenameElement = IAction<'PROJECTS:RENAME_ELEMENT', { elementID: string, name: string }>;
export type ToggleContainersBorders = IPlainAction<'PROJECTS:TOGGLE_CONTAINERS_BORDERS'>;
export type SetScenarioElements = IAction<'PROJECTS:SET_SCENARIO_ELEMENTS', { elements: IScenarioElements }>;
export type UpdateElementStyles = IAction<
  'PROJECTS:UPDATE_ELEMENT_STYLES',
  { id: string, styles: CssLikeStyles },
  HistoryMeta
  >;
export type UpdateElementImage = IAction<'PROJECTS:UPDATE_ELEMENT_IMAGE', { itemID: string, image: File }>;
export type UpdateElementParameters = IAction<
  'PROJECTS:UPDATE_ELEMENT_PARAMETERS',
  { itemID: string, parameters: RootElement<Entity>['parameters'] },
  HistoryMeta
>;
export type UpdateSavedElementsValues = IAction<
  'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES', { elementsValues: SavedElementsValues }
>;
export type UpdateSavedElementValues = IAction<
  'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES', { itemID: string, savedValue: string | boolean }
>;
export type DeleteItem = IAction<'PROJECTS:DELETE_ITEM', { id: string }, HistoryMeta>;
export type CreateElements = IAction<
  'PROJECTS:CREATE_ELEMENTS', { createdElements: CreatedElement[] }>;
export type AddChildToElement = IAction<
'PROJECTS:ADD_CHILD_TO_ELEMENT', { childType: ServerStructType, elementID: string, parameters: {} }, HistoryMeta>;
export type DeleteChildFromElement = IAction<
'PROJECTS:DELETE_CHILD_FROM_ELEMENT', { id: string }>;
export type SetScenarios = IAction<'PROJECTS:SET_SCENARIOS', { scenarios: IScenarios }>;
export type SetModifyElements = IAction<'PROJECTS:SET_MODIFY_ELEMENTS', { elements: number[] }>;
export type UploadFile = IAction<'PROJECTS:UPLOAD_FILE', { file: any }>;
export type uploadImageForNNSuccess = IAction<
  'PROJECTS:UPLOAD_IMAGE_FOR_NN_SUCCESS', { imageURL: string, screenID: number }
>;
export type GetScreenNN = IPlainAction<'PROJECTS:GET_SCREEN_NN'>;
export type WrapIntoContainer = IAction<'PROJECTS:WRAP_INTO_CONTAINER', { id: string }, HistoryMeta>;
export type SetActiveItem = IAction<'PROJECTS:SET_ACTIVE_ITEM', { activeItem: ActiveItem }>;
export type SetIsAddElementsModalOpened = IAction<'PROJECTS:SET_IS_ADD_ELEMENTS_MODAL_OPENED', { isOpened: boolean }>;
export type SetItemToCopy = IAction<'PROJECTS:SET_ITEM_TO_COPY', ItemToCopyInfo>;
export type CopyActiveItem = IPlainAction<'PROJECTS:COPY_ACTIVE_ITEM'>;
export type PasteCopiedItem = IPlainAction<'PROJECTS:PASTE_COPIED_ITEM'>;
export type ResetScreenState = IPlainAction<'PROJECTS:RESET_SCREEN_STATE'>;
export type UndoAction = IPlainAction<'UNDO_ACTION'>;
export type RedoAction = IPlainAction<'REDO_ACTION'>;
export type SetUndoActions = IAction<'PROJECTS:SET_UNDO_ACTIONS', Action[]>;
export type SetRedoActions = IAction<'PROJECTS:SET_REDO_ACTIONS', Action[]>;
export type AddUndoAction = IAction<'PROJECTS:ADD_UNDO_ACTION', Action>;
export type UnwrapFromContainer = IAction<'PROJECTS:UNWRAP_FROM_CONTAINER', { elementID: string, wrapperID: string, parentID: string }, HistoryMeta>
export type SetAddAction = IAction<'PROJECTS:SET_ADD_ACTION', boolean>;
export type RestoreElementChildren = IAction<'PROJECTS:RESTORE_ELEMENT_CHILDREN', { elementId: string, childrenIds: string[] }, HistoryMeta>;
export type RedoWrapIntoContainer = IAction<'PROJECTS:REDO_WRAP_INTO_CONTAINER', { elementId: string, wrapperId: string, parentId: string }, HistoryMeta>;
export type ClearHistory = IPlainAction<'PROJECTS:CLEAR_HISTORY'>;

export type Action =
  | LoadLibraryElements
  | LoadLibraryElementsSuccess
  | LoadLibraryElementsFail
  | LoadProjects
  | LoadProjectsSuccess
  | LoadProjectsFail
  | AddProject
  | DeleteProject
  | GetProject
  | SetProject
  | ChangeScreensOrder
  | RenameProject
  | SetListProjectLoader
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
  | SetScreen
  | SetScreens
  | AddElement
  | SetScenarioElements
  | UpdateElementStyles
  | UpdateElementImage
  | UpdateElementParameters
  | CreateElements
  | DeleteItem
  | AddChildToElement
  | DeleteChildFromElement
  | SetScenarios
  | SetModifyElements
  | UploadFile
  | uploadImageForNNSuccess
  | GetScreenNN
  | WrapIntoContainer
  | SetActiveItem
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
  | SetUndoActions
  | SetRedoActions
  | AddUndoAction
  | UnwrapFromContainer
  | SetAddAction
  | RestoreElementChildren
  | RedoWrapIntoContainer
  | ClearHistory
  | MoveElement;

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
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

export type ScreenDisplay = Block | Inline | InlineBlock | Flex;

export interface IScreenIndents {
  'margin-top'?: string,
  'margin-right'?: string,
  'margin-bottom'?: string,
  'margin-left'?: string,
  'padding-top': string,
  'padding-right': string,
  'padding-bottom': string,
  'padding-left': string,
}

export interface IScreenBorders {
  'border-width': string,
  'border-color': string,
  'border-style': string,
  'border-radius': string,
}

export interface IScreenBackground {
  'background-color': string,
  'background-image': string,
  'background-repeat': string,
  'background-size': string,
}

export interface IScreenTypography {
  'font-family': string,
  'color': string,
  'font-size': string,
  'line-height': string,
  'font-style': string,
  'font-weight': number,
  'text-align': string,
}

export interface ICenterProp {
  lat: number,
  lng: number,
}

export interface IMapProps {
  center: ICenterProp,
  zoom: number,
  markerText?: string,
}

export type Option = { name: string; value: any };

export type ListItem = {
  textContent: string,
  isLink: boolean,
  link: string,
};

export interface IScreenProps {
  buoyancy?: number,
  html_type?: string,
  content?: string,
  url?: string;
  textContent?: string,
  width?: string,
  height?: string,
  align?: string,
  indents?: IScreenIndents,
  border?: IScreenBorders,
  background?: IScreenBackground,
  typography?: IScreenTypography,
  placeholder?: string,
  dynamic_placeholder?: string,
  map_props: IMapProps,
  source_img?: string,
  scenarioId?: number,
  action?: LinkParams,
  imageURL?: string,
  type?: InputType,
  value?: string,
  name?: string,
  showRipple?: boolean,
  options?: Option[],
  headingType?: HeadingType,
  listItems?: ListItem[],
  showBullets?: boolean,
  isOrdered?: boolean,
  labelFor?: string,
  dropdownItems?: string[],
  link?: string,
  isLink?: boolean,
  isOpen?: boolean,
  videoSettings?: VideoSettings,
}

export interface ISortableItem {
  id: number,
  type: string,
  children: ISortableItem[],
  orientation?: string,
  props?: IScreenProps,
  scenarioId?: number,
}

export type LibraryElement = {
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

export interface IStylesElement {
  marginTop?: string,
  marginRight?: string,
  marginBottom?: string,
  marginLeft?: string,
  paddingTop?: string,
  paddingRight?: string,
  paddingBottom?: string,
  paddingLeft?: string,

  height?: string,
  width?: string,

  borderRadius?: string,
  backgroundColor?: string,
  backgroundImage?: string,
  backgroundSize?: string,
  backgroundRepeat?: string,
  color?: string,
  fontSize?: string,
  fontStyle?: string,
  fontWeight?: string,
  lineHeight?: string,
  textAlign?: string,
  fontFamily?: string,
}

export type ElementParameters = {
  group?: string,
  placeholder?: string,
  url?: string,
  imageURL?: string,
  textContent?: string,
  value?: string,
  name?: string,
  defaultChecked?: boolean,
  map_props?: IMapProps,
  showRipple?: boolean,
  options?: Option[],
  type?: InputType,
  dropdownItems?: string[],
  headingType?: HeadingType,
  labelFor?: string,
  listItems?: ListItem[],
  isOrdered?: boolean,
  isLink?: boolean,
  link?: string,
  isOpen?: boolean,
  videoSettings?: VideoSettings,
}

export interface IScenarioElement { // compare with entity on backend
  id: number,
  scenario: number,
  name: string,
  struct_type: ServerStructType,
  func_type: ServerStructType,
  func_type_human?: string, // possibly has fallback value as 'undefined'
  buoyancy: number,
  dynamic_buoyancy: number,
  image: string | null,
  parameters: { parent_id: number } & ElementParameters,
  styles: CssLikeStyles,
  children: IScenarioElement[],
}

export interface IScenarioElements {
  [elementID: string]: IScenarioElement,
}

export interface IScenarioItem { // compare with entity on backend
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
  [scenarioID: string]: IScenarioItem,
}

export interface ILSItem {
  id: number;
  type: ServerStructType;
  children: string[];
}

export interface IListSortable {
  [itemID: string]: ILSItem;
}

export interface IProjectScreen {
  id: number;
  name: string;
  status: string; // compare with entity on backend!
  project: number;
  image: string | null;
  screenscenario: number[];
  listSortable: IListSortable;
  buoyancy: number;
  // removed screen_data_json, ask if it will be needed on backend
}

export interface IProjectListItem {
  id: number,
  name: string,
  image: string,
  buoyancy: number,
}

export interface IListProject {
  id: number,
  status: string,
  name: string,
  preview?: string,
  projectscreen: {
    id: number,
    project: number,
    name: string,
    status: string,
    screenscenario: number[],
    image?: any,
  }[],
}

export type UploadedImageInfo = {
  imageURL: string;
  screenID: number;
}

export type Page = {
  screenInfo: {
    name: string,
    id: number,
  },
  renderTree: {
    containers: IScenarioItem[],
    elements: IScenarioElement[],
  },
};

export type HistoryMeta = {
  undo?: boolean;
  redo?: boolean;
}