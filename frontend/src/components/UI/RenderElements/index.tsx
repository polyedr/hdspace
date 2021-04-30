import React from 'react';
import Grid from '@Components/UI/RenderElements/Grid';
import Column from '@Components/UI/RenderElements/Columns/Column';
import NativeColumns from '@Components/UI/RenderElements/NativeColumns';
import { Entity, NNBlockType } from '@Src/types';
import Heading from './Heading/Heading';
import Paragraph from './Paragraph/Paragraph';
import Link from './Link/Link';
import TextBlock from './TextBlock/TextBlock';
import List from './List/List';
import Label from './Label/Label';
import Dropdown from './Dropdown/Dropdown';
import Video from './Video/Video';
import ListItem from './ListItem/ListItem';
import MUISelectMenu from './Select/MUISelectMenu';
import DropdownMenu from './Dropdown/DropdownMenu';
import DropdownItem from './Dropdown/DropdownItem';
import DivBlockRenderer from './DivBlock/DivBlock';
import Image from './Image/Image';
import Map from './Map/Map';
import Calendar from './Calendar/Calendar';
import Container from './Container/Container';
import Section from './Section/Section';
import Clock from './Clock/Clock';
import Undefined from './Undefined/Undefined';
import withSmartContainer from './SmartContainer/withSmartContainer';
import Columns from './Columns';
import GridItem from './Grid/GridItem';
import ElementsGroup from './ElementsGroup/ElementsGroup';
import { BootstrapButton, MaterializeButton, UnstyledButton } from './Button';
import { BootstrapInput, MaterializeInput, UnstyledInput } from './Input';
import {
  BootstrapTextarea,
  MaterializeTextarea,
  UnstyledTextarea,
} from './Textarea';
import {
  BootstrapCheckbox,
  MaterializeCheckbox,
  UnstyledCheckbox,
} from './Checkbox';
import {
  BootstrapRadiobutton,
  MaterializeRadiobutton,
  UnstyledRadiobutton,
} from './Radiobutton';
import { BootstrapSelect, MaterializeSelect, UnstyledSelect } from './Select';
import Option from './Option/Option';
import HTMLElement from './HTMLElement/HTMLElement';
import withFramework from './withFramework';

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
  button: withFramework({
    bootstrap: BootstrapButton,
    materialize: MaterializeButton,
    not_selected: UnstyledButton,
  }),
  input: withFramework({
    bootstrap: BootstrapInput,
    materialize: MaterializeInput,
    not_selected: UnstyledInput,
  }),
  textinput: withFramework({
    bootstrap: BootstrapInput,
    materialize: MaterializeInput,
    not_selected: UnstyledInput,
  }),
  radiobutton: withFramework({
    bootstrap: BootstrapRadiobutton,
    materialize: MaterializeRadiobutton,
    not_selected: UnstyledRadiobutton,
  }),
  checkbox: withFramework({
    bootstrap: BootstrapCheckbox,
    materialize: MaterializeCheckbox,
    not_selected: UnstyledCheckbox,
  }),
  textarea: withFramework({
    bootstrap: BootstrapTextarea,
    materialize: MaterializeTextarea,
    not_selected: UnstyledTextarea,
  }),
  heading: Heading,
  paragraph: Paragraph,
  ocrtext: Paragraph,
  textBlock: TextBlock,
  list: List,
  listItem: ListItem,
  label: Label,
  hyperlink: Link,
  image: Image,
  smartHeader: withSmartContainer(NNBlockType.HEADER),
  smartFooter: withSmartContainer(NNBlockType.FOOTER),
  smartForm: withSmartContainer(NNBlockType.FORM),
  smartWebpage: withSmartContainer(NNBlockType.WEBPAGE),
  select: withFramework({
    bootstrap: BootstrapSelect,
    materialize: MaterializeSelect,
    not_selected: UnstyledSelect,
  }),
  selectMenu: MUISelectMenu,
  option: Option,
  map: Map,
  calendar: Calendar,
  clock: Clock,
  dropdown: Dropdown,
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  video: Video,
  undefined: Undefined,
  subscribeForm: Container,
  cardsSection: Container,
  featureSection: Container,
  section: Section,
  group: ElementsGroup,
  html: HTMLElement,
};

export default RENDERERS;
