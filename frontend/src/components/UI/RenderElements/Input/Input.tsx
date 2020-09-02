// @ts-nocheck

import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';
import * as R from 'ramda';

import { InputRendererProps } from '../types';

const styles = require('../styles.scss');

const getClassStyles = (style: React.CSSProperties) => {
  const classStyles = R.omit(
    [
      'width',
      'height',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
    ],
    style,
  );

  return {
    ...classStyles,

    '&::placeholder': {
      color: classStyles.color,
    },
  };
};

const getStyles = (
  isDisabled: boolean,
  active: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      height: '100%',

      '& fieldset': {
        border: 0,
      },

      '&$focused $input': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    input: {
      height: '100%',
      boxSizing: 'border-box',
      outline: active ? 'red solid 1px' : 'none',
      outlineOffset: '-1px',

      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },
    },

    focused: {},

    entityStyles: {
      ...getClassStyles(entityStyles),
    },

    groupStyles: {
      ...getClassStyles(groupStyles),
    },

    ownStyles: {
      ...getClassStyles(ownStyles),
    },
  });

const Input: React.FC<InputRendererProps> = ({
  id,
  params,
  isDisabled,
  active,
  entityStyles,
  groupStyles,
  ownStyles,
  sortableId,
  currentValue,
  onElementChange,
  elementRef,
  className,
}) => {
  const { type, placeholder } = params;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onElementChange(id, event.target.value);
  };

  const classes = getStyles(
    isDisabled,
    active,
    entityStyles,
    groupStyles,
    ownStyles,
  )();

  const entityInlineStyles = R.pick(
    [
      'width',
      'height',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
    ],
    entityStyles,
  );
  const groupInlineStyles = R.pick(
    [
      'width',
      'height',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
    ],
    groupStyles,
  );
  const ownInlineStyles = R.pick(
    [
      'width',
      'height',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
    ],
    ownStyles,
  );
  const inlineStyles = {
    ...entityInlineStyles,
    ...groupInlineStyles,
    ...ownInlineStyles,
    transition: 'none',
  };

  const InputProps = {
    readOnly: isDisabled,
    classes: {
      input: cn(
        classes.input,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      ),
    },
    className: cn(isDisabled && styles.disabled),
  };

  return (
    <TextField
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      variant="outlined"
      className={cn(className, isDisabled && styles.disabled, classes.root)}
      style={inlineStyles}
      type={type}
      value={currentValue}
      onChange={handleInputChange}
      InputProps={InputProps}
      placeholder={placeholder}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
};

export default Input;
