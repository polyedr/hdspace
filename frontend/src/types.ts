/* eslint-disable camelcase */
import React from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import { RouterState } from 'connected-react-router';
import { DropTargetMonitor } from 'react-dnd';
import { AxiosRequestConfig } from 'axios';
import { DropPosition, ElementType } from './constants/dragAndDrop';
import {
  NNBlockType,
  RightPanelTab,
  SCREEN_FORMATS,
} from './constants/defaultParams';
import {
  addStateElements,
  changeFreeCanvasMode,
  changeScreenFormat,
  extractStateElement,
  insertStateElement,
  moveStateElement,
  removeStateElement,
  rotateScreenFormat,
  setActiveElementId,
  setProjectsData,
  updateLastElements,
  updateStateElement,
} from './redux/project/actions';
import TYPES from './constants/actions';
import {
  CONTROLS_AFFECT_ON_PARAMS,
  CONTROLS_AFFECT_ON_STYLES,
} from './domain/core';

export type Normalized<T extends { id: string | number }> = {
  [id in string | number]: T;
};

export type PaginatedBase<T> = {
  next: string | null;
  previous: string | null;
  pageSize: number;
  loading: boolean;
};

export type PaginatedArray<T> = PaginatedBase<T> & {
  results: T[];
};

export type PaginatedData<T extends { id: string | number }> = PaginatedBase<
  T
> & {
  results: Normalized<T>;
};

export type ServerElement<
  Type extends Entity,
  Children = any[],
  Params = {},
  Styles = {}
> = {
  id?: number;
  name: string;
  scenario?: number;
  struct_type: Type;
  func_type: string;
  buoyancy: number;
  image?: string | null;
  parameters: any;
  custom?: boolean;
  // Every element has entity css class, group css class and unique own css class
  // Entity class has default entity styles, own class is empty by default, group classes is user custom classes
  styles: {
    classNames: string[];
    ownStyles: Styles;
  };
  children: Children;
  shared?: boolean;
};

export type RootServerElement = ServerElement<'root', []>;
export type SectionServerElement = ServerElement<
  'section',
  ServerElement<Entity>[]
>;
export type ContainerServerElement = ServerElement<
  'container',
  ServerElement<Entity>[]
>;
export type DivBlockServerElement = ServerElement<'divBlock'>;
export type PageTemplateServerElement = ServerElement<
  'pageTemplate' | 'emptyPageTemplate',
  ContainerServerElement[]
>;
export type GridServerElement = ServerElement<'grid', ContainerServerElement[]>;
export type ColumnsServerElement = ServerElement<
  'columns',
  ContainerServerElement[]
>;
export type SubscribeFormServerElement = ServerElement<
  'subscribeForm',
  ServerElement<Entity>[]
>;
export type CardsSectionServerElement = ServerElement<
  'cardsSection',
  ServerElement<Entity>[]
>;
export type FeatureSectionServerElement = ServerElement<
  'featureSection',
  ServerElement<Entity>[]
>;
export type ImageServerElement = ServerElement<'image', [], ImageParameters>;
export type SmartHeaderServerElement = ServerElement<'smartHeader'>;
export type SmartFooterServerElement = ServerElement<'smartFooter'>;
export type SmartFormServerElement = ServerElement<'smartForm'>;
export type SmartWebpageServerElement = ServerElement<'smartWebpage'>;
export type ButtonServerElement = ServerElement<'button', [], ButtonParameters>;
export type HyperlinkServerElement = ServerElement<
  'hyperlink',
  [],
  HyperLinkParameters
>;
export type TextinputServerElement = ServerElement<
  'textinput',
  [],
  TextinputParameters
>;
export type CheckboxServerElement = ServerElement<
  'checkbox',
  [],
  CheckboxParameters
>;
export type RadiobuttonServerElement = ServerElement<
  'radiobutton',
  [],
  RadiobuttonParameters
