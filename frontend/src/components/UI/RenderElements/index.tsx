import React from 'react';
import classNames from 'classnames';

import { IScreenProps } from '$redux/project/reducer';
import { getDefaultDateSelectOptions, DEFAULT_MAP_PROPS } from '$constants/defaultParams';
import { IStylesElement } from '$utils/StyleHelper';
import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';

const styles = require('./styles.scss');

export interface IElement {
  id: string,
  style: IStylesElement,
  params: IScreenProps,
  name?: string,
  orientation?: string,
  active?: boolean,
  isDisabled?: boolean,
  children?: JSX.Element,
}

type TRenderElement = (args: IElement) => React.ReactNode;

const renderBlock: TRenderElement = ({ active, children, style }) => (
  <div
    className={classNames('addedItem', styles.addedBlock, active && styles.activated)}
    style={{
      ...style,
      overflowWrap: 'break-word',
    }}
  >
    {children || null}
  </div>
);

const renderContainer: TRenderElement = ({ active, children, style }) => (
  <div
    className={classNames('addedItem', styles.addedContainer, active && styles.activated)}
    style={{
      ...style,
      overflowWrap: 'break-word',
    }}
  >
    {children || null}
  </div>
);

const renderGroup: TRenderElement = ({
  id, active, children, style,
}) => (
  <div
    id={id}
    className={classNames('addedItem', styles.addedGroup, active && styles.activated)}
    style={{
      ...style,
      overflowWrap: 'break-word',
    }}
  >
    {children || null}
  </div>
);

const renderButton: TRenderElement = ({
  id, style, params, active,
}) => (
  <button
    id={id}
    className={classNames('addedItem', styles.addedButton, active && styles.activated)}
    type="button"
    style={{ ...style }}
  >
    {params.content || 'button'}
  </button>
);

const renderHyperLine: TRenderElement = ({ id, style, active, isDisabled, params }) => (
  <a
    id={id}
    className={classNames('addedItem', styles.addedHyperLink, active && styles.activated)}
    href={isDisabled ? '#' : params.url}
    // href="javascript:void(0);"
    style={{ ...style }}
  >
    {params.content || 'HyperLink'}
  </a>
);

const renderInput: TRenderElement = ({
  id, style, params, isDisabled, active,
}) => (
  <input
    id={id}
    className={classNames('addedItem', styles.addedInput, active && styles.activated)}
    type="text"
    placeholder={params.dynamic_placeholder || params.placeholder || 'input'}
    style={{ ...style }}
    readOnly={isDisabled}
  />
);

const renderSelect: TRenderElement = ({
  id, style, name, isDisabled, active,
}) => (
  <select
    id={id}
    className={classNames('addedItem', styles.addedSelect, active && styles.activated)}
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

const renderText: TRenderElement = ({
  id, style, params, name, active,
}) => (
  <p
    id={id}
    className={classNames('addedItem', styles.addedElem, active && styles.activated)}
    style={{ ...style }}
  >
    {params.content || name || 'text'}
  </p>
);

const renderImg: TRenderElement = ({ id, params, active }) => (
  <img
    src={params.image}
    className={classNames('addedItem', styles.addedElem, active && styles.activated)}
    alt={id}
  />
);

const renderMapWidget: TRenderElement = ({ id, params, active, style }) => (
  <div
    id={id}
    className={classNames('addedItem', styles.addedWidget, active && styles.activated)}
    style={{ ...style }}
  >
    <GMap
      center={(params.map_props && params.map_props.center) || DEFAULT_MAP_PROPS.center}
      zoom={(params.map_props && params.map_props.zoom) || DEFAULT_MAP_PROPS.zoom}
      markerText={(params.map_props && params.map_props.markerText) || DEFAULT_MAP_PROPS.markerText}
    />
  </div>
);

const renderCalendarWidget = ({ id, params, style, active }) => (
  <div
    id={id}
    className={classNames('addedItem', styles.addedCalendar, active && styles.activated)}
    style={{ ...style }}
  >
    <CalendarWidget />
  </div>
);

const renderClockWidget = ({ id, params, style, active }) => (
  <div
    id={id}
    className={classNames('addedItem', styles.addedCalendar, active && styles.activated)}
    style={{ ...style }}
  >
    <ClockWidget
      size={params.width}
    />
  </div>
);

const renderElem: TRenderElement = ({
  id, children, style, params, active,
}) => {
  switch (params.html_type) {
    case 'text_title':
    case 'text_description':
      return renderText({ id, style, params });

    case 'input_firstname':
      return renderInput({ id, style, params: { ...params, placeholder: 'firstname' } });

    case 'input_lastname':
      return renderInput({ id, style, params: { ...params, placeholder: 'lastname' } });

    case 'input_password':
      return renderInput({ id, style, params: { ...params, placeholder: 'password' } });

    case 'input_phone':
      return renderInput({ id, style, params: { ...params, placeholder: 'phone' } });

    case 'select_day':
      return renderSelect({ id, style, params: { ...params, placeholder: 'day' } });

    case 'select_month':
      return renderSelect({ id, style, params: { ...params, placeholder: 'month' } });

    case 'select_year':
      return renderSelect({ id, style, params: { ...params, placeholder: 'year' } });

    case 'button_end_composite_scenario':
    case 'button_end_simple_scenario':
      return renderButton({ id, style, params });

    case 'hyperlink_end_simple_scenario':
      return renderHyperLine({ id, style, params });

    default: {
      // console.warn(`No render type of ${params.html_type}, element id:${id} !`);
      return (
        <div
          className={classNames(styles.addedElem, active && styles.activated)}
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

export const RENDERERS = {
  block: renderBlock,
  container: renderContainer,
  group: renderGroup,
  elem: renderElem,
  button: renderButton,
  textinput: renderInput,
  hyperlink: renderHyperLine,
  ocrtext: renderText,
  image: renderImg,
  select: renderSelect,
  map: renderMapWidget,
  calendar: renderCalendarWidget,
  clock: renderClockWidget,
} as const;
