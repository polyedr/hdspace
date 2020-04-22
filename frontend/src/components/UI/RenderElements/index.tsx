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
import { Renderer } from './types';
const styles = require('./styles.scss');

const TextRenderer: Renderer = (props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;
  return (
    <p
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, wordBreak: 'break-word', overflowY: 'auto' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </p>
  );
};

const ImgRenderer: Renderer = (props) => {
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

const MapWidgetRenderer: Renderer = (props) => {
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

const CalendarWidgetRenderer: Renderer = (props) => {
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

const ClockWidgetRenderer: Renderer = (props) => {
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

const UndefinedRenderer: Renderer = (props) => {
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

export const RENDERERS: Record<Exclude<Entity, 'root' | 'container'>, React.FunctionComponent<any>> = {
  button: withAction(Action, 'button'),
  textinput: Input,
  radiobutton: Radiobutton,
  checkbox: Checkbox,
  hyperlink: withAction(Action, 'link'),
  ocrtext: TextRenderer,
  image: ImgRenderer,
  select: Select,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  undefined: UndefinedRenderer,
};

export const EXPORT_RENDERERS: Record<Exclude<Entity, 'root' | 'container'>, React.FunctionComponent<any>> = {
  ...RENDERERS,
  button: withAction(Action, 'button', true),
  hyperlink: withAction(Action, 'link', true),
};
