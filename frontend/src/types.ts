import React from 'react';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import { DropTargetMonitor } from 'react-dnd';
import { AxiosRequestConfig } from 'axios';
import { DropPosition, ElementType } from '@Constants/dragAndDrop';

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

export type PaginatedData<
  T extends { id: string | number }
> = PaginatedBase<T> & {
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
  left?: number;
  top?: number;
  zIndex?: number;
  width?: number;
  height?: number;
};

export type BaseElementParams = {
  layouts: Layout[];
  freeCanvas: FreeCanvasElementParams;
  group: ElementGroup;
  parentId?: string;
};

export enum UpdateDataActionType {
  REPLACE = 'replace',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type ServerElement<
  Type extends Entity,
  Children = any[],
  Params = BaseElementParams
> = {
  id: number | string;
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
export type GridServerElement = ServerElement<'grid', GridItemServerElement[]>;
export type GridItemServerElement = ServerElement<
  'gridItem',
  ServerElement<Entity>[]
>;
export type ColumnServerElement = ServerElement<'column', any>;
export type NativeColumnsServerElement = ServerElement<'nativeColumns', any>;
export type ColumnsServerElement = ServerElement<
  'columns',
  ColumnServerElement[],
  ColumnsParameters
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
export type SmartContainerServerElement<T extends Entity> = ServerElement<
  T,
  [],
  SmartElementParameters
>;
export type SmartHeaderServerElement = SmartContainerServerElement<'smartHeader'>;
export type SmartFooterServerElement = SmartContainerServerElement<'smartFooter'>;
export type SmartFormServerElement = SmartContainerServerElement<'smartForm'>;
export type SmartWebpageServerElement = SmartContainerServerElement<'smartWebpage'>;
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
  OptionServerElement[],
  SelectParameters
>;
export type SelectMenuServerElement = ServerElement<
  'selectMenu',
  OptionServerElement[]
>;
export type OptionServerElement = ServerElement<'option', [], OptionParameters>;
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

export type ElementsGroupServerElement = ServerElement<
  'group',
  [],
  ElementsGroupParameters
>;

export type ServerRecursiveElement = {
  id: number;
  name: string;
  children: [];
};

export type RecursiveElement = {
  id: string;
  name: string;
  children: Array<string>;
};

export type RecursiveServerElement = {
  id: number;
  name: string;
  children: Array<number>;
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

export type UpdateElementData<T extends Entity> = {
  elementID: string;
  data: LibraryElementPatch<T>;
  active?: boolean;
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
  SmartElementParameters
>;
export type SelectMenuElement = LibraryElement<'selectMenu', OptionElement[]>;
export type OptionElement = LibraryElement<'option', [], OptionParameters>;
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
  | OptionElement
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

type InteractiveElementParams = {
  events: ElementEvent[];
};

export enum EventType {
  Click = 'Click',
}

export interface ElementEvent {
  type: EventType;
  data: any;
  id: string;
}

export interface ElementClickEvent extends ElementEvent {
  data: {
    linkType: LinkType;
    url: string;
    screenId: string;
  };
}

export type ImageParameters = BaseElementParams & {
  imageURL: string;
  alt: string;
  title: string;
};

export type LinkType = 'internal' | 'external';

export type LinkParams = BaseElementParams & {
  type: 'internal-link' | 'external-link';
  url: string;
  screenId: string;
};

export type ButtonParameters = BaseElementParams & {
  textContent: string;
  showRipple: boolean;
};

export type HyperLinkParameters = BaseElementParams &
  InteractiveElementParams & {
    textContent: string;
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
  isOpen: boolean;
};

export type OptionParameters = BaseElementParams & {
  name: string;
  value: string;
};

export type SmartElementParameters = BaseElementParams & {
  imageURL?: string;
  stylesOn: boolean;
};

export type ColumnsParameters = BaseElementParams;

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
    apiKey: string;
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
    apiKey: string;
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

export type ElementsGroupParameters = BaseElementParams & {
  isGroup?: boolean;
  groupElements?: string[];
  sourceElementId?: string | null;
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
  parameters: {
    freeCanvas: FreeCanvasElementParams;
    group: ElementGroup;
    layouts: Layout[];
    events?: ElementEvent[];
    [k: string]: any;
  };
  shared?: boolean;
};

export type StateElementsToAdd<T extends Entity> = {
  elements: LibraryElement<any>[];
  parentId: string;
  index?: number;
};

export type DropTargetParams = {
  id: string;
  position?: DropPosition;
};

export type Indices = {
  newIndex: number;
  oldIndex: number;
};

export type ElementsIndices = {
  [id: string]: number;
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

export type CreateElementsData = {
  createdElements: CreatedElement[];
  parentId: string;
  index?: number;
};

export type ItemToCopyInfo = {
  id: string;
  screenID: number;
};

export type DuplicateElementsData = {
  itemsToCopyInfo: ItemToCopyInfo[];
  targetParent: LibraryElement<Entity>;
};

export type FreeCanvasOffset = {
  [parentId: string]: number;
};

export interface ICenterProp {
  lat: number;
  lng: number;
}

export interface IMapProps {
  center: ICenterProp;
  zoom: number;
  markerText?: string;
  apiKey: string;
}

export type Option = { name: string; value: any };

export type ListItem = {
  textContent: string;
  isLink: boolean;
  link: string;
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
  screen_data_json: any;
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
  parameters?: any;
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

export type ElementsToCreate<T extends Entity> = {
  elements: ServerElement<T>[];
  parent: LibraryElement<Entity>;
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
  id: number;
  experienced: Experience;
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
  id: number;
  experienced: Experience;
};

export enum UserProjectPermission {
  ADD_PROJECT = 'add_project',
  DELETE_PROJECT = 'delete_project',
  ASSIGN_PROJECT = 'assign_project',
  VIEW_PROJECT = 'view_project',
  CHANGE_PROJECT = 'change_project',
}

/* export type PermissionListItem = {
  label: string;
  permissions: UserProjectPermission | UserProjectPermission[];
}; */

export type PermissionsUserData = {
  permissions: UserProjectPermission[];
  userData: UserData;
};

export type ServerPermissionsUserData = {
  permissions: UserProjectPermission[];
  userdata: ServerUserData;
};

export enum Experience {
  BEGINNER = 'BEGINNER',
  EXPERIENCED = 'EXPERIENCED',
}

export type UserData = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date | null;
  isActive: boolean;
  password: string;
  profile: ProfileData;
};

export type UnsafeReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : any;

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
  [P in Entity | 'custom']: {
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
  masterScreenEnabled?: boolean;
};

export type ActionType = 'external-link' | 'internal-link' | 'button';

export type WithActionProps = {
  actionLink: string;
  actionType: ActionType;
  onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
};

export type MyAxiosProps = {
  access?: string;
  contentType?: string;
} & Partial<AxiosRequestConfig>;

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
  option: OptionServerElement;
  listItem: ListItemServerElement;
  dropdownMenu: DropdownMenuServerElement;
  dropdownItem: DropdownItemServerElement;
  gridItem: GridItemServerElement;
  column: ColumnServerElement;
};

export type ElementsToAdd = {
  root: RootServerElement;
  container: ContainerServerElement;
  divBlock: DivBlockServerElement;
  pageTemplate: PageTemplateServerElement;
  emptyPageTemplate: PageTemplateServerElement;
  grid: GridServerElement;
  nativeColumns: NativeColumnsServerElement;
  columns: ColumnsServerElement;
  image: ImageServerElement;
  smartHeader: SmartHeaderServerElement;
  smartFooter: SmartFooterServerElement;
  smartForm: SmartFormServerElement;
  smartWebpage: SmartWebpageServerElement;
  button: ButtonServerElement;
  hyperlink: HyperlinkServerElement;
  input: TextinputServerElement;
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
  group: ElementsGroupServerElement;
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type AssetsList = {
  id: string;
  name: string;
  created: Date;
  modified: Date;
  projectId: string;
  images: Asset[];
};

export type Asset = {
  id: string;
  image: string | null;
  created: Date;
  modified: Date;
  listId: string | null;
};

export type AssetResults = {
  [listId: string]: PaginatedArray<Asset>;
};

export const enum NNBlockType {
  HEADER = 'headers',
  FOOTER = 'footers',
  FORM = 'forms',
  WEBPAGE = 'webpages',
}

export enum RPTab {
  Properties = 'Properties',
  Elements = 'Elements',
  Events = 'Events',
}

export enum Layout {
  Desktop = 'desktop',
  Tablet = 'tablet',
  Mobile = 'mobile',
}

export const CONTROLS_AFFECT_ON_PARAMS = [
  'layouts',
  'columns',
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
  'alt',
  'title',
] as const;

export const CONTROLS_AFFECT_ON_STYLES = [
  'grid',
  'columns',
  'nativeColumns',
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

export enum ProjectsSearchParameter {
  name = 'name',
  user = 'user',
  status = 'status',
  updated = 'updated',
  created = 'created',
}

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type PostUrlResponse = { wpname: string; owner: any };

export type VIARegionWithoutId = {
  shape_attributes: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  region_attributes: {
    'HTML element': Entity;
  };
};

export type VIARegion = VIARegionWithoutId & {
  id: string;
  layer: number;
};

export type VIAFile = {
  filename: string;
  size: number | string;
  regions: VIARegionWithoutId[];
  file_attributes: Record<string, any>;
};
