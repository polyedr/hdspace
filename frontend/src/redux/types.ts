import { RouterState } from 'connected-react-router';
import React from 'react';
import { OptionsObject, SnackbarKey } from 'notistack';
import { XYCoord } from 'react-dnd';
import { DropPosition, ElementType } from '@Constants/dragAndDrop';
import {
  CreatedElement,
  DropTargetParams,
  Entity,
  Indices,
  ItemToCopyInfo,
  TokenPair,
  ViewTokenPair,
  LibraryElement,
  LibraryElementPatch,
  NNBlockType,
  Normalized,
  PaginatedArray,
  PaginatedData,
  ParentIds,
  Project,
  PropertyName,
  SavedElementsValues,
  Screen,
  Layout,
  ServerStructType,
  StateElement,
  UploadedImageInfo,
  UserData,
  AssetsList,
  Asset,
  AssetResults,
  ProjectsSearchParameter,
  DateRange,
  StateElementsToAdd,
  VIARegion,
  PaginatedResponse,
  UserProjectPermission,
  PermissionsUserData,
  EditScreenData,
  ProfileDataUIParameters,
  VIAFile,
  VIAData,
  FileToUpload,
  UIFramework,
  ElementData,
  NNModelName,
  VIARegions,
  importData,
  ParsedImagePalette,
  UserSubscriptionsData,
  Marketplace,
  TemplatesSearchParameter,
} from '../types';
import TYPES from './actionTypes';

export interface PermissionsState {
  allUsersList: PaginatedData<UserData> & { search: string };
  projectUsersPermissionsList: {
    loading: boolean;
    projectId: number | null;
    data: Normalized<PermissionsUserData & { id: string }>; // use userId as key
  };
  currentUserProjectPermissions: UserProjectPermission[];
}

export interface ProjectDataState {
  projectsData: PaginatedData<Project> & {
    parameter: [ProjectsSearchParameter, string | DateRange];
  };
  screens: Normalized<Screen>;
  elements: Normalized<StateElement>;
  customElementsData: PaginatedArray<LibraryElement<Entity>>;
  elementInputs: Record<string, File>;
  assetLists: PaginatedArray<AssetsList>;
  assetResults: AssetResults;
  assetImageList: boolean;
  imagePalette: ParsedImagePalette | null;
  backGroundAssetsList: boolean;
  createProjectError: string | null;
}

export interface MarketplaceDataState {
  marketplaceData: PaginatedData<Marketplace> & {
    parameter: [TemplatesSearchParameter, string | DateRange];
  };
}

export interface ProjectUiState {
  editableStyles: string;
  itemToCopyInfo: ItemToCopyInfo | null;
  savedElementsValues: SavedElementsValues;
  showContainersBorders: boolean;
  showGrid: boolean;
  exportScreenFlag: boolean;
  currentDropTargetParams: DropTargetParams | null;
  bordersEnabled: boolean;
  canCreateGroup: boolean;
  layout: {
    value: Layout;
    rotated: boolean;
  };
  editorDocument: Document | null;
  newScreenModalOpen: boolean;
  pseudoClass: string | null;
  sidebar: {
    open: boolean;
    iframe: null | HTMLIFrameElement;
    host: string;
  };
  isCanImportSite: boolean;
}

export interface ProjectEditState {
  currentProjectId: number;
  currentScreenId: number;
  activeElementId: string;
  hoveredElementId: string;
  masterCoreElementId: string;
  masterGroupsElementId: string;
  selectedAssetListId: string | null;
  uploadedImageInfo?: UploadedImageInfo;
  selectedElementsIds: string[];
  masterScreenId: number | null;
  activeNNModel: NNModelName;
  isLibraryTab: Boolean;
  VIAMode: {
    enabled: boolean;
    regions: {
      fdict: Normalized<VIARegion>;
      fordict: Normalized<VIARegion>;
      opencvdict: Normalized<VIARegion>;
      cnndict: Normalized<VIARegion>;
    };
    activeRegionId: string;
    annotatedElementId: string;
    annotatedImageFile: FileToUpload | null;
    copiedRegion: VIARegion | null;
    resultId: string;
    blockType: NNBlockType;
    viaData: {
      fdict: Record<string, Omit<VIAFile, 'regions'>>;
      fordict: Record<string, Omit<VIAFile, 'regions'>>;
      opencvdict: Record<string, Omit<VIAFile, 'regions'>>;
      cnndict: Record<string, Omit<VIAFile, 'regions'>>;
    };
  };
  freeCanvas: {
    lastElements: Record<
      string,
      {
        offset: number;
        elements: string[];
      }
    >;
  };
  preSelectedElementId: string | null;
  masterSourceElementId: string | null;
}

export interface ProjectCommunicationState {
  screenCreateLoader: boolean;
  updateImageLoader: boolean;
  screenLoader: boolean; // TODO: make sure this loader is useless
  masterScreenLoader: boolean;
  projectLoader: boolean;
  projectCreateLoader: boolean;
  analyzerLoader: boolean;
  assetsListsLoader: boolean;
  importLoader: boolean;
  importValue: importData;
}

