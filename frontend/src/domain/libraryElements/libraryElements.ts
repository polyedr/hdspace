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
  makeRoot,
  makeImage,
  makeSmartHeader,
  makeSmartFooter,
  makeSmartForm,
  makeSmartWebpage,
  makeVideo,
  makeDropdown,
  makeUndefinedElement,
  makeDropdownMenu,
  makeDropdownItem,
  makeDivBlock,
  makeContainer,
  makeGrid,
  makeColumns,
  makeGridItem,
  makeColumn,
  makeNativeColumns,
  makeElementsGroup,
  makeHtmlElement,
} from './otherElements/otherElements';
import {
  makeButton,
  makeTextarea,
  makeTextinput,
  makeCheckbox,
  makeRadiobuttonGroup,
  makeSelect,
  makeOption,
  makeLabel,
  makeRadiobutton,
} from './formElements/formElements';
import {
  makeHyperlink,
  makeTextBlock,
  makeOcrtext,
  makeListItem,
  makeParagraph,
  makeHeading,
  makeList,
} from './typographyElements/typographyElements';
import {
  makeMap,
  makeCalendar,
  makeClock,
} from './widgetElements/widgetElements';
import {
  makeSubscribeForm,
  makeCardsSection,
  makeFeatureSection,
  makePageTemplate,
  makeEmptyPageTemplate,
  makeSection,
} from './blocksTemplates/blocksTemplates';

// WARN: every time you add or remove some LibraryElements in prod, you must write migration in db
export const LIBRARY_ELEMENTS: LibraryElements = {
  root: makeRoot,
  container: makeContainer,
  divBlock: makeDivBlock,
  pageTemplate: makePageTemplate,
  emptyPageTemplate: makeEmptyPageTemplate,
  gridItem: makeGridItem,
  grid: makeGrid,
  nativeColumns: makeNativeColumns,
  columns: makeColumns,
  column: makeColumn,
  subscribeForm: makeSubscribeForm,
  image: makeImage,
  smartHeader: makeSmartHeader,
  smartFooter: makeSmartFooter,
  smartForm: makeSmartForm,
  smartWebpage: makeSmartWebpage,
  button: makeButton,
  hyperlink: makeHyperlink,
  textinput: makeTextinput,
  input: makeTextinput,
  checkbox: makeCheckbox,
  radiobutton: makeRadiobutton,
  radiobuttonGroup: makeRadiobuttonGroup,
  select: makeSelect,
  option: makeOption,
  label: makeLabel,
  textarea: makeTextarea,
  heading: makeHeading,
  paragraph: makeParagraph,
  ocrtext: makeOcrtext,
  textBlock: makeTextBlock,
  list: makeList,
  listItem: makeListItem,
  map: makeMap,
  calendar: makeCalendar,
  clock: makeClock,
  dropdown: makeDropdown,
  dropdownMenu: makeDropdownMenu,
  dropdownItem: makeDropdownItem,
  video: makeVideo,
  undefined: makeUndefinedElement,
  cardsSection: makeCardsSection,
  featureSection: makeFeatureSection,
  section: makeSection,
  group: makeElementsGroup,
  html: makeHtmlElement,
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
  radiobuttonGroup: RadioButtonCheckedIcon,
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
