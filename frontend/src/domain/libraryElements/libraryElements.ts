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
} from '$api/types';

import { root, container, divBlock, image, video, dropdown, undefined, dropdownMenu, makeDropdownItem } from './otherElements';
import { button, textarea, textinput, checkbox, radiobutton, label, select, selectMenu, makeSelectItem } from './formElements';
import { heading, paragraph, hyperlink, list, text_block, ocrtext, makeListItem } from './typographyElements';
import { map, calendar, clock } from './widgetElements';

export type ChildrenElements = {
  selectMenu: SelectMenuServerElement,
  selectItem: SelectItemServerElement,
  listItem: ListItemServerElement,
  dropdownMenu: DropdownMenuServerElement,
  dropdownItem: DropdownItemServerElement,
};

export type ElementsToAdd = {
  root: RootServerElement,
  container: ContainerServerElement,
  divBlock: DivBlockServerElement,
  image: ImageServerElement,
  button: ButtonServerElement,
  hyperlink: HyperlinkServerElement,
  textinput: TextinputServerElement,
  checkbox: CheckboxServerElement,
  radiobutton: RadiobuttonServerElement,
  select: SelectServerElement,
  label: LabelServerElement,
  textarea: TextareaServerElement,
  heading: HeadingServerElement,
  paragraph: ParagraphServerElement,
  ocrtext: OcrtextServerElement,
  text_block: TextBlockServerElement,
  list: ListServerElement,
  map: MapServerElement,
  calendar: CalendarServerElement,
  clock: ClockServerElement,
  dropdown: DropdownServerElement,
  video: VideoServerElement,
  undefined: UndefinedServerElement,
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type LibraryEntities = LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container,
  divBlock,
  image,
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
  paragraph,
  ocrtext,
  text_block,
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
