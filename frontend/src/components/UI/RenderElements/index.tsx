import React from 'react';
import Column from '@Components/UI/RenderElements/Columns/Column';
import NativeColumns from '@Components/UI/RenderElements/NativeColumns';
import { Entity, NNBlockType } from '@Src/types';
import Button from './Button/Button';
import Checkbox from './Checkbox/Checkbox';
import Radiobutton from './Radiobutton/Radiobutton';
import Input from './Input/Input';
import Select from './Select/Select';
import Heading from './Heading/Heading';
import Paragraph from './Paragraph/Paragraph';
import Link from './Link/Link';
import TextBlock from './TextBlock/TextBlock';
import List from './List/List';
import Textarea from './Textarea/Textarea';
import Label from './Label/Label';
import Dropdown from './Dropdown/Dropdown';
import Video from './Video/Video';
import ListItem from './ListItem/ListItem';
import SelectMenu from './Select/SelectMenu';
// import MenuItem from './MenuItem/MenuItem';
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
import SelectItem from './Select/SelectItem';

// eslint-disable-next-line import/prefer-default-export
export const RENDERERS: Record<Entity, React.FC<any>> = {
  root: Container,
  container: Container,
  divBlock: DivBlockRenderer,
  pageTemplate: Container,
  emptyPageTemplate: Container,
  grid: Container,
  nativeColumns: NativeColumns,
  columns: Columns,
  column: Column,
  button: Button,
  textinput: Input,
  radiobutton: Radiobutton,
  checkbox: Checkbox,
  textarea: Textarea,
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
  select: Select,
  selectMenu: SelectMenu,
  selectItem: SelectItem,
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
};
