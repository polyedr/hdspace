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
} from '$api/types';

import { root, container, image, video, dropdown, undefined, dropdownMenu, makeDropdownItem } from './otherElements';
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
  image: Omit<ImageServerElement, 'parameters'> & { parameters: { group: string } },
  button: Omit<ButtonServerElement, 'parameters'> & { parameters: { group: string } },
  hyperlink: Omit<HyperlinkServerElement, 'parameters'> & { parameters: { group: string } },
  textinput: Omit<TextinputServerElement, 'parameters'> & { parameters: { group: string } },
  checkbox: Omit<CheckboxServerElement, 'parameters'> & { parameters: { group: string, defaultChecked: boolean } },
  radiobutton: Omit<RadiobuttonServerElement, 'parameters'> & { parameters: { group: string } },
  select: Omit<SelectServerElement, 'parameters'> & { parameters: { group: string } },
  label: Omit<LabelServerElement, 'parameters'> & { parameters: { group: string } },
  textarea: Omit<TextareaServerElement, 'parameters'> & { parameters: { group: string } },
  heading: Omit<HeadingServerElement, 'parameters'> & { parameters: { group: string } },
  paragraph: Omit<ParagraphServerElement, 'parameters'> & { parameters: { group: string } },
  ocrtext: Omit<OcrtextServerElement, 'parameters'> & { parameters: { group: string } },
  text_block: Omit<TextBlockServerElement, 'parameters'> & { parameters: { group: string } },
  list: Omit<ListServerElement, 'parameters'> & { parameters: { group: string } },
  map: Omit<MapServerElement, 'parameters'> & { parameters: { group: string } },
  calendar: Omit<CalendarServerElement, 'parameters'> & { parameters: { group: string } },
  clock: Omit<ClockServerElement, 'parameters'> & { parameters: { group: string } },
  dropdown: Omit<DropdownServerElement, 'parameters'> & { parameters: { group: string } },
  video: Omit<VideoServerElement, 'parameters'> & { parameters: { group: string } },
  undefined: Omit<UndefinedServerElement, 'parameters'> & { parameters: { group: string } },
};

export type LibraryElements = {
  [key in keyof ChildrenElements]: Omit<ChildrenElements[key], 'parameters'> & { parameters: {}};
} & ElementsToAdd;

export type LibraryEntities = LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container,
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
