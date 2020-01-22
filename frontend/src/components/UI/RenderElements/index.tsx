import React from 'react';
import cn from 'classnames';
import { Input, Button } from 'antd';

import { IScreenProps } from '$redux/project/types';
import { getDefaultDateSelectOptions } from '$constants/defaultParams';
import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$utils/model';

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
  onClick?(event: any, id: string): void;
};

type Renderer = (args: RendererProps) => React.ReactNode;

const renderContainer: Renderer = (props) => {
  const { id, active, children, style, onClick, sortableId } = props;
  return (
    <div
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedContainer, active && styles.activated)}
      style={{
        ...style,
        overflowWrap: 'break-word',
        display: 'inline-block',
      }}
      onClick={(event) => onClick?.(event, id)}
      tabIndex={0}
    >
      {children || null}
    </div>
  );
}

const renderButton: Renderer = (props) => {
  const { id, style, params, active, onClick, sortableId } = props;
  return (
    <Button
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      type="primary"
      className={cn('ls-item', active && styles.activated)}
      style={{
        ...style,
        transition: 'none',
      }}
      onClick={(event) => onClick?.(event, id)}
    >
      {params.textContent}
    </Button>
  )
}

const renderHyperLine: Renderer = (props) => {
  const { id, style, active, isDisabled, params, sortableId } = props;
  return (
    <a
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedHyperLink, active && styles.activated)}
      href={isDisabled ? '#' : params.actionUrl} // TODO: DragResize prevents click by link, but must not when !isDisabled
      // href="javascript:void(0);"
      style={{ ...style }}
    >
      {params.actionContent}
    </a>
  );
};

const renderInput: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId } = props;
  return (
    <Input
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      type="text" // TODO: use other types such as email, etc.
      className={cn('ls-item', active && styles.activated)}
      readOnly={isDisabled}
      style={{
        ...style,
        transition: 'none',
      }}
      onClick={(event) => onClick?.(event, id)}
      placeholder={params.placeholder}
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
      style={{ ...style }}
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
  const { id, params, active, style, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedWidget, active && styles.activated)}
      style={{ ...style }}
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
  const { id, style, active, sortableId } = props;
  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedCalendar, active && styles.activated)}
      style={{ ...style }}
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
      style={{ ...style }}
      tabIndex={0}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const renderElem: Renderer = ({
  id, children, style, params, active, sortableId,
}) => {
  switch (params.html_type) {
    case 'text_title':
    case 'text_description':
      return renderText({ id, style, params, sortableId });

    case 'input_firstname':
      return renderInput({ id, style, params: { ...params, placeholder: 'firstname' }, sortableId });

    case 'input_lastname':
      return renderInput({ id, style, params: { ...params, placeholder: 'lastname' }, sortableId });

    case 'input_password':
      return renderInput({ id, style, params: { ...params, placeholder: 'password' }, sortableId });

    case 'input_phone':
      return renderInput({ id, style, params: { ...params, placeholder: 'phone' }, sortableId });

    case 'select_day':
      return renderSelect({ id, style, params: { ...params, placeholder: 'day' }, sortableId });

    case 'select_month':
      return renderSelect({ id, style, params: { ...params, placeholder: 'month' }, sortableId });

    case 'select_year':
      return renderSelect({ id, style, params: { ...params, placeholder: 'year' }, sortableId });

    case 'button_end_composite_scenario':
    case 'button_end_simple_scenario':
      return renderButton({ id, style, params, sortableId });

    case 'hyperlink_end_simple_scenario':
      return renderHyperLine({ id, style, params, sortableId });

    default: {
      // console.warn(`No render type of ${params.html_type}, element id:${id} !`);
      return (
        <div
          data-ls-id={id}
          data-id={sortableId}
          key={id}
          className={cn('ls-item', styles.addedElem, active && styles.activated)}
          style={{
            ...style,
            // ...parseStylesCss(style),
            overflowWrap: 'break-word',
          }}
        >
          <span>{id}</span>
          {children || null}
        </div>
      );
    }
  }
};

export const RENDERERS: Record<Exclude<'root', Entity>, React.ComponentType> = {
  container: renderContainer,
  button: renderButton,
  textinput: renderInput,
  hyperlink: renderHyperLine,
  ocrtext: renderText,
  image: renderImg,
  select: renderSelect,
  map: renderMapWidget,
  calendar: renderCalendarWidget,
  clock: renderClockWidget,
};
