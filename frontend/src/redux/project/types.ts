import { CSSProperties } from 'react';

import { ICommunication, IPlainAction, IPlainFailAction, IAction } from '$shared/redux';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';
import { TYPES } from '$constants/actions';

export type ReduxState = {
  data: {
    libraryElements: ILibraryElements;
    listProject: IListProject[];
  };
  edit: {
    currentProject: IProject;
    currentScreen: IProjectScreen;
    listProjectLoader: boolean;
    loader: boolean;
    scenarios: IScenarios;
    scenarioElements: IScenarioElements;
    scenarioLoader?: boolean;
    modifyElements: number[];
    uploadedImageInfo?: UploadedImageInfo;
  };
  // communication: {};
};

export type LoadLibraryElements = IPlainAction<'PROJECTS:LOAD_LIBRARY_ELEMENTS'>;
export type LoadLibraryElementsSuccess = IAction<
  'PROJECTS:LOAD_LIBRARY_ELEMENTS_SUCCESS', { libraryElements: ILibraryElements }
>;
export type LoadLibraryElementsFail = IPlainFailAction<'PROJECTS:LOAD_LIBRARY_ELEMENTS_FAIL'>;

export type LoadProjects = IPlainAction<'PROJECTS:LOAD_PROJECTS'>;
export type LoadProjectsSuccess = IAction<
  'PROJECTS:LOAD_PROJECTS_SUCCESS', { projects: IListProject[] }
>;
export type LoadProjectsFail = IPlainFailAction<'PROJECTS:LOAD_PROJECTS_FAIL'>;

export type AddProject = IAction<'PROJECTS:ADD_PROJECT', { name: string }>;
export type DeleteProject = IAction<'PROJECTS:DELETE_PROJECT', { id: number }>;
export type GetProject = IAction<'PROJECTS:GET_PROJECT', { id: number, screenID?: string }>;
export type SetProject = IAction<'PROJECTS:SET_PROJECT', { project: IProject }>;
export type SetProjectScreens = IAction<'PROJECTS:SET_PROJECT_SCREENS', { screens: IProjectListItem[] }>;
export type RenameProject = IAction<'PROJECTS:RENAME_PROJECT', { projectID: number, name: string }>;
export type SetListProjectLoader = IAction<'PROJECTS:SET_LIST_PROJECT_LOADER', { active: boolean }>;
export type SetProjectLoader = IAction<'PROJECTS:SET_PROJECT_LOADER', { active: boolean }>;
export type SetScreenLoader = IAction<'PROJECTS:SET_SCREEN_LOADER', { active: boolean }>;
export type SetLoader = IAction<'PROJECTS:SET_LOADER', { active: boolean }>;
export type SetScenarioLoader = IAction<'PROJECTS:SET_SCENARIO_LOADER', { active: boolean }>;
export type DeleteScreen = IAction<'PROJECTS:DELETE_SCREEN', { projectID: number, screenID: number }>;
export type RenameScreen = IAction<'PROJECTS:RENAME_SCREEN', { projectID: number, screenID: number, name: string }>;
export type AddScreen = IAction<'PROJECTS:ADD_SCREEN', { projectID: number, name: string }>;
export type ActivateScreen = IAction<'PROJECTS:ACTIVATE_SCREEN', { projectID: number, screenID: number }>;
export type SetListSortable = IAction<
  'PROJECTS:SET_LIST_SORTABLE', { itemIndex: number, items: string[], id: string, parentID: string }
>;
export type ClearAfterPrevScreen = IPlainAction<'PROJECTS:CLEAN_AFTER_PREV_SCREEN'>;
export type SaveScreen = IAction<'PROJECTS:SAVE_SCREEN', { canvas: HTMLCanvasElement }>;
export type SetScreen = IAction<'PROJECTS:SET_SCREEN', { screen: IProjectScreen }>;
export type AddElement = IAction<'PROJECTS:ADD_ELEMENT', { parentID: string, type: string }>;
export type SetScenarioElements = IAction<'PROJECTS:SET_SCENARIO_ELEMENTS', { elements: IScenarioElements }>;
export type UpdateElementStyles = IAction<'PROJECTS:UPDATE_ELEMENT_STYLES', { id: string, styles: CSSProperties }>;
// TODO: here is not CSSProperties, here css-like properties written in lower-case-hyphenated
export type UpdateScenarioStyles = IAction<
  'PROJECTS:UPDATE_SCENARIO_STYLES', { id: string, styles: CSSProperties & { 'flex-direction'?: string } }
