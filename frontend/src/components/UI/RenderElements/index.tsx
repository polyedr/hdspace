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
import { BootstrapButton, MaterialButton, UnstyledButton } from './Button';
import { BootstrapInput, MaterialInput, UnstyledInput } from './Input';
import {
  BootstrapTextarea,
  MaterialTextarea,
  UnstyledTextarea,
} from './Textarea';
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
  button: withUIFramework({
    bootstrap: BootstrapButton,
    material: MaterialButton,
    not_selected: UnstyledButton,
  }),
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
  textarea: withUIFramework({
    bootstrap: BootstrapTextarea,
    material: MaterialTextarea,
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
  undefined: Undefined,
  subscribeForm: Container,
  cardsSection: Container,
  featureSection: Container,
  section: Section,
  group: ElementsGroup,
  html: HTMLElement,
};

export default RENDERERS;