>;
export type SelectServerElement = ServerElement<
  'select',
  SelectMenuServerElement[],
  SelectParameters
>;
export type SelectMenuServerElement = ServerElement<
  'selectMenu',
  SelectItemServerElement[]
>;
export type SelectItemServerElement = ServerElement<
  'selectItem',
  [],
  SelectItemParameters
>;
export type TextareaServerElement = ServerElement<
  'textarea',
  [],
  TextareaParameters
>;
export type HeadingServerElement = ServerElement<
  'heading',
  [],
  HeadingParameters
>;
export type ParagraphServerElement = ServerElement<
  'paragraph',
  [],
  ParagraphParameters
>;
export type OcrtextServerElement = ServerElement<
  'ocrtext',
  [],
  OcrtextParameters
>;
export type LabelServerElement = ServerElement<'label', [], LabelParameters>;
export type TextBlockServerElement = ServerElement<
  'textBlock',
  [],
  TextBlockParameters
>;
export type ListServerElement = ServerElement<
  'list',
  ListItemServerElement[],
  ListParameters
>;
export type ListItemServerElement = ServerElement<
  'listItem',
  [],
  ListItemParameters
>;
export type MapServerElement = ServerElement<'map', [], MapParameters>;
export type CalendarServerElement = ServerElement<'calendar', []>;
export type ClockServerElement = ServerElement<'clock', []>;
export type VideoServerElement = ServerElement<'video', [], VideoParameters>;
export type DropdownServerElement = ServerElement<
  'dropdown',
  DropdownMenuServerElement[],
  DropdownParameters
>;
export type DropdownMenuServerElement = ServerElement<
  'dropdownMenu',
  DropdownItemServerElement[]
>;
export type DropdownItemServerElement = ServerElement<
  'dropdownItem',
  [],
  DropdownItemParameters
>;
export type UndefinedServerElement = ServerElement<'undefined', []>;

export type ServerRecursiveElement = {
  id: number;
  name: string;
  children: [];
};

export type RecursiveElement = {
  id: string;
  name: string;
  children: [];
};

export type LibraryElement<
  Type extends Entity,
  Children = any[],
  Params = any,
  Styles = {}
> = {
  id: string;
  name: string;
  type: Type;
  buoyancy: number;
  image: string | null | undefined;
  styles: {
    classNames: string[];
    ownStyles: Styles;
  };
  children: Children;
  parameters: { group?: string } & Params;
  shared?: boolean;
};

export type LibraryElementPatch<Type extends Entity> = {
  name?: string;
  scenario?: number;
  struct_type?: Type;
  func_type?: string;
  shared?: boolean;
};

export type RootElement = LibraryElement<'root', []>;
export type ContainerElement = LibraryElement<'container', []>;
export type DivBlockElement = LibraryElement<'divBlock'>;
export type PageTemplateElement = LibraryElement<
  'pageTemplate',
  ContainerElement[]
>;
export type SubscribeFormElement = LibraryElement<
  'subscribeForm',
  LibraryElement<Entity>[]
>;
export type CardsSectionElement = LibraryElement<
  'cardsSection',
  LibraryElement<Entity>
>;
export type ImageElement = LibraryElement<'image', [], ImageParameters>;
export type ButtonElement = LibraryElement<'button', [], ButtonParameters>;
export type HyperlinkElement = LibraryElement<
  'hyperlink',
  [],
  HyperLinkParameters
>;
export type TextinputElement = LibraryElement<
  'textinput',
  [],
  TextinputParameters
>;
export type CheckboxElement = LibraryElement<
  'checkbox',
  [],
  CheckboxParameters
>;
export type RadiobuttonElement = LibraryElement<
  'radiobutton',
  [],
  RadiobuttonParameters
>;
export type SelectElement = LibraryElement<
  'select',
  SelectMenuElement[],
  SelectParameters
>;
export type SelectMenuElement = LibraryElement<
  'selectMenu',
  SelectItemElement[]