>;
export type UpdateRootStyles = IAction<'PROJECTS:UPDATE_ROOT_STYLES', { id: string, styles: CSSProperties }>;
export type UpdateElementParameters = IAction<
  'PROJECTS:UPDATE_ELEMENT_PARAMETERS', { itemID: string, parameters: IScreenProps }
>;
export type SetAlign = IAction<'PROJECTS:SET_ALIGN', { itemID: string, type: string }>;
export type ChangeScenario = IAction<'PROJECTS:CHANGE_SCENARIO', { itemID: string, scenarioID: number }>;
export type ChangeElementType = IAction<'PROJECTS:CHANGE_ELEMENT_TYPE', { itemID: string, type: string }>;
export type DeleteScenarioItem = IAction<'PROJECTS:DELETE_SCENARIO_ITEM', { id: string }>;
export type ChangeScenarios = IAction<'PROJECTS:CHANGE_SCENARIOS', { screenID: number }>;
export type AddScenario = IAction<
  'PROJECTS:ADD_SCENARIO', { parentScenarioID: number | null, name: string, elements: IChooseElement[] }
>;
export type DeleteScenario = IAction<'PROJECTS:DELETE_SCENARIO', { id: string }>;
export type RenameScenario = IAction<'PROJECTS:RENAME_SCENARIO', { scenarioID: number, name: string }>;
export type SetScenarios = IAction<'PROJECTS:SET_SCENARIOS', { scenarios: IScenarios }>;
export type SetModifyElements = IAction<'PROJECTS:SET_MODIFY_ELEMENTS', { elements: number[] }>;
export type UploadFile = IAction<'PROJECTS:UPLOAD_FILE', { file: any }>;
export type uploadImageForNNSuccess = IAction<
  'PROJECTS:UPLOAD_IMAGE_FOR_NN_SUCCESS', { imageURL: string, screenID: number }
>;
export type GetScreenNN = IPlainAction<'PROJECTS:GET_SCREEN_NN'>;
export type AddContainer = IAction<'PROJECTS:ADD_CONTAINER', { itemID: string }>;

// unused
export const createScenario = (name: string, type: string, elements?: number[]) => ({
  type: TYPES.CREATE_SCENARIO,
  payload: { name, type, elements },
});

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
  | SetProjectScreens
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
  | SetListSortable
  | ClearAfterPrevScreen
  | SaveScreen
  | SetScreen
  | AddElement
  | SetScenarioElements
  | UpdateElementStyles
  | UpdateScenarioStyles
  | UpdateRootStyles
  | UpdateElementParameters
  | SetAlign
  | ChangeScenario
  | ChangeElementType
  | DeleteScenarioItem
  | ChangeScenarios
  | AddScenario
  | DeleteScenario
  | RenameScenario
  | SetScenarios
  | SetModifyElements
  | UploadFile
  | uploadImageForNNSuccess
  | GetScreenNN
  | AddContainer;

// export const updateStylesGroup = (itemId: string, styles: IScreenProps) => ({
//   type: TYPES.UPDATE_STYLES_GROUP,
//   payload: { itemId, styles },
// });

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

export interface IScenarioElement { // compare with entity on backend
  id: number,
  scenario: number,
  name: string,
  struct_type: string,
  func_type: string,
  func_type_human?: string, // possibly has fallback value as 'undefined'
  buoyancy: number,
  dynamic_buoyancy: number,
  image: string | null,
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
  [elementID: string]: IScenarioElement,
}

export interface IScenarioItem { // compare with entity on backend
  id: number;
  name: string;
  type?: string;
  struct_type: string; // 'scenario' | 'block' | 'group' | 'container' | 'undefined'. it seems that it also contains keyof of RENDERERS
  screen: number;
  parent_id: number; // id in database table
  buoyancy: number;
  direction: string; // 'vertical' | 'horizontal'
  elements: number[]; // elements ids as foreign keys 
  parameters: {
    children: string[]; // listSortable-specific ids
  };
  styles: {};
}

export interface IScenarios {
  [scenarioID: string]: IScenarioItem,
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
  id: number;
  name: string;
  status: string; // compare with entity on backend!
  project: number;
  image: string | null;
  screenscenario: number[];
  styles_root: { [prop: string]: string }; // is it StylesElement?
  screenLoader: boolean;
  listSortable: IListSortable;
  // removed screen_data_json, ask if it will be needed on backend
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