export interface ProjectControlState {
  history: HistoryRecord[];
  currentHistoryRecord: number;
}

export interface ProjectState {
  data: ProjectDataState;
  ui: ProjectUiState;
  edit: ProjectEditState;
  communication: ProjectCommunicationState;
  control: ProjectControlState;
}
export interface MarketplaceState {
  data: MarketplaceDataState;
}

export interface UserState {
  isLPanelMinimized: boolean;
  isPrototypeMode: boolean;
  dropTargetBordersMode: boolean;
  freeCanvasMode: {
    enabled: boolean;
  };
  tokenPair: TokenPair;
  isTokenLoaded: boolean;
  isLoggedIn: boolean;
  error: Error | null;
  userData: UserData;
  restorePasswordEmail?: string;
  restoreUserId?: number;
  isLoading: boolean;
  confirmMessage: string;
  viewTokenPair?: ViewTokenPair | null;
  userGuide: {
    active: boolean;
  };
  subscriptionData: UserSubscriptionsData;
}

export interface Notification {
  key: SnackbarKey;
  message: string;
  dismissed?: boolean;
  options?: OptionsObject;
}

export interface HistoryRecord {
  action: Action;
  undo: Action[];
  redo: Action[];
}

export interface NotificationState {
  notifications: Notification[];
}

export interface AppReduxState {
  user: UserState;
  project: ProjectState;
  router: RouterState;
  notification: NotificationState;
  permissions: PermissionsState;
  marketplace: MarketplaceState;
}

export interface WrapIntoContainerData {
  containerType: Entity;
  name: string | null;
  ids: string[];
}

export interface CreateScreenData {
  projectID: number;
  name: string;
  buoyancy: number;
  rootName?: string;
  freeCanvas?: boolean;
  styles?: any;
}

export interface UploadAssetData {
  assetFile: any | null;
  fileName: string;
  listId: string;
  imageURL?: string;
}

export interface RestoreChildrenData {
  id: string;
  children: string[];
}

export type LoadProjects = IPlainAction<typeof TYPES.LOAD_PROJECTS>;

export type GetSubscriptionDataType = IPlainAction<
  typeof TYPES.SUBSCRIPTION_DATA
>;

export type SetUsersSearchValue = IAction<
  typeof TYPES.SET_USERS_SEARCH,
  { search: string }
>;
export type SearchProjects = IPlainAction<typeof TYPES.SEARCH_PROJECTS>;
export type SetProjectSearchParameter = IAction<
  typeof TYPES.SET_PROJECT_SEARCH_PARAMETER,
  [ProjectsSearchParameter, string | DateRange]
>;
export type LoadProjectsSuccess = IAction<
  typeof TYPES.SET_PROJECT_LIST,
  { projects: Project[] }
>;
export type LoadProjectsFail = IPlainFailAction<'projects/LOAD_PROJECTS_FAIL'>;

export type LoadProjectUsersSuccess = IAction<
  typeof TYPES.SET_PROJECT_USERS_DATA,
  { users: UserData[] }
>;

export type SetUsersSearchTemplateValue = IAction<
  typeof TYPES.SET_USERS_SEARCH_TEMPLATES,
  { search: string }
>;

export type SearchTemplates = IPlainAction<typeof TYPES.SEARCH_TEMPLATES>;

export type SetTemplateSearchParameter = IAction<
  typeof TYPES.SET_TEMPLATE_SEARCH_PARAMETER,
  [TemplatesSearchParameter, string | DateRange]
>;

export type LoadTemplatesSuccess = IAction<
  typeof TYPES.SET_TEMPLATES_LIST,
  { marketplace: Marketplace[] }
>;
export type LoadTemplatesFail =
  IPlainFailAction<'marketplace/LOAD_TEMPLATES_FAIL'>;

export type CreateProject = IAction<
  typeof TYPES.CREATE_PROJECT,
  { name: string }
>;
export type DeleteProject = IAction<
  typeof TYPES.DELETE_PROJECT,
  { id: number }
>;

export type ProjectError = IAction<
  typeof TYPES.SET_PROJECT_ERROR,
  { errorResponse: string | null }
>;

export type GetProject = IAction<typeof TYPES.GET_PROJECT, { id: number }>;

export type LoadTemlates = IPlainAction<typeof TYPES.LOAD_TEMPLATES>;
export type GetSharedProject = IAction<
  typeof TYPES.GET_SHARED_PROJECT,
  { shortuuid_token: string }
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
export type UpdateCurrentUIFramework = IAction<
  typeof TYPES.UPDATE_CURRENT_UI_FRAMEWORK,
  {
    uiFramework: UIFramework;
  }
>;
export type UpdateCurrentUIFrameworkVariables = IAction<
  typeof TYPES.UPDATE_CURRENT_UI_FRAMEWORK_VARIABLES,
  Record<string, string>
>;
export type ResetCurrentUIFrameworkVariables = IPlainAction<
  typeof TYPES.RESET_CURRENT_UI_FRAMEWORK_VARIABLES
