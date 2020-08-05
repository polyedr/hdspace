import React from 'react';
import cn from 'classnames';

import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$domain/core';

import { withAction } from '../../../utils/withAction';
import { Action } from './Action/Action';
import { Checkbox } from './Checkbox/Checkbox';
import { Radiobutton } from './Radiobutton/Radiobutton';
import { Input } from './Input/Input';
import { Select } from './Select/Select';
import { Heading } from './Heading/Heading';
import { Paragraph } from './Paragraph/Paragraph';
import { Link } from './Link/Link';
import { TextBlock } from './TextBlock/TextBlock';
import { List } from './List/List';
import { Textarea } from './Textarea/Textarea';
import { Label } from './Label/Label';
import { Dropdown } from './Dropdown/Dropdown';
import { Video } from './Video/Video';
import { ListItem } from './ListItem/ListItem';
import { SelectMenu } from './SelectMenu/SelectMenu';
import { MenuItem } from './MenuItem/MenuItem';
import { DropdownMenu } from './DropdownMenu/DropdownMenu';
import { DropdownItem } from './DropdownItem/DropdownItem';
import { DivBlockRenderer } from './DivBlock/DivBlock';
import { Image } from './Image/Image';
import { MapRendererProps, ClockRendererProps, SharedRendererProps } from './types';
import { Container } from './Container/Container';
const styles = require('./styles.scss');



const MapWidgetRenderer = (props: MapRendererProps) => {
  const { id, params, isDisabled, style, sortableId, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedWidget, isDisabled && styles.disabled)}
      style={style}
      onClick={event => isDisabled && event.preventDefault()}
      tabIndex={isDisabled ? 0 : -1}
    >
      <GMap
        center={params.map_props.center}
        zoom={params.map_props.zoom}
        markerText={params.map_props.markerText}
      />
    </div>
  );
};

const CalendarWidgetRenderer = (props: SharedRendererProps) => {
  const { id, style, isDisabled, sortableId, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedCalendar, isDisabled && styles.disabled)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <CalendarWidget />
    </div>
  );
}

const ClockWidgetRenderer = (props: ClockRendererProps) => {
  const { id, params, style, sortableId, isDisabled, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedCalendar)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const UndefinedRenderer = (props: SharedRendererProps) => {
  const { id, style, sortableId, isDisabled, className, elementRef, children } = props;
  return (
    <div
      ref={elementRef}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedContainer)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </div>
  );
}

export const RENDERERS: Record<Entity, React.FunctionComponent<any>> = {
  root: Container,
  container: Container,
  divBlock: DivBlockRenderer,
  button: withAction(Action, 'button'),
  textinput: Input,
  radiobutton: Radiobutton,
  checkbox: Checkbox,
  textarea: Textarea,
  heading: Heading,
  paragraph: Paragraph,
  ocrtext: Paragraph,
  text_block: TextBlock,
  list: List,
  listItem: ListItem,
  label: Label,
  hyperlink: withAction(Link, 'link'),
  image: Image,
  select: Select,
  selectMenu: SelectMenu,
  selectItem: MenuItem,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  dropdown: Dropdown,
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  video: Video,
  undefined: UndefinedRenderer,
};

export const EXPORT_RENDERERS: Record<Entity, React.FunctionComponent<any>> = {
  ...RENDERERS,
  button: withAction(Action, 'button', true),
  hyperlink: withAction(Link, 'link', true),
};
