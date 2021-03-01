import React from 'react';
import Grid from '@Components/UI/RenderElements/Grid';
import Column from '@Components/UI/RenderElements/Columns/Column';
import NativeColumns from '@Components/UI/RenderElements/NativeColumns';
import { Entity, NNBlockType } from '@Src/types';
// import MUIButton from './MUIButton/MUIButton';
// import MUICheckbox from './MUICheckbox/MUICheckbox';
// import MUIRadiobutton from './MUIRadiobutton/MUIRadiobutton';
// import MUIInput from './MUIInput/MUIInput';
// import MUISelect from './MUISelect/MUISelect';
import Heading from './Heading/Heading';
import Paragraph from './Paragraph/Paragraph';
import Link from './Link/Link';
import TextBlock from './TextBlock/TextBlock';
import List from './List/List';
// import MUITextarea from './Textarea/Textarea';
import Label from './Label/Label';
import Dropdown from './Dropdown/Dropdown';
import Video from './Video/Video';
import ListItem from './ListItem/ListItem';
import MUISelectMenu from './MUISelect/MUISelectMenu';
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
// import MUISelectItem from './MUISelect/MUISelectItem';
import GridItem from './Grid/GridItem';
import ElementsGroup from './ElementsGroup/ElementsGroup';
import Button from './Button/Button';
import Input from './Input/Input';
import Textarea from './Textarea/Textarea';
import Checkbox from './Checkbox/Checkbox';
import Radiobutton from './Radiobutton/Radiobutton';
import Select from './Select/Select';
import Option from './Option/Option';

// eslint-disable-next-line import/prefer-default-export
export const RENDERERS: Record<Entity, React.FC<any>> = {
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
};
