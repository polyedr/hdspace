import {
  root,
  makeImage,
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
  makeButton,
  textarea,
  makeTextinput,
  checkbox,
  radiobutton,
  select,
  selectMenu,
  makeSelectItem,
  makeLabel,
} from './formElements/formElements';
import {
  hyperlink,
  list,
  textBlock,
  ocrtext,
  makeListItem,
  makeParagraph,
  makeHeading,
} from './typographyElements/typographyElements';
import { map, calendar, clock } from './widgetElements/widgetElements';
import {
  pageTemplate,
  subscribeForm,
  cardsSection,
  featureSection,
} from './blocksTemplates/blocksTemplates';
import {
  ButtonServerElement,
  CalendarServerElement,
  CardsSectionServerElement,
  CheckboxServerElement,
  ClockServerElement,
  ContainerServerElement,
  DivBlockServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  FeatureSectionServerElement,
  HeadingServerElement,
  HyperlinkServerElement,
  ImageServerElement,
  LabelServerElement,
  ListItemServerElement,
  ListServerElement,
  MapServerElement,
  OcrtextServerElement,
  PageTemplateServerElement,
  ParagraphServerElement,
  RadiobuttonServerElement,
  RootServerElement,
  ScreenshotServerElement,
  SelectItemServerElement,
  SelectMenuServerElement,
  SelectServerElement,
  SubscribeFormServerElement,
  TextareaServerElement,
  TextBlockServerElement,
  TextinputServerElement,
  UndefinedServerElement,
  VideoServerElement,
} from '../../api/types';

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
  subscribeForm: SubscribeFormServerElement;
  cardsSection: CardsSectionServerElement;
  featureSection: FeatureSectionServerElement;
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type LibraryEntities = LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container: makeContainer(),
  divBlock: makeDivBlock('This is divBlock'),
  pageTemplate,
  subscribeForm,
  image: makeImage(),
  screenshot: makeScreenshot(),
  button: makeButton(),
  hyperlink,
  textinput: makeTextinput(),
  checkbox,
  radiobutton,
  select,
  selectMenu,
  selectItem: makeSelectItem('', ''),
  label: makeLabel(),
  textarea,
  heading: makeHeading(),
  paragraph: makeParagraph(),
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
  cardsSection,
  featureSection,
};