>;
export type SelectItemElement = LibraryElement<
  'selectItem',
  [],
  SelectItemParameters
>;
export type TextareaElement = LibraryElement<
  'textarea',
  [],
  TextareaParameters
>;
export type HeadingElement = LibraryElement<'heading', [], HeadingParameters>;
export type ParagraphElement = LibraryElement<
  'paragraph',
  [],
  ParagraphParameters
>;
export type OcrtextElement = LibraryElement<'ocrtext', [], OcrtextParameters>;
export type LabelElement = LibraryElement<'label', [], LabelParameters>;
export type TextBlockElement = LibraryElement<
  'textBlock',
  [],
  TextBlockParameters
>;
export type ListElement = LibraryElement<
  'list',
  ListItemElement[],
  ListParameters
>;
export type ListItemElement = LibraryElement<
  'listItem',
  [],
  ListItemParameters
>;
export type MapElement = LibraryElement<'map', [], MapParameters>;
export type CalendarElement = LibraryElement<'calendar', []>;
export type ClockElement = LibraryElement<'clock', []>;
export type VideoElement = LibraryElement<'video', [], VideoParameters>;
export type DropdownElement = LibraryElement<
  'dropdown',
  DropdownMenuElement[],
  DropdownParameters
>;
export type DropdownMenuElement = LibraryElement<
  'dropdownMenu',
  DropdownItemElement[]
>;
export type DropdownItemElement = LibraryElement<
  'dropdownItem',
  [],
  DropdownItemParameters
>;
export type UndefinedElement = LibraryElement<'undefined', []>;

export type FeatureSectionElement = LibraryElement<
  'featureSection',
  LibraryElement<Entity>[]
>;

export type LibraryElementUnion =
  | RootElement
  | ContainerElement
  | DivBlockElement
  | ImageElement
  | ButtonElement
  | HyperlinkElement
  | TextinputElement
  | CheckboxElement
  | RadiobuttonElement
  | SelectElement
  | SelectMenuElement
  | SelectItemElement
  | TextareaElement
  | HeadingElement
  | ParagraphElement
  | OcrtextElement
  | LabelElement
  | TextBlockElement
  | ListElement
  | ListItemElement
  | MapElement
  | CalendarElement
  | ClockElement
  | VideoElement
  | DropdownElement
  | DropdownMenuElement
  | DropdownItemElement
  | PageTemplateElement
  | UndefinedElement
  | SubscribeFormElement
  | FeatureSectionElement;

/* eslint-disable camelcase */

export type ImageParameters = {
  imageURL: string;
};

export type InternalLink = {
  type: 'internal-link';
  screenID: number | 'noScreen';
};
export type ExternalLink = { type: 'external-link'; url: string };

export type LinkParams = InternalLink | ExternalLink;

export type ButtonParameters = {
  textContent: string;
  action: LinkParams;
  showRipple: boolean;
};

export type HyperLinkParameters = {
  textContent: string;
  action: LinkParams;
};

export type InputType = 'text' | 'email' | 'number' | 'phone' | 'password';

export type TextinputParameters = {
  type: InputType;
  textContent: string;
  placeholder: string;
};

export type CheckboxParameters = {
  value: string;
  name: string;
  showRipple: boolean;
  defaultChecked: boolean;
};

export type RadiobuttonParameters = {
  value: string;
  name: string;
  showRipple: boolean;
};

export type SelectParameters = {
  value: string;
  options: Option[];
  isOpen: boolean;
};

export type SelectItemParameters = {
  name: string;
  value: string;
};

export type TextareaParameters = {
  textContent: string;
  placeholder: string;
};

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingParameters = {
  textContent: string;
  headingType: HeadingType;
};

export type ParagraphParameters = {
  textContent: string;
};

export type OcrtextParameters = {
  textContent: string;
};

export type LabelParameters = {
  textContent: string;
  labelFor: string;
};

export type TextBlockParameters = {
  textContent: string;
};