>;
export type ChangeScreensOrder = IAction<
  typeof TYPES.CHANGE_SCREENS_ORDER,
  Indices
>;
export type UpdateNameAndTagsProject = IAction<
  typeof TYPES.UPDATE_NAME_AND_TAGS_PROJECT,
  { projectID: number; name: string; tags: string }
>;
export type UpdateLayoutProjects = IAction<
  typeof TYPES.UPDATE_LAYOUT_PROJECT,
  { projectID: number; projectDataJson: string }
>;
export type SetProjectListLoader = IAction<
  typeof TYPES.SET_PROJECT_LIST_LOADER,
  { active: boolean }
>;
export type SetMarketplaceListLoader = IAction<
  typeof TYPES.SET_MARKETPLACE_LIST_LOADER,
  { active: boolean }
>;
export type SetProjectUsersLoader = IAction<
  typeof TYPES.SET_PROJECT_USERS_LOADER,
  { active: boolean }
>;
export type SetUsersLoader = IAction<
  typeof TYPES.SET_USERS_LOADER,
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
export type SetMasterScreenLoader = IAction<
  typeof TYPES.SET_MASTER_SCREEN_LOADER,
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
export type SetAssetsListsLoader = IAction<
  typeof TYPES.SET_ASSETS_LISTS_LOADER,
  { active: boolean }
>;
export type DeleteScreen = IAction<
  typeof TYPES.DELETE_SCREEN,
  { projectId: number; screenId: number }
>;
export type RestoreScreen = IAction<
  typeof TYPES.RESTORE_SCREEN,
  { projectId: number; screenId: number },
  HistoryMeta
>;
export type EditScreenNameAndData = IAction<
  typeof TYPES.EDIT_SCREEN_NAME_AND_DATA,
  {
    projectID: number;
    screenID: number;
    editData: EditScreenData;
  }
>;
export type CreateScreen = IAction<
  typeof TYPES.CREATE_SCREEN,
  CreateScreenData,
  HistoryMeta
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
export type SetSelectedAssetListId = IAction<
  typeof TYPES.SET_SELECTED_ASSET_LIST_ID,
  { assetListId: string | null }
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
  },
  HistoryMeta
>;
export type ToggleContainersBorders = IAction<
  typeof TYPES.TOGGLE_CONTAINERS_BORDERS,
  boolean
>;
export type ToggleGrid = IAction<typeof TYPES.TOGGLE_GRID, boolean>;
export type ExportScreenFlag = IAction<
  typeof TYPES.EXPORT_SCREEN_FLAG,
  boolean
>;
export type SetBordersEnabled = IAction<
  typeof TYPES.SET_BORDERS_ENABLED,
  boolean
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

export type UpdateDefaultStyles = IAction<
  typeof TYPES.UPDATE_DEFAULT_STYLES,
  { classNames: Entity[]; styles: React.CSSProperties; controlKey: string },
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
export type UpdateMultipleElementsStyles = IAction<
  typeof TYPES.UPDATE_MULTIPLE_ELEMENTS_STYLES,
  {
    ids: string[];
    styles: Record<string, React.CSSProperties>;
  },
  ElementHistoryMeta
>;
export type ReplaceMultipleElementsStyles = IAction<
  typeof TYPES.REPLACE_MULTIPLE_ELEMENTS_STYLES,
  { ids: string[]; styles: Record<string, React.CSSProperties> },
  ElementHistoryMeta
>;
export type RemoveMultipleElementsStyles = IAction<
  typeof TYPES.REMOVE_MULTIPLE_ELEMENTS_STYLES,
  { ids: string[]; cssPropertiesNames: string[] },
  ElementHistoryMeta
>;
export type UpdateElementImage = IAction<
  typeof TYPES.UPDATE_ELEMENT_IMAGE,
  { itemID: string; image: File },
  ElementHistoryMeta
>;
export type UploadElementAsset = IAction<
  typeof TYPES.UPLOAD_ELEMENT_ASSET,
  {
    elementId: string;
    asset: AssetData;
    listId: string;
  },
  ElementHistoryMeta
>;

export interface AssetData {
  file?: any | null;
  imageURL?: string;
  useInBackground?: boolean;
}

export interface ImageData {
  url: string;
  useInBackground?: boolean;
}

export type UpdateElementParameters = IAction<
  typeof TYPES.UPDATE_ELEMENT_PARAMETERS,
  {
    elementId: string;
    parameters: LibraryElement<Entity>['parameters'];
  },
  ElementHistoryMeta
>;
export type ReplaceElementParameters = IAction<
  typeof TYPES.REPLACE_ELEMENT_PARAMETERS,
  {
    elementId: string;
    parameters: LibraryElement<Entity>['parameters'];
  },
  ElementHistoryMeta
>;
export type UpdateMultipleElementsParameters = IAction<
  typeof TYPES.UPDATE_MULTIPLE_ELEMENTS_PARAMETERS,
  {
    ids: string[];
    parameters: Record<string, LibraryElement<Entity>['parameters']>;
  },
  ElementHistoryMeta
