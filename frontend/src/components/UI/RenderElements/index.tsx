import React from 'react';
import cn from 'classnames';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';

import { IScreenProps } from '$redux/project/types';
import { getDefaultDateSelectOptions } from '$constants/defaultParams';
import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$domain/core';

import { withAction, WithActionProps } from '../../../utils/withAction';
const styles = require('./styles.scss');

export type RendererProps = {
  id: string;
  style: React.CSSProperties;
  params: IScreenProps;
  name?: string;
  orientation?: string;
  active?: boolean;
  isDisabled?: boolean;
  children?: JSX.Element;
  sortableId?: string;
  onClick?(event: any, id: string): void;
};

type Renderer = React.FC<RendererProps>;
type ActionRenderer = React.FC<WithActionProps & RendererProps>;

const ActionRenderer: ActionRenderer = (props) => {
  const {
    id,
    style,
    active,
    isDisabled,
    params,
    onClick,
    sortableId,
    actionType,
    actionLink,
  } = props;

  const commonProps = {
    id,
    'data-ls-id': id,
    'data-id': sortableId,
    key: id,
    className: cn('ls-item', isDisabled && styles.disabled, active && 'activated'),
    style: style,
  }

  switch (actionType) {
    case 'external-link': {
      return (
        <a {...commonProps} href={actionLink} target="_blank" onClick={onClick}>
          {params.textContent}
        </a>
      )
    }

    case 'internal-link': {
      return (
        <Link {...commonProps} to={actionLink} onClick={onClick}>
          {params.textContent}
        </Link>
      )
    }

    case 'button': {
      return (
        <Button {...commonProps} type="primary" onClick={onClick}>
          {params.textContent}
        </Button>
      )
    }
  }
}

const InputRenderer: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId } = props;
  return (
    <Input
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      type="text" // TODO: use other types such as email, etc.
      className={cn('ls-item', isDisabled && styles.disabled, active && 'activated')}
      readOnly={isDisabled}
      style={{
        ...style,
        transition: 'none',
      }}
      onClick={(event) => onClick?.(event, id)}
      placeholder={params.textContent}
    />
  );
};

const SelectRenderer: Renderer = (props) => {
  const { id, style, name, isDisabled, active, sortableId } = props;
  return (
    <select
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedSelect, active && 'activated')}
      style={style}
    >
      {
        getDefaultDateSelectOptions(name).map(option => (
          <option
            key={`key-${option.value}`}
            value={option.value}
            hidden={isDisabled}
          >
            {option.label}
          </option>
        ))
      }
    </select>
  );
};

const TextRenderer: Renderer = (props) => {
  const { id, style, params, name, active, sortableId } = props;
  return (
    <p
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, wordBreak: 'break-word', overflowY: 'auto' }}
      tabIndex={0}
    >
      {params.textContent}
    </p>
  );
};

const ImgRenderer: Renderer = (props) => {
  const { id, params, active, sortableId, style } = props;

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
      tabIndex={0}
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
      tabIndex={0}
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
      tabIndex={0}
    >
      <CalendarWidget />
    </div>
  );
}

const ClockWidgetRenderer: Renderer = (props) => {
  const { id, params, style, active, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, active && 'activated')}
      style={style}
      tabIndex={0}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const UndefinedRenderer: Renderer = (props) => {
  const { id, active, style, sortableId } = props;
  return (
    <div
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedContainer, active && 'activated')}
      style={style}
      tabIndex={0}
    />
  );
}

export const RENDERERS: Record<Exclude<Entity, 'root' | 'container'>, React.FunctionComponent<any>> = {
  button: withAction(ActionRenderer, 'button'),
  textinput: InputRenderer,
  hyperlink: withAction(ActionRenderer, 'link'),
  ocrtext: TextRenderer,
  image: ImgRenderer,
  select: SelectRenderer,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  undefined: UndefinedRenderer,
};