export type ListParameters = {
  listItems: ListItem[];
  isOrdered: boolean;
};

export type ListItemParameters = {
  textContent: string;
  isLink: boolean;
  link: string;
};

export type MapProps = {
  map_props: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
    markerText: string;
  };
};

export type MapParameters = {
  map_props: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
    markerText: string;
  };
};

export type VideoSettingsType = {
  link: string;
  autoplay: boolean;
  start: number;
  end: number;
  loop: boolean;
  rel: boolean;
};

export type VideoParameters = {
  videoSettings: VideoSettingsType;
};

export type DropdownParameters = {
  textContent: string;
  showRipple: boolean;
  isOpen: boolean;
  dropdownItems: string[];
};

export type DropdownItemParameters = {
  textContent: string;
};

export type CreatedServerProject = {
  name: string;
  status: string;
  projectscreen: number[];
  project_data_json: string;
};

export type ServerProject = {
  id: number;
  name: string;
  status: string;
  projectscreen: number[];
  created: string;
  updated: string;
  project_data_json: string;
  project_data_text: string;
};

export type ProjectClass = {
  className: string;
  supportedElement: Entity;
  rules: Required<CssLikeStyles>;
};

export type Project = {
  id: number;
  name: string;
  status: string;
  projectscreen: number[];
  projectLoader: boolean;
  created: Date;
  updated: Date;
  projectData: {
    classes: ProjectClass[];
  };
};

export type ProjectWithScreens = {
  id: number;
  name: string;
  status: string;
  projectLoader: boolean;
  created: Date;
  updated: Date;
  projectData: {
    classes: ProjectClass[];
  };
  projectscreen: Screen[];
};

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
  shared?: boolean;
};

export type BorderedElementsRef = {
  [id: string]: React.RefObject<HTMLElement>;
};

export type DropTargetParams = {
  id: string;
  position?: DropPosition;
};

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
  notification: Notification | null;
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
  projectListLoader: boolean;
  loader: boolean; // TODO: pick more suitable name
  screenLoader: boolean;
  projectLoader: boolean;
  scenarioLoader: boolean;
  analyzerLoader: boolean;
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
  id?: string;
  type: Entity | string;
  name: string;
  custom: boolean;
};

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
  Normalized<StateElement>,
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
export type DeleteItem = IAction<
  typeof TYPES.DELETE_ITEM,
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
export type SetItemToCopy = IAction<
  typeof TYPES.SET_ITEM_TO_COPY,
  ItemToCopyInfo
>;
export type SetRightPanelActiveTab = IAction<
  typeof TYPES.SET_RIGHT_PANEL_ACTIVE_TAB,
  RightPanelTab
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
  | SetAnalyzerLoader
  | DeleteScreen
  | RenameScreen
  | AddScreen
  | ActivateScreen
  | ClearAfterPrevScreen
  | SaveScreen
  | SetCurrentScreenId
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
  | ReturnType<typeof setActiveElementId>
  | SetHoveredElement
  | ToggleContainersBorders
  | SetItemToCopy
  | SetRightPanelActiveTab
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
  | ReturnType<typeof moveStateElement>
  | ReturnType<typeof updateStateElement>
  | ReturnType<typeof addStateElements>
  | ReturnType<typeof insertStateElement>
  | ReturnType<typeof removeStateElement>
  | ReturnType<typeof setProjectsData>
  | ReturnType<typeof extractStateElement>
  | ReturnType<typeof changeFreeCanvasMode>
  | ReturnType<typeof updateLastElements>
  | ReturnType<typeof changeScreenFormat>
  | ReturnType<typeof rotateScreenFormat>
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
  | RemoveFileInput;

export type ItemToCopyInfo = {
  id: string;
  screenID: number;
};

export type Block = {
  display: 'block';
};

export type InlineBlock = {
  display: 'inline-block';
};

