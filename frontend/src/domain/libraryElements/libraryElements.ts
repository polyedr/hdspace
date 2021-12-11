import GridOnIcon from '@material-ui/icons/GridOn';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import ListIcon from '@material-ui/icons/List';
import Crop169Icon from '@material-ui/icons/Crop169';
import CodeIcon from '@material-ui/icons/Code';
import NotesIcon from '@material-ui/icons/Notes';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import TitleOutlinedIcon from '@material-ui/icons/TitleOutlined';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
// import HelpIcon from '@material-ui/icons/Help';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
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
import PaymentIcon from '@material-ui/icons/Payment';
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
  makePaginationItem,
  makePagination,
  makeBreadcrumb,
  makeBreadcrumbItem,
  makeCarousel,
  makeCarouselItem,
  makeNavbar,
  makeNavbarItem,
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
import { makeButtonGenerator } from './generatorElements/generatorElements';
import {
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
  buttonGenerator: makeButtonGenerator,
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
  cardsSection: makeCardsSection,
  featureSection: makeFeatureSection,
  section: makeSection,
  group: makeElementsGroup,
  html: makeHtmlElement,
  breadcrumbItem: makeBreadcrumbItem,
  breadcrumb: makeBreadcrumb,
  paginationItem: makePaginationItem,
  pagination: makePagination,
  carouselItem: makeCarouselItem,
  carousel: makeCarousel,
  navbar: makeNavbar,
  navbarItem: makeNavbarItem,
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
  image: ImageIcon,
  video: MovieIcon,
  textBlock: TitleOutlinedIcon,
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
  html: CodeIcon,
  breadcrumb: CalendarViewDayIcon,
  pagination: LooksOneIcon,
  carousel: PhotoLibraryIcon,
  navbar: PaymentIcon,
};
