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
import HelpIcon from '@material-ui/icons/Help';
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
import { Entity, LibraryElements } from '@Src/types';
import {
  root,
  makeImage,
  makeSmartHeader,
  makeSmartFooter,
  makeSmartForm,
  makeSmartWebpage,
  video,
  dropdown,
  undefinedElement,
  dropdownMenu,
  makeDropdownItem,
  makeDivBlock,
  makeContainer,
  makeGrid,
  makeColumns,
  makeGridItem,
  column,
  nativeColumns,
  elementsGroup,
  htmlElement,
} from './otherElements/otherElements';
import {
  makeButton,
  textarea,
  makeTextinput,
  checkbox,
  radiobutton,
  select,
  selectMenu,
  makeOption,
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

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root,
  container: makeContainer(),
  divBlock: makeDivBlock({ textContent: 'This is divBlock' }),
  pageTemplate: makePageTemplate(),
  emptyPageTemplate: makePageTemplate(true),
  gridItem: makeGridItem({}),
  grid: makeGrid(),
  nativeColumns,
  columns: makeColumns(),
  column,
  subscribeForm,
  image: makeImage(),
  smartHeader: makeSmartHeader({ name: 'Smart Header' }),
  smartFooter: makeSmartFooter({ name: 'Smart Footer' }),
  smartForm: makeSmartForm({ name: 'Smart Form' }),
  smartWebpage: makeSmartWebpage({ name: 'Smart Webpage' }),
  button: makeButton(),
  hyperlink,
  textinput: makeTextinput(),
  input: makeTextinput(),
  checkbox,
  radiobutton,
  select,
  selectMenu,
  option: makeOption('', ''),
  label: makeLabel(),
  textarea,
  heading: makeHeading(),
  paragraph: makeParagraph(),
  ocrtext,
  textBlock,
  list,
  listItem: makeListItem(),
  map,
  calendar,
  clock,
  dropdown,
  dropdownMenu,
  dropdownItem: makeDropdownItem(''),
  video,
  undefined: undefinedElement,
  cardsSection,
  featureSection,
  section,
  group: elementsGroup,
  html: htmlElement,
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
  container: Crop169Icon,
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
  smartHeader: CropOriginalIcon,
  smartFooter: CropOriginalIcon,
  smartForm: CropOriginalIcon,
  smartWebpage: CropOriginalIcon,
  section: Crop75Icon,
  html: HelpIcon,
};
