import GridOnIcon from '@material-ui/icons/GridOn';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import ListIcon from '@material-ui/icons/List';
import Crop169Icon from '@material-ui/icons/Crop169';
import NotesIcon from '@material-ui/icons/Notes';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import TitleOutlinedIcon from '@material-ui/icons/TitleOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import MessageIcon from '@material-ui/icons/Message';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import LabelIcon from '@material-ui/icons/Label';
import TocIcon from '@material-ui/icons/Toc';
import MapIcon from '@material-ui/icons/Map';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import Crop75Icon from '@material-ui/icons/Crop75';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
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
  makeGrid,
  makeColumns,
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
  subscribeForm,
  cardsSection,
  featureSection,
  makePageTemplate,
  section,
} from './blocksTemplates/blocksTemplates';
import {
  ButtonServerElement,
  CalendarServerElement,
  CardsSectionServerElement,
  CheckboxServerElement,
  ClockServerElement,
  ColumnsServerElement,
  ContainerServerElement,
  DivBlockServerElement,
  DropdownItemServerElement,
  DropdownMenuServerElement,
  DropdownServerElement,
  FeatureSectionServerElement,
  GridServerElement,
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
  SectionServerElement,
} from '../../api/types';
import { Entity } from '../core';

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
  section: SectionServerElement;
};

export type LibraryElements = ChildrenElements & ElementsToAdd;

export type LibraryEntities = LibraryElements;

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container: makeContainer(),
  divBlock: makeDivBlock('This is divBlock'),
  pageTemplate: makePageTemplate(),
  emptyPageTemplate: makePageTemplate(true),
  grid: makeGrid(),
  columns: makeColumns(),
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
  section,
};

export const ICONS: Partial<
  {
    [key in Entity]: OverridableComponent<SvgIconTypeMap> | undefined;
  }
> = {
  grid: GridOnIcon,
  columns: ViewColumnIcon,
  button: SlideshowIcon,
  list: ListIcon,
  divBlock: Crop169Icon,
  paragraph: NotesIcon,
  heading: LineWeightIcon,
  hyperlink: LinkIcon,
  image: ImageIcon,
  video: MovieIcon,
  textBlock: TitleOutlinedIcon,
  undefined: HelpOutlineIcon,
  dropdown: ArrowDropDownCircleIcon,
  textinput: MessageIcon,
  textarea: TextFieldsIcon,
  checkbox: CheckBoxIcon,
  radiobutton: RadioButtonCheckedIcon,
  label: LabelIcon,
  select: TocIcon,
  map: MapIcon,
  calendar: CalendarTodayIcon,
  clock: QueryBuilderIcon,
  screenshot: CropOriginalIcon,
  section: Crop75Icon,
};
