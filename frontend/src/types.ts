/* eslint-disable camelcase */
import React from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import { DropTargetMonitor } from 'react-dnd';
import { AxiosRequestConfig } from 'axios';
import * as CSS from 'csstype';
import { DropPosition, ElementType } from './constants/dragAndDrop';

export type PropertyName = keyof React.CSSProperties;

export type Normalized<T extends { id: string | number }> = {
  [id in string | number]: T;
};

export type Result<T = any> = {
  result?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
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

export enum ElementGroup {
  CONTAINERS = 'containers',
  FORM = 'form',
  TYPOGRAPHY = 'typography',
  IMAGE = 'image',
  WIDGET = 'widget',
  OTHER = 'other',
  CUSTOM = 'custom',
  UNDEFINED = 'undefined',
  NONE = 'none',
}

export type FreeCanvasElementParams = {
  left?: CSS.Property.Left;
  top?: CSS.Property.Top;
  zIndex?: CSS.Property.ZIndex;
  width?: CSS.Property.Width;
  height?: CSS.Property.Height;
};

export type BaseElementParams = FreeCanvasElementParams & {
  group?: ElementGroup;
};

export type ServerElement<
  Type extends Entity,
  Children = any[],
  Params = BaseElementParams
> = {
  id?: number;
  name: string;
  scenario?: number;
  struct_type: Type;
  func_type: string;
  buoyancy: number;
  image?: string | null;
  parameters: Params;
  custom?: boolean;
  // Every element has entity css class, group css class and unique own css class
  // Entity class has default entity styles, own class is empty by default, group classes is user custom classes
  styles: {
    classNames: string[];
    ownStyles: React.CSSProperties;
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

export type SmartElement<T extends Entity> = LibraryElement<
  T,
  [],
  SmartElementParams
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
export type ColumnsElement = LibraryElement<'columns', [], {}, {}>;
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

export type ImageParameters = BaseElementParams & {
  imageURL: string;
};

export type LinkParams = BaseElementParams & {
  type: 'internal-link' | 'external-link';
  url?: string; // for external links
  screenId?: number | 'noScreen'; // for internal links
};

export type ButtonParameters = BaseElementParams & {
  textContent: string;
  action: LinkParams;
  showRipple: boolean;
};

export type HyperLinkParameters = BaseElementParams & {
  textContent: string;
  action: LinkParams;
};

export type InputType = 'text' | 'email' | 'number' | 'phone' | 'password';

export type TextinputParameters = BaseElementParams & {
  type: InputType;
  textContent: string;
  placeholder: string;
};

export type CheckboxParameters = BaseElementParams & {
  value: string;
  name: string;
  showRipple: boolean;
  defaultChecked: boolean;
};

export type RadiobuttonParameters = BaseElementParams & {
  value: string;
  name: string;
  showRipple: boolean;
};

export type SelectParameters = BaseElementParams & {
  value: string;
  options: Option[];
  isOpen: boolean;
};

export type SelectItemParameters = BaseElementParams & {
  name: string;
  value: string;
};

export type SmartElementParams = BaseElementParams & {
  imageURL: string;
  stylesOn: boolean;
};

export type TextareaParameters = BaseElementParams & {
  textContent: string;
  placeholder: string;
};

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingParameters = BaseElementParams & {
  textContent: string;
  headingType: HeadingType;
};

export type ParagraphParameters = BaseElementParams & {
  textContent: string;
};

export type OcrtextParameters = BaseElementParams & {
  textContent: string;
};

export type LabelParameters = BaseElementParams & {
  textContent: string;
  labelFor: string;
};

export type TextBlockParameters = BaseElementParams & {
  textContent: string;
};

export type ListParameters = BaseElementParams & {
  listItems: ListItem[];
  isOrdered: boolean;
};

export type ListItemParameters = BaseElementParams & {
  textContent: string;
  isLink: boolean;
  link: string;
};

export type MapProps = BaseElementParams & {
  map_props: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
    markerText: string;
  };
};

export type MapParameters = BaseElementParams & {
  map_props: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
    markerText: string;
  };
};

export type VideoSettingsType = BaseElementParams & {
  link: string;
  autoplay: boolean;
  start: number;
  end: number;
  loop: boolean;
  rel: boolean;
};

export type VideoParameters = BaseElementParams & {
  videoSettings: VideoSettingsType;
};

export type DropdownParameters = BaseElementParams & {
  textContent: string;
  showRipple: boolean;
  isOpen: boolean;
  dropdownItems: string[];
};

export type DropdownItemParameters = BaseElementParams & {
  textContent: string;
};

export type CreatedServerProject = {
  name: string;
  status: string;
  projectscreen: number[];
  project_data_json: string;
};

export type ServerProjectWithScreens = {
  id: number;
  name: string;
  status: string;
  projectscreen: Screen[];
  created: string;
  updated: string;
  project_data_json: string;
  project_data_text: string;
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
  rules: React.CSSProperties;
};

export type ProjectData = {
  classes: ProjectClass[];
};

export type Project = {
  id: number;
  name: string;
  status: string;
  projectscreen: number[];
  projectLoader: boolean;
  created: Date;
  updated: Date;
  projectData: ProjectData;
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
    ownStyles: React.CSSProperties;
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

export type Indices = {
  newIndex: number;
  oldIndex: number;
};

export type SavedElementsValues = {
  [elementID: string]: { id: number; savedValue: string | boolean };
};

export type CreatedElement = {
  id?: string;
  type: Entity | string;
  name: string;
  custom: boolean;
  parameters?: any;
};

export type ItemToCopyInfo = {
  id: string;
  screenID: number;
};

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
  styles: React.CSSProperties;
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

export interface ScenarioItem {
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
  styles: React.CSSProperties;
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

export type TokenPair = {
  access: string;
  refresh: string;
};

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
  profile: ServerProfileData;
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
  activeElementId: string;
  removeStyles(cssPropertiesNames: string[]): void;
  updateStyles(payload: React.CSSProperties): void;
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

export type GroupElement = {
  key: string;
  name: string;
  label: string;
  custom?: boolean;
  value: { structType: ServerStructType; funcType: ServerStructType };
};

export interface ISignUpData {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const enum NNBlockType {
  HEADER = 'headers',
  FOOTER = 'footers',
  FORM = 'forms',
  WEBPAGE = 'webpages',
}

export const enum RightPanelTab {
  PROPERTIES = 0,
  ELEMENTS = 1,
}

export const enum SCREEN_FORMATS {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile',
}

export const CONTROLS_AFFECT_ON_PARAMS = [
  'action',
  'mapProps',
  'placeholder',
  'textContent',
  'image',
  'smartHeader',
  'smartFooter',
  'smartForm',
  'smartWebpage',
  'value',
  'name',
  'showRipple',
  'type',
  'selectOptions',
  'selectValue',
  'headingType',
  'listItems',
  'isOrdered',
  'labelFor',
  'dropdownItems',
  'isOpen',
  'videoSettings',
  'stylesOn',
] as const;

export const CONTROLS_AFFECT_ON_STYLES = [
  'columns',
  'display',
  'indents',
  'size',
  'typography',
  'border',
  'background',
  'bullets',
  'flexGrow',
  'backgroundSize',
] as const;

export type Control =
  | typeof CONTROLS_AFFECT_ON_PARAMS[number]
  | typeof CONTROLS_AFFECT_ON_STYLES[number];