export type Inline = {
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
  is_shared?: boolean;
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

export type ElementData = {
  key: string;
  id?: string;
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

export type ElementsToDrop = {
  elements: ServerElement<Entity>[];
  index?: number;
};

/* eslint-disable camelcase */

export interface ITokenPair {
  access: string;
  refresh: string;
}

export type LoginFormData = {
  username: string;
  password: string;
};

export type SignupFormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ServerProfileData = {
  avatar: null | string;
  hourly_rate: number;
  approved: boolean;
  role: string;
};

export type ServerUserData = {
  date_joined: string;
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  id: number;
  is_active: boolean;
};

export type ProfileData = {
  avatar: null | string;
  approved: boolean;
  role: string;
  hourlyRate: number;
};

export type UserData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date | null;
  isActive: boolean;
  id: number;
  password: string;
};

export type TotalUserData = ProfileData & UserData;

export type UserState = {
  isLPanelMinimized: boolean;
  isPrototypeMode: boolean;
  freeCanvasMode: {
    enabled: boolean;
  };
  tokenPair: ITokenPair;
  isLoadedToken: boolean;
  isLoggedIn: boolean;
  authError: Error | null;
  userData: TotalUserData;
  restorePasswordEmail?: string;
  restoreUserId?: number;
  isLoading: boolean;
  confirmMessage: string;
};

export type UnsafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : any;

export type FreeElement = {
  id: string;
  top: number;
  left: number;
  type: 'freeElement';
  name: string;
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

export interface ICommunication<E = string> {
  isRequesting: boolean;
  error: E;
}

export interface IFailAction<T, P, E = string> extends IPlainFailAction<T, E> {
  payload: P;
}

export interface IProtectAction {
  type: '';
  error: any;
}

export interface ICommunicationActionCreators<E, C, F> {
  execute: E;
  success: C;
  fail: F;
}

export type IGenericPlainAction = IPlainAction<string>;
export type IGenericAction = IAction<string, any>;
export type IGenericPlainFailAction = IPlainFailAction<string>;
export type IGenericFailAction = IFailAction<string, any>;

export type NullaryAC<A extends IGenericPlainAction> = () => A;
export type UnaryAC<A extends IGenericAction> = (payload: A['payload']) => A;

export type NullaryFailedAC<A extends IGenericPlainFailAction> = (
  error: A['error'],
) => A;
export type UnaryFailedAC<A extends IGenericFailAction> = (
  error: A['error'],
  payload: A['payload'],
) => A;

export type AppReduxState = {
  user: UserState;
  project: ProjectState;
  router: RouterState;
};

export type ReturnPromisedType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : ReturnType<T>;

export type SyntheticGlobalElement<T, P> = {
  type: string;
  original?: T;
  canDrop?: (monitor: DropTargetMonitor, collectedParams?: P) => boolean;
  drop?: (monitor: DropTargetMonitor, collectedParams?: P) => void;
  hover?: (monitor: DropTargetMonitor, collectedParams?: P) => boolean;
  collect?: (monitor: DropTargetMonitor, collectedParams?: P) => void;
};

export type ElementEntity = keyof ElementsToAdd;
export type ChildEntity = keyof ChildrenElements;

export type Entity = ElementEntity | ChildEntity;

export type AvailableControls = {
  [P in Entity]: readonly Control[];
};

export type Control =
  | typeof CONTROLS_AFFECT_ON_PARAMS[number]
  | typeof CONTROLS_AFFECT_ON_STYLES[number];

export type AvailableChildren = {
  [P in Entity | string]: {
    [key: string]: {
      min: number;
      max: number;
    };
  };
};

export type SyntheticElement<T> = {
  original: T;
  parent?: StateElement;
  type: ElementType;
};

export type Params<T extends LibraryElement<Entity>> = Partial<T['parameters']>;

export type PropertiesChangeProps<T extends LibraryElement<Entity>> = {
  activeItemID: string;
  removeStyles(cssPropertiesNames: string[]): void;
  updateStyles(payload: CssLikeStyles): void;
  updateParams(payload: Params<T>, updatedItemID?: string): void;
};

export type ActionType = 'external-link' | 'internal-link' | 'button';

export type WithActionProps = {
  actionLink: string;
  actionType: ActionType;
  onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
};

export type MyAxiosProps = { access?: string; contentType?: string } & Partial<
  AxiosRequestConfig
>;

export type Node = {
  id: string;
  data: { title: string; type: Entity | 'none' };
  hasChildren: boolean;
  isExpanded: boolean;
  children: string[];
};

export type BorderStyles = {
  top: number;
  bottom: number;
  right: number;
  left: number;
  width: number;
  height: number;
};

export type StyleProps = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
};

export type ChildrenElements = {
  selectMenu: SelectMenuServerElement;
  selectItem: SelectItemServerElement;
  listItem: ListItemServerElement;
  dropdownMenu: DropdownMenuServerElement;
  dropdownItem: DropdownItemServerElement;
};

export type ElementsToAdd = {
  root: RootServerElement;
  container: ContainerServerElement;
  divBlock: DivBlockServerElement;
  pageTemplate: PageTemplateServerElement;
  emptyPageTemplate: PageTemplateServerElement;
  grid: GridServerElement;
  columns: ColumnsServerElement;
  image: ImageServerElement;
  smartHeader: SmartHeaderServerElement;
  smartFooter: SmartFooterServerElement;
  smartForm: SmartFormServerElement;
  smartWebpage: SmartWebpageServerElement;
  button: ButtonServerElement;
  hyperlink: HyperlinkServerElement;
  textinput: TextinputServerElement;
  checkbox: CheckboxServerElement;
  radiobutton: RadiobuttonServerElement;
  select: SelectServerElement;
  label: LabelServerElement;
  textarea: TextareaServerElement;
  heading: HeadingServerElement;
  paragraph: ParagraphServerElement;
  ocrtext: OcrtextServerElement;
  textBlock: TextBlockServerElement;
  list: ListServerElement;
  map: MapServerElement;
  calendar: CalendarServerElement;
  clock: ClockServerElement;
  dropdown: DropdownServerElement;
  video: VideoServerElement;
  undefined: UndefinedServerElement;
  subscribeForm: SubscribeFormServerElement;
  cardsSection: CardsSectionServerElement;
  featureSection: FeatureSectionServerElement;
  section: SectionServerElement;
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type LibraryEntities = LibraryElements;

export type GroupElement = {
  key: string;
  name: string;
  label: string;
  custom?: boolean;
  value: { structType: ServerStructType; funcType: ServerStructType };
};

export interface IListCategoryEl {
  [x: string]: ScenarioLibraryElement[];
}

export type CssLikeStyles = {
  display?: ScreenDisplay['display'];

  width?: string;
  height?: string;

  'min-height'?: string;
  'min-width'?: string;
  'max-width'?: string;

  'margin-top'?: string;
  'margin-right'?: string;
  'margin-bottom'?: string;
  'margin-left'?: string;
  'padding-top'?: string;
  'padding-right'?: string;
  'padding-bottom'?: string;
  'padding-left'?: string;

  'border-style'?: string;
  'border-width'?: string;
  'border-color'?: string;
  'border-radius'?: string;

  'background-color'?: string;
  'background-image'?: string;
  'background-repeat'?: string;
  'background-size'?: string;
  'background-position'?: string;

  'font-family'?: string;
  color?: string;
  'font-size'?: string;
  'line-height'?: string;
  'font-style'?: string;
  'font-weight'?: number;
  'text-align'?: string;

  'flex-direction'?: Flex['flexDirection'];
  'align-items'?: Flex['alignItems'];
  'justify-content'?: Flex['justifyContent'];
  'flex-grow'?: number;

  'list-style-type'?: 'none' | 'disc';
  overflow?: string;
};

export interface ISignUpData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}
