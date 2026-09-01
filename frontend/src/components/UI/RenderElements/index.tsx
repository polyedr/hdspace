import React from 'react';
import Grid from '@Components/UI/RenderElements/Grid';
import Column from '@Components/UI/RenderElements/Columns/Column';
import NativeColumns from '@Components/UI/RenderElements/NativeColumns';
import { Entity, NNBlockType } from '@Src/types';
import SwitchMui from '@Components/UI/RenderElements/Switch/SwitchMui';
import ImagesList from '@Components/UI/RenderElements/ImagesList/ImagesList';
import Heading from './Heading/Heading';
import Paragraph from './Paragraph/Paragraph';
import TextBlock from './TextBlock/TextBlock';
import List from './List/List';
import Label from './Label/Label';
import Dropdown from './Dropdown/Dropdown';
import Video from './Video/Video';
import ListItem from './ListItem/ListItem';
import DropdownMenu from './Dropdown/DropdownMenu';
import DropdownItem from './Dropdown/DropdownItem';
import DivBlockRenderer from './DivBlock/DivBlock';
import Image from './Image/Image';
import Map from './Map/Map';
import Calendar from './Calendar/Calendar';
import Container from './Container/Container';
import Section from './Section/Section';
import Clock from './Clock/Clock';
import withSmartContainer from './SmartContainer/withSmartContainer';
import Columns from './Columns';
import GridItem from './Grid/GridItem';
import ElementsGroup from './ElementsGroup/ElementsGroup';
import { BootstrapButton, MaterialButton, UnstyledButton } from './Button';
import { BootstrapInput, MaterialInput, UnstyledInput } from './Input';
import {
  BootstrapTextarea,
  MaterialTextarea,
  UnstyledTextarea,
} from './Textarea';
import { BootstrapSlider, MaterialSlider, UnstyledSlider } from './Slider';
import {
  BootstrapCheckbox,
  MaterialCheckbox,
  UnstyledCheckbox,
} from './Checkbox';
import {
  BootstrapRadiobutton,
  MaterialRadiobutton,
  UnstyledRadiobutton,
} from './Radiobutton';
import { BootstrapSelect, MaterialSelect, UnstyledSelect } from './Select';
import { UnstyledOption, MaterialOption } from './Option';
import HTMLElement from './HTMLElement/HTMLElement';
import withUIFramework from './withUIFramework';
import BootstrapBreadcrumbItem from './BreadcrumbItem/BootstrapBreadcrumbItem';
import BootstrapBreadcrumb from './Breadcrumb/BootstrapBreadcrumb';
import BootstrapPagination from './Pagination/BootstrapPagination';
import BootstrapPaginationItem from './PaginationItem/BootstrapPaginationItem';
import BootstrapCarousel from './Carousel/BootstrapCarousel';
import BootstrapCarouselItem from './CarouselItem/BootstrapCarouselItem';
import OtherPagination from './Pagination/OtherPagination';
import OtherPaginationItem from './PaginationItem/OtherPaginationItem';
import OtherBreadcrumb from './Breadcrumb/OtherBreadcrumb';
import OtherBreadcrumbItem from './BreadcrumbItem/OtherBreadcrumbItem';
import BootstrapNavbar from './Navbar/BootstrapNavbar';
import BootstrapNavbarItem from './NavbarItem/BootstrapNavbarItem';
import OtherNavbarItem from './NavbarItem/OtherNavbarItem';
import OtherCarousel from './Carousel/OtherCarousel';
import OtherNavbar from './Navbar/OtherNavbar';
import OtherCarouselItem from './CarouselItem/OtherCarouselItem';
import RadiobuttonGroup from './RadiobuttonGroup';

import { DateTimePicker } from './DateTimePicker';
import Icon from './Icon/Icon';

