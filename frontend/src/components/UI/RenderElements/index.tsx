import React, { useCallback, ChangeEvent, useState } from 'react';
import cn from 'classnames';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { IScreenProps } from '$redux/project/types';
import { getDefaultDateSelectOptions } from '$constants/defaultParams';
import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$domain/core';

import { withAction, WithActionProps, ActionType } from '../../../utils/withAction';
import { makeStyles, Checkbox, Button } from '@material-ui/core';
import classNames from 'classnames';
import * as R from 'ramda';
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
  savedElement: { id: number, savedValue: string };
  onClick?(event: any): void;
  onChange(itemID: string, savedValue: string): void;
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

  const { backgroundColor } = style;

  const useStyles = makeStyles({
    root: {
      backgroundColor,
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        backgroundColor,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
      '&:active': {
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
    },
  });

  const classes = useStyles();

  const components: Record<ActionType, any> = {
    'external-link': 'a',
    'internal-link': Link,
    button: 'button',
  }

  return (
    <Button
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="contained"
      color="primary"
      style={R.omit(['backgroundColor'], style)}
      className={cn(classes.root, 'ls-item', isDisabled && styles.disabled, active && 'activated')}
      disableRipple={isDisabled}
      component={components[actionType]}
      {...actionType === 'external-link' && { href: actionLink, target: '_blank' }}
      {...actionType === 'internal-link' && { to: actionLink }}
      onClick={onClick}
    >
      {params.textContent}
    </Button>
  );
}

const CheckboxRenderer: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId, savedElement, onChange } = props;
  const { backgroundColor, width, height } = style;

  const [checked, setChecked] = useState(true);

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(false);
  }, [checked]);

  const useStyles = makeStyles({
    root: {
      color: backgroundColor || 'red',
      '&$checked': {
        color: backgroundColor || 'red',
      },
    },
    icon: {
      width,
      height,
    },
    checked: {},
  });

  const classes = useStyles();

  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      style={{ ...R.omit(['backgroundColor', 'width', 'height'], style), display: 'inline-block' }}
      className={classNames('ls-item', isDisabled && styles.disabled, active && 'activated')}
    >
      <Checkbox
        checkedIcon={<CheckBoxIcon className={classes.icon} />}
        icon={<CheckBoxOutlineBlankIcon className={classes.icon} />}
        color="default"
        className={classes.root}
        value={params.value}
        name={params.name}
        checked={true}
        onChange={handleCheckboxChange}
      />
    </div>
  );
}

const RadiobuttonRenderer: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId, savedElement, onChange } = props;
  const { backgroundColor, width, height } = style;

  const [checked, setChecked] = useState(true);

  const handleRadioChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(false);
  }, [checked]);

  const useStyles = makeStyles({
    root: {
      color: backgroundColor || 'red',
      '&$checked': {
        color: backgroundColor || 'red',
      },
    },
    icon: {
      width,
      height,
    },
    checked: {},
  });

  const classes = useStyles();

  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      style={{ ...R.omit(['backgroundColor', 'width', 'height'], style), display: 'inline-block' }}
      className={classNames('ls-item', isDisabled && styles.disabled, active && 'activated')}
    >
      <Radio
        checkedIcon={<RadioButtonCheckedIcon className={classes.icon} />}
        icon={<RadioButtonUncheckedIcon className={classes.icon} />}
        color="default"
        className={classes.root}
        value={params.value}
        name={params.name}
        checked={true}
        onChange={handleRadioChange}
      />
    </div>
  );
}

const InputRenderer: Renderer = (props) => {
  const { id, style, params, isDisabled, active, onClick, sortableId, savedElement, onChange } = props;

  const textContent = isDisabled ? params.textContent : savedElement && savedElement.savedValue || '';

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(id, event.target.value);
  }, [onChange, id]);

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
      value={textContent}
      onClick={(event) => onClick?.(event)}
      placeholder={params.placeholder}
      onChange={handleInputChange}
    />
  );
};

const SelectRenderer: Renderer = (props) => {
  const { id, style, name, isDisabled, active, sortableId, savedElement, onChange } = props;
  const value = isDisabled ? '' : savedElement && savedElement.savedValue || '';

  const handleSelectChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onChange(id, event.target.value);
  }, [onChange, id]);

  return (
    <select
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedSelect, active && 'activated')}
      style={style}
      value={value}
      onChange={handleSelectChange}
      disabled={isDisabled}
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
  const { id, style, params, name, active, sortableId, isDisabled } = props;
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
  button: withAction(ActionRenderer, 'button'),
  textinput: InputRenderer,
  radiobutton: RadiobuttonRenderer,
  checkbox: CheckboxRenderer,
  hyperlink: withAction(ActionRenderer, 'link'),
  ocrtext: TextRenderer,
  image: ImgRenderer,
  select: SelectRenderer,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  undefined: UndefinedRenderer,
};

export const EXPORT_RENDERERS: Record<Exclude<Entity, 'root' | 'container'>, React.FunctionComponent<any>> = {
  ...RENDERERS,
  button: withAction(ActionRenderer, 'button', true),
  hyperlink: withAction(ActionRenderer, 'link', true),
};