>;
export type ReplaceMultipleElementsParameters = IAction<
  typeof TYPES.REPLACE_MULTIPLE_ELEMENTS_PARAMETERS,
  {
    ids: string[];
    parameters: Record<string, LibraryElement<Entity>['parameters']>;
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
export type SoftDeleteElement = IAction<
  typeof TYPES.SOFT_DELETE_ELEMENT,
  { id: string },
  ElementHistoryMeta
>;

export type SoftDeleteMultipleElements = IAction<
  typeof TYPES.SOFT_DELETE_MULTIPLE_ELEMENTS,
  { ids: string[] },
  ElementHistoryMeta
>;
export type CreateElements = IAction<
  typeof TYPES.CREATE_ELEMENTS,
  { createdElements: CreatedElement[]; parentId?: string; index?: number },
  ElementHistoryMeta
>;

export type CreateChildElements = IAction<
  typeof TYPES.CREATE_CHILD_ELEMENTS,
  { createdElements: CreatedElement[]; parentId?: string; index?: number },
  ElementHistoryMeta
>;

export type CreateGroupChildren = IAction<
  typeof TYPES.CREATE_GROUP_CHILDREN,
  { createdElements: CreatedElement[]; parentId?: string; index?: number },
  ElementHistoryMeta
>;

export type CreateLibraryElements = IAction<
  typeof TYPES.CREATE_LIBRARY_ELEMENTS,
  { createdElements: CreatedElement[]; parentId?: string; index?: number },
  ElementHistoryMeta
>;

export type CreateElementsGroup = IAction<
  typeof TYPES.CREATE_ELEMENTS_GROUP,
  { name: string; ids: string[] },
  ElementHistoryMeta
>;

export type AddChildrenToElement = IAction<
  typeof TYPES.ADD_CHILDREN_TO_ELEMENT,
  {
    children: Array<{ childType: ServerStructType; parameters: {} }>;
    elementId: string;
  },
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
export type AutoAnalyzeImage = IAction<
  typeof TYPES.AUTO_ANALYZE_IMAGE,
  { file: any; parentId: string; blockType: NNBlockType },
  ElementHistoryMeta
>;
export type RecognizeImage = IAction<
  typeof TYPES.RECOGNIZE_IMAGE,
  { file: any; parentId: string; blockType: NNBlockType },
  ElementHistoryMeta
>;
export type uploadImageForNNSuccess = IAction<
  typeof TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS,
  { imageURL: string; screenID: number }
>;
export type WrapIntoContainer = IAction<
  typeof TYPES.WRAP_INTO_CONTAINER,
  { id: string },
  ElementHistoryMeta
>;
export type WrapMultipleElementsIntoContainer = IAction<
  typeof TYPES.WRAP_MULTIPLE_ELEMENTS_INTO_CONTAINER,
  { ids: string[] },
  ElementHistoryMeta
>;
export type SetHoveredElementId = IAction<
  typeof TYPES.SET_HOVERED_ELEMENT,
  string | null
>;
export type SetMasterCoreElementId = IAction<
  typeof TYPES.SET_MASTER_CORE_ELEMENT_ID,
  { id: string }
>;
export type SetMasterGroupsElementId = IAction<
  typeof TYPES.SET_MASTER_GROUPS_ELEMENT_ID,
  { id: string }
>;
export type SetMasterElementsIds = IAction<
  typeof TYPES.SET_MASTER_ELEMENTS_IDS,
  { masterGroupsId: string; masterCoreId: string }
>;
export type SetCurrentDropTargetParams = IAction<
  typeof TYPES.SET_CURRENT_DROP_TARGET_PARAMS,
  { id: string; position: DropPosition }
>;
export type ProcessDropTargetParams = IAction<
  typeof TYPES.PROCESS_DROP_TARGET_PARAMS,
  {
    elementId: string;
    rect: DOMRect;
    offset: XYCoord;
    isHorizontal: boolean;
  }
>;
export type ProcessDropElement = IAction<
  typeof TYPES.PROCESS_DROP_ELEMENT,
  {
    dragSource: StateElement | ElementData;
    dropType: ElementType;
  }
>;

export type SetEditableStyles = IAction<
  typeof TYPES.SET_EDITABLE_STYLES,
  { className: string }
>;
export type SetElementToCopy = IAction<
  typeof TYPES.SET_ELEMENT_TO_COPY,
  ItemToCopyInfo
>;
export type CopyActiveElement = IPlainAction<typeof TYPES.COPY_ACTIVE_ELEMENT>;
export type PasteCopiedElement = IPlainAction<
  typeof TYPES.PASTE_COPIED_ELEMENT,
  ElementHistoryMeta
>;
export type PasteCopiedElementAtIndex = IPlainAction<
  typeof TYPES.PASTE_COPIED_ELEMENT_AT_INDEX,
  ElementMetaIndex
>;
export type ResetProjectState = IPlainAction<typeof TYPES.RESET_SCREEN_STATE>;
// history actions
export type StartHistoryRecord = IAction<
  typeof TYPES.START_HISTORY_RECORD,
  { source: Action }
>;
export type ExecuteUndoActions = IPlainAction<
  typeof TYPES.EXECUTE_UNDO_ACTIONS
>;
export type ExecuteRedoActions = IPlainAction<
  typeof TYPES.EXECUTE_REDO_ACTIONS
>;
export type AddUndoActions = IAction<
  typeof TYPES.ADD_UNDO_ACTIONS,
  { actions: Action[] }
>;
export type AddRedoActions = IAction<
  typeof TYPES.ADD_REDO_ACTIONS,
  { actions: Action[] }
>;
export type AddHistoryActions = IAction<
  typeof TYPES.ADD_HISTORY_ACTIONS,
  { undo: Action[]; redo?: Action[] }
>;
export type MoveHistoryForward = IPlainAction<
  typeof TYPES.MOVE_HISTORY_FORWARD
>;
export type MoveHistoryBackward = IPlainAction<
  typeof TYPES.MOVE_HISTORY_BACKWARD
>;
// /historyActions
export type UnbindGroupElementStyles = IAction<
  typeof TYPES.UNBIND_GROUP_ELEMENT_STYLES,
  { id: string; styles: React.CSSProperties },
  ElementHistoryMeta
>;
export type UnbindMasterGroupInstance = IAction<
  typeof TYPES.UNBIND_MASTER_INSTANCE,
  { id: string },
  ElementHistoryMeta
>;
export type UnwrapFromContainer = IAction<
  typeof TYPES.UNWRAP_FROM_CONTAINER,
  { ids: string[]; wrapperId: string; parentId: string },
  ElementHistoryMeta
>;
export type RestoreElementChildren = IAction<
  typeof TYPES.RESTORE_ELEMENT_CHILDREN,
  { elementId: string; childrenIds: string[] },
  ElementHistoryMeta
>;
export type RestoreMultipleElementsChildren = IAction<
  typeof TYPES.RESTORE_MULTIPLE_ELEMENTS_CHILDREN,
  { elements: RestoreChildrenData[] },
  ElementHistoryMeta
>;
export type RestoreElement = IAction<
  typeof TYPES.RESTORE_ELEMENT,
  string,
  ElementHistoryMeta
>;
export type RedoWrapIntoContainer = IAction<
  typeof TYPES.REDO_WRAP_INTO_CONTAINER,
  { ids: string[]; wrapperId: string; parentId: string },
  ElementHistoryMeta
>;
export type Logout = IPlainAction<typeof TYPES.LOGOUT>;
export type AddElements = IAction<
  typeof TYPES.ADD_ELEMENTS,
  { elements: Array<LibraryElement<any>>; parentId?: string }
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

export type LoadAssetLists = IAction<typeof TYPES.LOAD_ASSET_LISTS, string>;

export type LoadAssets = IAction<
  typeof TYPES.LOAD_ASSETS,
  {
    selectedListId: string;
  }
>;

export type SetAssetLists = IAction<
  typeof TYPES.SET_ASSET_LISTS,
  PaginatedArray<AssetsList>
>;

export type SetAssets = IAction<
  typeof TYPES.SET_ASSETS,
  {
    listId: string;
    assets: PaginatedArray<Asset>;
  }
>;

export type AddStateAssetList = IAction<
  typeof TYPES.ADD_STATE_ASSET_LIST,
  AssetsList
>;

export type AddAssetList = IAction<
  typeof TYPES.ADD_ASSET_LIST,
  {
    name: string;
    meta?: HistoryMeta;
  }
>;

export type UploadAsset = IAction<
  typeof TYPES.UPLOAD_ASSET,
  {
    assetFile: any;
    listId?: string;
  },
  HistoryMeta
>;

export type UploadImageByUrl = IAction<
  typeof TYPES.UPLOAD_IMAGE_BY_URL,
  {
    elementId: string;
    imageData: ImageData;
    listId: string;
  },
  ElementHistoryMeta
>;

export type AddStateAsset = IAction<
  typeof TYPES.ADD_STATE_ASSET,
  {
    listId: string;
    asset: Asset;
  },
  HistoryMeta
>;

export type AddImageList = IAction<
  typeof TYPES.SET_IMAGE_LIST,
  {
    valueImage: boolean;
  }
>;

export type AddBackgroundImageList = IAction<
  typeof TYPES.SET_BACKGROUND_LIST,
  {
    backGroundValue: boolean;
  }
>;

export type RemoveAssetListRedux = IAction<
  typeof TYPES.REMOVE_ASSET_LIST_REDUX,
  string
>;

export type RemoveAssetList = IAction<
  typeof TYPES.REMOVE_ASSET_LIST,
  string,
  HistoryMeta
>;

export type RemoveAsset = IAction<
  typeof TYPES.REMOVE_ASSET,
  { id: string; listId: string },
  HistoryMeta
>;

export type RemoveAssetRedux = IAction<
  typeof TYPES.REMOVE_ASSET_REDUX,
  { id: string; listId: string },
  HistoryMeta
>;

export type UpdateStateAssetImage = IAction<
  typeof TYPES.UPDATE_STATE_ASSET_IMAGE,
  { assetId: string; listId: string; imageUrl: string },
  HistoryMeta
>;

export type RestoreAsset = IAction<
  typeof TYPES.RESTORE_ASSET,
  { asset: Asset; listId: string },
  HistoryMeta
>;

export type AddStateElements = IAction<
  typeof TYPES.ADD_STATE_ELEMENTS,
  { elements: Array<StateElementsToAdd<Entity>> },
  ElementHistoryMeta
>;

export type ChangeScreenFormat = IAction<typeof TYPES.CHANGE_LAYOUT, Layout>;

export type ExtractStateElement = IAction<
  typeof TYPES.EXTRACT_STATE_ELEMENT,
  string
>;

export type InsertStateElement = IAction<
  typeof TYPES.INSERT_STATE_ELEMENT,
  { parentId: string; childId: string; element: LibraryElement<any> },
  ElementHistoryMeta
>;

export type WrapStateElements = IAction<
  typeof TYPES.WRAP_STATE_ELEMENTS,
  {
    parentId: string;
    childIds: string[];
    element: LibraryElement<Entity>;
  },
  ElementHistoryMeta
>;

export type UnwrapStateElements = IAction<
  typeof TYPES.UNWRAP_STATE_ELEMENTS,
  {
    wrapperId: string;
    parentId: string;
    childIds: string[];
  },
  ElementHistoryMeta
>;

export type MoveStateElement = IAction<
  typeof TYPES.MOVE_STATE_ELEMENT,
  { elementId: string; indices: Indices; parents: ParentIds },
  ElementHistoryMeta
>;

export type MoveStateElementsInside = IAction<
  typeof TYPES.MOVE_STATE_ELEMENTS_INSIDE,
  { ids: string[]; parents: ParentIds },
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

export type SetPreSelectedElementId = IAction<
  typeof TYPES.SET_PRESELECTED_ELEMENT_ID,
  string | null
>;

export type SetMasterSourceElementId = IAction<
  typeof TYPES.SET_MASTER_SOURCE_ELEMENT_ID,
  string | null
>;

export type SetCanCreateGroup = IAction<
  typeof TYPES.SET_CAN_CREATE_GROUP,
  boolean
>;

export type SetProjectsData = IAction<
  typeof TYPES.SET_PROJECTS_DATA,
  PaginatedArray<Project>
>;

export type SetMarketplaceData = IAction<
  typeof TYPES.SET_MARKETPLACE_DATA,
  PaginatedArray<Marketplace>
>;
export type SetUsersData = IAction<
  typeof TYPES.SET_USERS_DATA,
  { search: string; data: PaginatedResponse<UserData> }
>;

export type SetProjectUsersData = IAction<
  typeof TYPES.SET_PROJECT_USERS_DATA,
  PaginatedArray<UserData>
>;

export type UpdateLastElements = IAction<
  typeof TYPES.UPDATE_LAST_ELEMENTS,
  { parentId: string; ids: string[]; offset: number }
>;

export type AddSelectedElement = IAction<
  typeof TYPES.ADD_SELECTED_ELEMENT,
  {
    id: string;
  }
>;

export type RemoveSelectedElement = IAction<
  typeof TYPES.REMOVE_SELECTED_ELEMENT,
  {
    id: string;
  }
>;

export type SetSelectedElements = IAction<
  typeof TYPES.SET_SELECTED_ELEMENTS,
  { ids: string[] }
>;

export type UpdateStateElement = IAction<
  typeof TYPES.UPDATE_STATE_ELEMENT,
  { elementId: string; data: Partial<StateElement> }
>;

export type UpdateMultipleStateElements = IAction<
  typeof TYPES.UPDATE_MULTIPLE_STATE_ELEMENTS,
  { elements: Normalized<StateElement> },
  ElementHistoryMeta
>;

export type SetScreenCreateLoader = IAction<
  typeof TYPES.SET_SCREEN_CREATE_LOADER,
  boolean
>;

export type SetEditorDocument = IAction<
  typeof TYPES.SET_EDITOR_DOCUMENT,
  Document
>;

export type SetMasterScreenId = IAction<
  typeof TYPES.SET_MASTER_SCREEN_ID,
  number | null
>;

export type SetVIAMode = IAction<typeof TYPES.SET_VIA_MODE, boolean>;

export type SetViaRegions = IAction<typeof TYPES.SET_VIA_REGIONS, VIARegions>;

export type UpdateVIARegion = IAction<
  typeof TYPES.UPDATE_VIA_REGION,
  { id: VIARegion['id']; data: Partial<VIARegion> }
>;

export type UpdateVIARegionSuccess = IAction<
  typeof TYPES.UPDATE_VIA_REGION_SUCCESS,
  { id: VIARegion['id']; data: Partial<VIARegion> }
>;

export type SetActiveVIARegion = IAction<
  typeof TYPES.SET_ACTIVE_VIA_REGION,
  { id: string; isUpdatingLayer: boolean }
>;

export type CreateVIARegion = IPlainAction<typeof TYPES.CREATE_VIA_REGION>;

export type CreateVIARegionSuccess = IAction<
  typeof TYPES.CREATE_VIA_REGION_SUCCESS,
  VIARegion
>;

export type RestoreVIARegion = IAction<
  typeof TYPES.RESTORE_VIA_REGION,
  VIARegion
>;

export type DeleteVIARegion = IAction<
  typeof TYPES.DELETE_VIA_REGION,
  string | undefined
>;

export type DeleteVIARegionSuccess = IAction<
  typeof TYPES.DELETE_VIA_REGION_SUCCESS,
  string
>;

export type SetAnnotatedElement = IAction<
  typeof TYPES.SET_ANNOTATED_ELEMENT_ID,
  string
>;

export type SetVIAResultId = IAction<typeof TYPES.SET_VIA_RESULT_ID, string>;

export type UpdateVIARegionLayer = IAction<
  typeof TYPES.UPDATE_VIA_REGION_LAYER,
  { id: string; layer: number }
>;

export type SetActiveNNModel = IAction<
  typeof TYPES.SET_ACTIVE_NN_MODEL,
  { model: string }
>;

export type IsLibraryTab = IAction<
  typeof TYPES.IS_LIBRARY_TAB,
  { isLibraryTab: Boolean }
>;

export type UpdateVIARegionLayerSuccess = IAction<
  typeof TYPES.UPDATE_VIA_REGION_LAYER_SUCCESS,
  { id: string; layer: number }
>;

export type SetAnnotatedImageURL = IAction<
  typeof TYPES.SET_ANNOTATED_IMAGE_URL,
  FileToUpload
>;

export type SetVIAData = IAction<
  typeof TYPES.SET_VIA_DATA,
  {
    value: VIAData;
  }
>;

export type SetBlockType = IAction<typeof TYPES.SET_BLOCK_TYPE, NNBlockType>;

export type FinishAnnotaion = IPlainAction<typeof TYPES.FINISH_ANNOTATION>;

export type CopyVIARegion = IPlainAction<typeof TYPES.COPY_VIA_REGION>;

export type PasteVIARegion = IPlainAction<typeof TYPES.PASTE_VIA_REGION>;

export type SetNewScreenModal = IAction<
  typeof TYPES.SET_NEW_SCREEN_MODAL,
  boolean
>;

export type SetSidebarOpen = IAction<typeof TYPES.SET_SIDEBAR_OPEN, boolean>;

export type SetSidebarIframe = IAction<
  typeof TYPES.SET_SIDEBAR_IFRAME,
  null | HTMLIFrameElement
>;

export type SetSidebarHost = IAction<typeof TYPES.SET_SIDEBAR_HOST, string>;

export type SetEnabledPseudoClass = IAction<
  typeof TYPES.SET_ENABLED_PSEUDO_CLASS,
  {
    pseudoClass: string | null;
    elementId?: string | null;
  }
>;

export type SetStatePseudoClass = IAction<
  typeof TYPES.SET_STATE_PSEUDO_CLASS,
  string | null
>;

export type GenerateImagePalette = IAction<
  typeof TYPES.GENERATE_IMAGE_PALETTE,
  string
>;

export type SetImagePalette = IAction<
  typeof TYPES.SET_IMAGE_PALETTE,
  ParsedImagePalette
>;

export type Action =
  | LoadProjects
  | SetUsersSearchValue
  | SetUsersSearchTemplateValue
  | LoadProjectsSuccess
  | LoadProjectsFail
  | SetUsersData
  | LoadProjectUsersSuccess
  | CreateProject
  | DeleteProject
  | GetProject
  | LoadTemlates
  | GetSharedProject
  | SetCurrentProjectId
  | ChangeScreensOrder
  | UpdateNameAndTagsProject
  | UpdateLayoutProjects
  | SetProjectListLoader
  | SetProjectUsersLoader
  | SetUsersLoader
  | SetProjectLoader
  | SetScreenLoader
  | SetMasterScreenLoader
  | SetUpdateImageLoader
  | SetProjectCreateLoader
  | SetAnalyzerLoader
  | SetAssetsListsLoader
  | DeleteScreen
  | EditScreenNameAndData
  | CreateScreen
  | ActivateScreen
  | ClearAfterPrevScreen
  | UpdateScreenImage
  | SetCurrentScreenId
  | CopyElementStyles
  | UpdateElementStyles
  | UpdateElementImage
  | UpdateElementParameters
  | ReplaceElementParameters
  | CreateElements
  | CreateElementsGroup
  | DeleteElement
  | AddChildToElement
  | AddChildrenToElement
  | AutoAnalyzeImage
  | uploadImageForNNSuccess
  | WrapIntoContainer
  | SetHoveredElementId
  | SetMasterCoreElementId
  | SetMasterGroupsElementId
  | SetMasterElementsIds
  | ToggleContainersBorders
  | ToggleGrid
  | ExportScreenFlag
  | SetBordersEnabled
  | SetElementToCopy
  | CopyActiveElement
  | PasteCopiedElement
  | ResetProjectState
  | UpdateSavedElementsValues
  | UpdateSavedElementValues
  | UpdateElementsTree
  | SetEditableStyles
  | AddUndoActions
  | AddRedoActions
  | MoveHistoryForward
  | MoveHistoryBackward
  | UnbindGroupElementStyles
  | UnbindMasterGroupInstance
  | UnwrapFromContainer
  | RestoreElementChildren
  | RedoWrapIntoContainer
  | MoveElement
  | RemoveElementStyles
  | ReplaceElementStyles
  | RemoveElementClassName
  | UpdateProject
  | UpdateCurrentUIFramework
  | UpdateCurrentUIFrameworkVariables
  | ResetCurrentUIFrameworkVariables
  | SetVIAData
  | SetBlockType
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
  | SetPreSelectedElementId
  | SetMasterSourceElementId
  | MoveStateElement
  | UpdateStateElement
  | UpdateMultipleStateElements
  | AddStateElements
  | InsertStateElement
  | RemoveStateElement
  | WrapStateElements
  | UnwrapStateElements
  | SetProjectsData
  | SetMarketplaceData
  | ExtractStateElement
  | UpdateLastElements
  | ChangeScreenFormat
  | RotateScreenFormat
  | SetScreens
  | SetCurrentDropTargetParams
  | ProcessDropTargetParams
  | ProcessDropElement
  | UpdateElement
  | UpdateElementsLoading
  | SetCustomElements
  | AddCustomElement
  | RemoveCustomElement
  | AddFileInput
  | RemoveFileInput
  | SetScreenCreateLoader
  | SetEditorDocument
  | SetAssetLists
  | SetAssets
  | AddStateAssetList
  | AddAssetList
  | AddStateAsset
  | AddImageList
  | AddBackgroundImageList
  | RemoveAssetList
  | RemoveAssetListRedux
  | RemoveAsset
  | RemoveAssetRedux
  | UpdateStateAssetImage
  | RestoreAsset
  | SetSelectedAssetListId
  | SearchProjects
  | SetProjectSearchParameter
  | SearchTemplates
  | SetTemplateSearchParameter
  | LoadTemplatesSuccess
  | AddSelectedElement
  | RemoveSelectedElement
  | SetSelectedElements
  | UpdateMultipleElementsStyles
  | ReplaceMultipleElementsStyles
  | RemoveMultipleElementsStyles
  | LoadAssetLists
  | LoadAssets
  | UploadAsset
  | UploadElementAsset
  | UploadImageByUrl
  | RemoveMultipleElementsStyles
  | RemoveMultipleElementsStyles
  | SetCanCreateGroup
  | MoveStateElementsInside
  | UpdateMultipleElementsParameters
  | ReplaceMultipleElementsParameters
  | SetMasterScreenId
  | StartHistoryRecord
  | ExecuteUndoActions
  | ExecuteRedoActions
  | AddUndoActions
  | AddRedoActions
  | SetVIAMode
  | SetActiveNNModel
  | IsLibraryTab
  | SetViaRegions
  | UpdateVIARegion
  | UpdateVIARegionSuccess
  | SetActiveVIARegion
  | CreateVIARegionSuccess
  | DeleteVIARegionSuccess
  | DeleteVIARegion
  | RestoreVIARegion
  | SetAnnotatedElement
  | UpdateVIARegionLayer
  | FinishAnnotaion
  | SetNewScreenModal
  | SetAnnotatedImageURL
  | CopyVIARegion
  | PasteVIARegion
  | SetSidebarOpen
  | SetSidebarIframe
  | SetSidebarHost
  | SetValueImportLoader
  | setImportValue
  | SetVIAResultId
  | UpdateVIARegionLayerSuccess
  | UpdateUISettingsParameters
  | SetEnabledPseudoClass
  | SetStatePseudoClass
  | SetValueCheckRobots
  | GenerateImagePalette
  | SetImagePalette
  | GetSubscriptionDataType
  | SetMarketplaceListLoader
  | ProjectError;

export type SetValueImportLoader = IAction<
  typeof TYPES.SET_VALUE_IMPORT_LOADER,
  boolean
>;

export type setImportValue = IAction<typeof TYPES.SET_IMPORT_VALUE, importData>;

export type SetValueCheckRobots = IAction<
  typeof TYPES.SET_VALUE_CHECK_ROBOTS,
  boolean
>;

export interface HistoryMeta {
  useHistory?: boolean;
  historyRecordIndex?: number;
}

export type ElementHistoryMeta = HistoryMeta & {
  screenId: number;
  index?: number;
};

export interface ElementMetaIndex {
  index?: number;
}

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

export type UpdateUISettingsParameters = IAction<
  typeof TYPES.UPDATE_UI_SETTINGS_PARAMETERS,
  Partial<ProfileDataUIParameters>
>;
