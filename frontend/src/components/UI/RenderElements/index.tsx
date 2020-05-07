import React from 'react';
import cn from 'classnames';

import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { ElementEntity } from '$domain/core';

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
import { ImageRendererProps, MapRendererProps, ClockRendererProps, SharedElementRendererProps } from './types';
import { YoutubeVideoRenderer } from './YoutubeVideo/YoutubeVideo';
const styles = require('./styles.scss');

const ImgRenderer = (props: ImageRendererProps) => {
  const { id, params, active, sortableId, style, isDisabled } = props;

  return (
    <img
      src={params.imageURL}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={style}
      alt={id}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

const MapWidgetRenderer = (props: MapRendererProps) => {
  const { id, params, active, isDisabled, style, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedWidget, isDisabled && styles.disabled, active && 'activated')}
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

const CalendarWidgetRenderer = (props: SharedElementRendererProps) => {
  const { id, style, active, isDisabled, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, isDisabled && styles.disabled, active && 'activated')}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <CalendarWidget />
    </div>
  );
}

const ClockWidgetRenderer = (props: ClockRendererProps) => {
  const { id, params, style, active, sortableId, isDisabled } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, active && 'activated')}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const UndefinedRenderer = (props: SharedElementRendererProps) => {
  const { id, active, style, sortableId, isDisabled } = props;
  return (
    <div
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedContainer, active && 'activated')}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

export const RENDERERS: Record<ElementEntity, React.FunctionComponent<any>> = {
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
  label: Label,
  hyperlink: withAction(Link, 'link'),
  image: ImgRenderer,
  select: Select,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  dropdown: Dropdown,
  youtubeVideo: YoutubeVideoRenderer,
  undefined: UndefinedRenderer,
};

export const EXPORT_RENDERERS: Record<ElementEntity, React.FunctionComponent<any>> = {
  ...RENDERERS,
  button: withAction(Action, 'button', true),
  hyperlink: withAction(Link, 'link', true),
};
