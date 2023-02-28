import { ProjectsSearchParameter, Layout, NNBlockType } from '@Src/types';
import {
  ProjectCommunicationState,
  ProjectControlState,
  ProjectDataState,
  ProjectEditState,
  ProjectUiState,
} from '../types';

export const initialData: ProjectDataState = {
  projectsData: {
    next: null,
    previous: null,
    parameter: [ProjectsSearchParameter.name, ''],
    results: {},
    pageSize: 10,
    loading: false,
  },
  screens: {},
  screenFolders: [],
  elements: {},
  customElementsData: {
    previous: null,
    next: null,
    results: [],
    loading: false,
    pageSize: 40,
  },
  elementInputs: {},
  assetLists: {
    previous: null,
    next: null,
    results: [],
    loading: false,
    pageSize: 40,
  },
  assetResults: {},
  assetImageList: false,
  backGroundAssetsList: false,
  imagePalette: null,
  createProjectError: null,
};

export const initialUi: ProjectUiState = {
  editableStyles: 'ownStyles',
  itemToCopyInfo: null,
  savedElementsValues: {},
  showContainersBorders: false,
  showGrid: false,
  exportScreenFlag: false,
  bordersEnabled: true,
  currentDropTargetParams: null,
  canCreateGroup: false,
  layout: {
    value: Layout.Desktop,
    rotated: false,
  },
  editorDocument: null,
  newScreenModalOpen: false,
  pseudoClass: null,
  sidebar: {
    open: false,
    iframe: null,
    host: '',
  },
  isCanImportSite: false,
};

export const initialEdit: ProjectEditState = {
  currentProjectId: -1,
  currentScreenId: -1,
  activeElementId: '-1',
  preSelectedElementId: null,
  masterSourceElementId: null,
  hoveredElementId: '-1',
  masterScreenId: null,
  masterCoreElementId: '-1',
  masterGroupsElementId: '-1',
  selectedAssetListId: null,
  selectedElementsIds: [],
  activeNNModel: 'fdict',
  isLibraryTab: false,
  VIAMode: {
    enabled: false,
    regions: {
      fdict: {},
      fordict: {},
      opencvdict: {},
      cnndict: {},
    },
    activeRegionId: '',
    annotatedElementId: '',
    annotatedImageFile: null,
    copiedRegion: null,
    resultId: '',
    blockType: NNBlockType.WEBPAGE,
    viaData: {
      fdict: {},
      fordict: {},
      opencvdict: {},
      cnndict: {},
    },
  },
  freeCanvas: {
    lastElements: {},
  },
};

export const initialCommunication: ProjectCommunicationState = {
  screenCreateLoader: false,
  updateImageLoader: false,
  screenLoader: false,
  masterScreenLoader: false,
  projectLoader: false,
  projectCreateLoader: false,
  analyzerLoader: false,
  assetsListsLoader: false,
  importLoader: false,
  importValue: {
    notSupportedTag: null,
    canvasData: {},
    importSuccessRawData: {},
    error: false,
  },
};

export const initialControl: ProjectControlState = {
  history: [],
  currentHistoryRecord: -1,
};