const RENDERERS: Record<Entity, React.FC<any>> = {
  root: Container,
  container: Container,
  divBlock: DivBlockRenderer,
  pageTemplate: Container,
  emptyPageTemplate: Container,
  nativeColumns: NativeColumns,
  gridItem: GridItem,
  grid: Grid,
  columns: Columns,
  column: Column,
  icon: Icon,
  button: withUIFramework({
    bootstrap: BootstrapButton,
    material: MaterialButton,
    not_selected: UnstyledButton,
  }),
  buttonGenerator: Container,
  input: withUIFramework({
    bootstrap: BootstrapInput,
    material: MaterialInput,
    not_selected: UnstyledInput,
  }),
  textinput: withUIFramework({
    bootstrap: BootstrapInput,
    material: MaterialInput,
    not_selected: UnstyledInput,
  }),
  radiobuttonGroup: RadiobuttonGroup,
  radiobutton: withUIFramework({
    bootstrap: BootstrapRadiobutton,
    material: MaterialRadiobutton,
    not_selected: UnstyledRadiobutton,
  }),
  checkbox: withUIFramework({
    bootstrap: BootstrapCheckbox,
    material: MaterialCheckbox,
    not_selected: UnstyledCheckbox,
  }),
  switch: SwitchMui,
  textarea: withUIFramework({
    bootstrap: BootstrapTextarea,
    material: MaterialTextarea,
    not_selected: UnstyledTextarea,
  }),
  dateTimePicker: DateTimePicker,
  slider: withUIFramework({
    bootstrap: BootstrapSlider,
    material: MaterialSlider,
    not_selected: UnstyledSlider,
  }),
  heading: Heading,
  paragraph: Paragraph,
  ocrtext: Paragraph,
  textBlock: TextBlock,
  list: List,
  listItem: ListItem,
  breadcrumb: withUIFramework({
    bootstrap: BootstrapBreadcrumb,
    material: OtherBreadcrumb,
    not_selected: OtherBreadcrumb,
  }),
  breadcrumbItem: withUIFramework({
    bootstrap: BootstrapBreadcrumbItem,
    material: OtherBreadcrumbItem,
    not_selected: OtherBreadcrumbItem,
  }),
  pagination: withUIFramework({
    bootstrap: BootstrapPagination,
    material: OtherPagination,
    not_selected: OtherPagination,
  }),
  paginationItem: withUIFramework({
    bootstrap: BootstrapPaginationItem,
    material: OtherPaginationItem,
    not_selected: OtherPaginationItem,
  }),
  carousel: withUIFramework({
    bootstrap: BootstrapCarousel,
    material: OtherCarousel,
    not_selected: OtherCarousel,
  }),
  carouselItem: withUIFramework({
    bootstrap: BootstrapCarouselItem,
    material: OtherCarouselItem,
    not_selected: OtherCarouselItem,
  }),
  label: Label,
  imagesList: ImagesList,
  image: Image,
  smartHeader: withSmartContainer(NNBlockType.HEADER),
  smartFooter: withSmartContainer(NNBlockType.FOOTER),
  smartForm: withSmartContainer(NNBlockType.FORM),
  smartWebpage: withSmartContainer(NNBlockType.WEBPAGE),
  select: withUIFramework({
    bootstrap: BootstrapSelect,
    material: MaterialSelect,
    not_selected: UnstyledSelect,
  }),
  option: withUIFramework({
    bootstrap: UnstyledOption,
    material: MaterialOption,
    not_selected: UnstyledOption,
  }),
  map: Map,
  calendar: Calendar,
  clock: Clock,
  dropdown: Dropdown,
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  video: Video,
  subscribeForm: Container,
  cardsSection: Container,
  featureSection: Container,
  section: Section,
  group: ElementsGroup,
  html: HTMLElement,
  navbar: withUIFramework({
    bootstrap: BootstrapNavbar,
    material: OtherNavbar,
    not_selected: OtherNavbar,
  }),
  navbarItem: withUIFramework({
    bootstrap: BootstrapNavbarItem,
    material: OtherNavbarItem,
    not_selected: OtherNavbarItem,
  }),
  hyperlink: Label,
};

export default RENDERERS;
