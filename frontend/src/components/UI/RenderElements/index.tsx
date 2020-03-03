import React from 'react';
import cn from 'classnames';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';

import * as Actions from '$redux/project/actions';
import { IScreenProps } from '$redux/project/types';
import { getDefaultDateSelectOptions } from '$constants/defaultParams';
import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$domain/core';

const styles = require('./styles.scss');

type RendererProps = {
  id: string;
  style: React.CSSProperties;
  params: IScreenProps;
  name?: string;
  orientation?: string;
  active?: boolean;
  isDisabled?: boolean;
  children?: JSX.Element;
  sortableId?: string;
  projectID: number;
  screensIDs: number[];
  activateScreen: typeof Actions.activateScreen;
  onClick?(event: any, id: string): void;
};

type Renderer = React.FC<RendererProps>;

const renderLinkOrButton: (type: 'link' | 'button') => Renderer = (type) => (props) => {
  const { id, style, active, isDisabled, params, onClick, sortableId, projectID, screensIDs, activateScreen } = props;

  const isExternalLink = React.useCallback(() => {
    return !screensIDs.includes(Number(params.actionUrl));
  }, [params.actionUrl, screensIDs]);

  const commonProps = {
    id,
    'data-ls-id': id,
    'data-id': sortableId,
    key: id,
    className: cn('ls-item', isDisabled && styles.disabled, active && styles.activated),
    style: style,
  }

  const handleExternalLinkClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    isDisabled ? event.preventDefault() : params.actionUrl && activateScreen(projectID, Number(params.actionUrl));
  }, [isDisabled, params.actionUrl, activateScreen, projectID]);

  if (params.actionUrl || type === 'link') {
    return isExternalLink() ? (
      <a
        {...commonProps}
        href={params.actionUrl} // TODO: DragResize prevents click by link, but must not when !isDisabled
        target="_blank"
        onClick={event => isDisabled && event.preventDefault()}
      >
        {params.textContent}
      </a>
    ) : (
      <Link {...commonProps} to={params.actionUrl || ''} onClick={handleExternalLinkClick}>
        {params.textContent}
      </Link>
    );
  } else {
    return (
      <Button
        {...commonProps}
        type="primary"
        onClick={(event) => onClick?.(event, id)}
      >
        {params.textContent}
      </Button>
    )
  }
}

const renderInput: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId } = props;
  return (
    <Input
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      type="text" // TODO: use other types such as email, etc.
      className={cn('ls-item', isDisabled && styles.disabled, active && styles.activated)}
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

const renderSelect: Renderer = (props) => {
  const { id, style, name, isDisabled, active, sortableId } = props;
  return (
    <select
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedSelect, active && styles.activated)}
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

const renderText: Renderer = (props) => {
  const { id, style, params, name, active, sortableId } = props;
  return (
    <p
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && styles.activated)}
      style={{ ...style, wordBreak: 'break-word', overflowY: 'auto' }}
      tabIndex={0}
    >
      {params.textContent}
    </p>
  );
};

const renderImg: Renderer = (props) => {
  const { id, params, active, sortableId } = props;
  return (
    <img
      src={params.image}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && styles.activated)}
      alt={id}
      tabIndex={0}
    />
  );
}

const renderMapWidget: Renderer = (props) => {
  const { id, params, active, isDisabled, style, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedWidget, isDisabled && styles.disabled, active && styles.activated)}
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

const renderCalendarWidget: Renderer = (props) => {
  const { id, style, active, isDisabled, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, isDisabled && styles.disabled, active && styles.activated)}
      style={style}
      tabIndex={0}
    >
      <CalendarWidget />
    </div>
  );
}

const renderClockWidget: Renderer = (props) => {
  const { id, params, style, active, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, active && styles.activated)}
      style={style}
      tabIndex={0}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const renderUndefined: Renderer = (props) => {
  const { id, active, style, sortableId } = props;
  return (
    <div
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedContainer, active && styles.activated)}
      style={style}
      tabIndex={0}
    />
  );
}

export const RENDERERS: Record<Exclude<Entity, 'root' | 'container'>, React.FunctionComponent<any>> = {
  button: renderLinkOrButton('button'),
  textinput: renderInput,
  hyperlink: renderLinkOrButton('link'),
  ocrtext: renderText,
  image: renderImg,
  select: renderSelect,
  map: renderMapWidget,
  calendar: renderCalendarWidget,
  clock: renderClockWidget,
  undefined: renderUndefined,
};
