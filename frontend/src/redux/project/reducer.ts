import { createReducer } from 'reduxsauce';

import * as ACTIONS from '$redux/project/actions';
import { TYPES } from '$constants/actions';
import {
  DEFAULT_LIB_ELEMENTS,
  DEFAULT_PROJECT,
  DEFAULT_SCREEN,
} from '$constants/defaultParams';


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

export interface IScreenProps {
  buoyancy?: number,
  html_type?: string,
  content?: string,
  width?: string,
  height?: string,
  align?: string,
  indents?: IScreenIndents,
  border?: IScreenBorders,
  background?: IScreenBackground,
  typography?: IScreenTypography,
  placeholder?: string,
  dynamic_placeholder?: string,
  map_props?: IMapProps,
  source_img?: string,
  scenarioId?: number,
  url?: string,
  image?: string,
}

export interface ISortableItem {
  id: number,
  type: string,
  children: ISortableItem[],
  orientation?: string,
  props?: IScreenProps,
  scenarioId?: number,
}

export interface ILibraryElement {
  struct_type: string,
  func_type: string,
  func_type_human?: string,
  buoyancy: number,
  parameters: {
    tags?: string,
    group: string,
    placeholder?: string,
    map_props?: IMapProps,
  },
  styles: IStylesElement,
}

export interface ILibraryElements {
  [x: string]: ILibraryElement,
}

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

export interface IScenarioElement {
  id: number,
  scenario: number,
  name: string,
  struct_type: string,
  func_type: string,
  func_type_human?: string,
  buoyancy: number,
  dynamic_buoyancy?: number,
  image: string,
  parameters: {
    parent_id: number,
    tags?: string,
    group: string,
    placeholder?: string,
    dynamic_placeholder?: string,
    map_props?: IMapProps,
    content?: string,
    source?: string,
    location?: {
      x0: number,
      y0: number,
      x1: number,
      y1: number,
    },
    url?: string,
  },
  styles: IStylesElement,
}

export interface IScenarioElements {
  [x: string]: IScenarioElement,
}

export interface IScenarioItem {
  id: number,
  name: string,
  type?: string,
  struct_type: string,
  screen: number,
  parent_id?: number,
  buoyancy: number,
  direction: string,
  elements: number[],
  parameters: {
    // scenario: number,
    parentElId?: number,
    children?: string[],
  },
  styles: {},
}

export interface IScenarios {
  [x: string]: IScenarioItem,
}

export interface ILSItem {
  id: number;
  type: string;
  children: string[];
}

export interface IListSortable {
  [itemID: string]: ILSItem;
}

export interface IProjectScreen {
  id: number,
  name: string,
  status: string,
  project: number,
  image?: string,
  screenscenario: number[],
  styles_root?: {},
  screenLoader?: boolean,
  // TODO: delete property
  listSortable?: IListSortable,
  screen_data_json?: ISortableItem[],
  // screen_data_text
}

export interface IProjectListItem {
  id: number,
  name: string,
  image: string,
  buoyancy: number,
}

export interface IProject {
  id: number,
  name: string,
  status: string,
  projectscreen: IProjectListItem[],
  projectLoader?: boolean,
}

export type UploadedImageInfo = {
  imageURL: string;
  screenID: number;
}

export type IRootState = Readonly<{
  listProject: IListProject[],
  currentProject: IProject,
  currentScreen: IProjectScreen,
  listProjectLoader: boolean,
  loader: boolean,
  scenarios?: IScenarios,
  scenarioElements?: IScenarioElements,
  scenarioLoader?: boolean,
  libraryElements: ILibraryElements,
  modifyElements: number[],
  uploadedImageInfo?: UploadedImageInfo;
}>;

interface ActionHandler<T> {
  (state: IRootState, payload: T extends (...args: any[]) => infer R ? R : any): IRootState;
}

const setListProject: ActionHandler<typeof ACTIONS.setListProject> = (state, { listProject }) => ({
  ...state,
  listProject,
});

const setProject: ActionHandler<typeof ACTIONS.setProject> = (state, { project }) => ({
  ...state,
  currentProject: project,
});

const setLoaderListProject: ActionHandler<boolean> = (state, { active }) => ({
  ...state,
  listProjectLoader: active,
});

const setLoader: ActionHandler<boolean> = (state, { active }) => ({
  ...state,
  loader: active,
});

const setScreen: ActionHandler<typeof ACTIONS.setScreen> = (state, { screen }) => ({
  ...state,
  currentScreen: screen,
});

const setProjectLoader: ActionHandler<typeof ACTIONS.setProjectLoader> = (state, { active }) => ({
  ...state,
  currentProject: { ...state.currentProject, projectLoader: active },
});

const setScreenLoader: ActionHandler<typeof ACTIONS.setProjectLoader> = (state, { active }) => ({
  ...state,
  currentScreen: { ...state.currentScreen, screenLoader: active },
});

const setScenarioLoader: ActionHandler<typeof ACTIONS.setScenarioLoader> = (state, { active }) => ({
  ...state,
  scenarioLoader: active,
});

const setScenarios: ActionHandler<typeof ACTIONS.setScenarios> = (state, { scenarios }) => ({
  ...state,
  scenarios,
});

const setElements: ActionHandler<typeof ACTIONS.setScenarioElements> = (state, { elements }) => ({
  ...state,
  scenarioElements: elements,
});

const setLibraryElements: ActionHandler<typeof ACTIONS.setLibraryElements> = (
  state, { libraryElements },
) => ({
  ...state,
  libraryElements,
});

const setModifyElements: ActionHandler<typeof ACTIONS.setModifyElements> = (
  state, { elements },
) => ({
  ...state,
  modifyElements: elements,
});

const uploadImageForNNSuccess: ActionHandler<typeof ACTIONS.uploadImageForNNSuccess> = (
  state, { payload: uploadedImageInfo },
) => ({
  ...state,
  uploadedImageInfo,
});

const HANDLERS = {
  [TYPES.SET_LIST_PROJECT]: setListProject,
  [TYPES.SET_LIST_PROJECT_LOADER]: setLoaderListProject,
  [TYPES.SET_PROJECT]: setProject,
  [TYPES.SET_SCREEN]: setScreen,
  [TYPES.SET_PROJECT_LOADER]: setProjectLoader,
  [TYPES.SET_SCREEN_LOADER]: setScreenLoader,
  [TYPES.SET_SCENARIO_LOADER]: setScenarioLoader,
  [TYPES.SET_LOADER]: setLoader,
  [TYPES.SET_SCENARIOS]: setScenarios,
  [TYPES.SET_ELEMENTS]: setElements,
  [TYPES.SET_LIBRARY_ELEMENTS]: setLibraryElements,
  [TYPES.SET_MODIFY_ELEMENTS]: setModifyElements,
  [TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS]: uploadImageForNNSuccess,
};

const INITIAL_STATE: IRootState = {
  libraryElements: DEFAULT_LIB_ELEMENTS,
  listProject: [],
  currentProject: DEFAULT_PROJECT,
  currentScreen: DEFAULT_SCREEN,
  listProjectLoader: false,
  loader: false,
  scenarios: {},
  scenarioElements: {},
  modifyElements: [],
};

export default createReducer(INITIAL_STATE, HANDLERS);
