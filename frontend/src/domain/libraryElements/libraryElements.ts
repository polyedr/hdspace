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
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import MovieIcon from '@material-ui/icons/Movie';
import TitleOutlinedIcon from '@material-ui/icons/TitleOutlined';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
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
import SliderIcon from '@material-ui/icons/Tune';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';
import { Entity, LibraryElements, ServerElement } from '@Src/types';
import { convertElementFromResponse } from '@Api/converters/fromResponse';
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
  makeImagesList,
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
  makeSwitch,
  makeDateTimePicker,
  makeSlider,
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

const PREVIEW_LIBRARY_ELEMENTS = [
  makeSubscribeForm(),
  makeCardsSection(),
  makeFeatureSection(),
];

export const CORE_PREVIEW_LIBRARY_ELEMENTS = PREVIEW_LIBRARY_ELEMENTS.map(
  (el: ServerElement<Entity>) => ({
    ...convertElementFromResponse(el),
    name: el.name,
  }),
);

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
  imagesList: makeImagesList,
  smartHeader: makeSmartHeader,
  smartFooter: makeSmartFooter,
  smartForm: makeSmartForm,
  smartWebpage: makeSmartWebpage,
  button: makeButton,
  buttonGenerator: makeButtonGenerator,
  textinput: makeTextinput,
  input: makeTextinput,
  checkbox: makeCheckbox,
  switch: makeSwitch,
  radiobutton: makeRadiobutton,
  radiobuttonGroup: makeRadiobuttonGroup,
  select: makeSelect,
  option: makeOption,
  label: makeLabel,
  textarea: makeTextarea,
  slider: makeSlider,
  heading: makeHeading,
  paragraph: makeParagraph,
  ocrtext: makeOcrtext,
  textBlock: makeTextBlock,
  list: makeList,
  listItem: makeListItem,
  map: makeMap,
  calendar: makeCalendar,
  dateTimePicker: makeDateTimePicker,
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
  hyperlink: makeLabel,
};

export const ICONS: Partial<{
  [key in Entity]: OverridableComponent<SvgIconTypeMap> | undefined;
}> = {
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
  slider: SliderIcon,
  checkbox: CheckBoxIcon,
  switch: ToggleOffIcon,
  radiobuttonGroup: RadioButtonCheckedIcon,
  label: LabelIcon,
  select: TocIcon,
  map: MapIcon,
  calendar: CalendarTodayIcon,
  dateTimePicker: CalendarTodayIcon,
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
  imagesList: ViewModuleIcon,
};
