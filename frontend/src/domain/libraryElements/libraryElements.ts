import {
  RootServerElement,
  ContainerServerElement,
  ImageServerElement,
  ButtonServerElement,
  HyperlinkServerElement,
  TextinputServerElement,
  CheckboxServerElement,
  RadiobuttonServerElement,
  SelectServerElement,
  SelectItemServerElement,
  SelectMenuServerElement,
  TextareaServerElement,
  HeadingServerElement,
  ParagraphServerElement,
  OcrtextServerElement,
  LabelServerElement,
  TextBlockServerElement,
  ListServerElement,
  ListItemServerElement,
  MapServerElement,
  CalendarServerElement,
  ClockServerElement,
  VideoServerElement,
  DropdownServerElement,
  DropdownMenuServerElement,
  DropdownItemServerElement,
  UndefinedServerElement,
  DivBlockServerElement,
  PageTemplateServerElement,
  ScreenshotServerElement,
} from '$api/types';

import {
  root,
  image,
  makeScreenshot,
  video,
  dropdown,
  undefined,
  dropdownMenu,
  makeDropdownItem,
  makeDivBlock,
  makeContainer,
} from './otherElements/otherElements';
import {
  button,
  textarea,
  textinput,
  checkbox,
  radiobutton,
  label,
  select,
  selectMenu,
  makeSelectItem,
} from './formElements/formElements';
import {
  heading,
  hyperlink,
  list,
  textBlock,
  ocrtext,
  makeListItem,
  makeParagraph,
} from './typographyElements/typographyElements';
import { map, calendar, clock } from './widgetElements/widgetElements';
import { pageTemplate } from './blocksTemplates/blocksTemplates';

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
  image: ImageServerElement;
  screenshot: ScreenshotServerElement;
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
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type LibraryEntities = LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container: makeContainer(),
  divBlock: makeDivBlock('This is divBlock'),
  pageTemplate,
  image,
  screenshot: makeScreenshot(),
  button,
  hyperlink,
  textinput,
  checkbox,
  radiobutton,
  select,
  selectMenu,
  selectItem: makeSelectItem('', ''),
  label,
  textarea,
  heading,
  paragraph: makeParagraph('This is paragraph'),
  ocrtext,
  textBlock,
  list,
  listItem: makeListItem(''),
  map,
  calendar,
  clock,
  dropdown,
  dropdownMenu,
  dropdownItem: makeDropdownItem(''),
  video,
  undefined,
};
