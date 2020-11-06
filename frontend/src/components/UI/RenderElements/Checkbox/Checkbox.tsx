// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, Checkbox as MaterialCheckbox } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import * as R from 'ramda';
import { CheckboxRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const styles = require('../styles.scss');

const getCheckboxClassStyles = (style: React.CSSProperties) => ({
  color: style.backgroundColor,

  '&$checked': {
    color: style.backgroundColor,
  },

  '& $icon': {
    width: style.width,
    height: style.height,
  },
});

const getCheckboxStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {},

    entityStyles: {
      ...getCheckboxClassStyles(entityStyles),
    },

    groupStyles: {
      ...getCheckboxClassStyles(groupStyles),
    },

    ownStyles: {
      ...getCheckboxClassStyles(ownStyles),
    },

    icon: {},

    checked: {},
  });

const getDivStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...entityStyles,
      display: 'inline-block',
    },

    groupStyles: {
      ...groupStyles,
      display: 'inline-block',
    },

    ownStyles: {
      ...ownStyles,
      display: 'inline-block',
    },
  });

const Checkbox: React.FC<CheckboxRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      entityStyles,
      groupStyles,
      ownStyles,
      params,
      isDisabled,
      currentValue,
      isCheckboxChecked,
      className,
    } = props;
    const { name, showRipple } = params;

    const eventHandlers = useEventHandlers(props);

    const entityDivStyles = R.omit(
      ['backgroundColor', 'width', 'height'],
      entityStyles,
    );
    const groupDivStyles = R.omit(
      ['backgroundColor', 'width', 'height'],
      groupStyles,
    );
    const ownDivStyles = R.omit(
      ['backgroundColor', 'width', 'height'],
      ownStyles,
    );

    const divClasses = getDivStyles(
      entityDivStyles,
      groupDivStyles,
      ownDivStyles,
    )();

    const checkboxClasses = getCheckboxStyles(
      entityStyles,
      groupStyles,
      ownStyles,
    )();

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          isDisabled && styles.disabled,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        {...eventHandlers}
      >
        <MaterialCheckbox
          checkedIcon={<CheckBoxIcon className={checkboxClasses.icon} />}
          icon={<CheckBoxOutlineBlankIcon className={checkboxClasses.icon} />}
          color="default"
          className={cn(
            checkboxClasses.root,
            checkboxClasses.entityStyles,
            checkboxClasses.groupStyles,
            checkboxClasses.ownStyles,
          )}
          value={currentValue}
          name={name}
          checked={isCheckboxChecked}
          disableRipple={!showRipple}
        />
      </div>
    );
  },
);

export default Checkbox;
