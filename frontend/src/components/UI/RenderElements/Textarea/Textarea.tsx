import React, { ChangeEvent } from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';
import * as R from 'ramda';

import { TextareaRendererProps } from '../types';

const styles = require('../styles.scss');

const getTextFieldClassStyles = (style: React.CSSProperties) => ({
  width: style.width,
  height: style.height,
});

const getTextFieldStyles = (
  isDisabled: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      '& fieldset': {
        border: 0,
      },

      '&.hovered $input': {
        outline: isDisabled ? '1px solid #949494' : 'none',
      },
    },

    entityStyles: {
      ...getTextFieldClassStyles(entityStyles),
    },

    groupStyles: {
      ...getTextFieldClassStyles(groupStyles),
    },

    ownStyles: {
      ...getTextFieldClassStyles(ownStyles),
    },

    input: {},
  });

const getInputClassStyles = (style: React.CSSProperties) => ({
  ...R.omit(
    [
      'width',
      'height',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'textAlign',
    ],
    style,
  ),

  '& textarea': {
    textAlign: style.textAlign,
  },

  '&::placeholder': {
    color: style.color,
  },
});

const getInputStyles = (
  active: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      width: '100%',
      height: '100%',

      outline: active ? 'red solid 1px' : 'none',
      outlineOffset: '-1px',
      alignItems: 'flex-start',

      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.87)',
      },

      '&.Mui-focused, &.Mui-focused:hover': {
        borderColor: '#1890ff',
        boxShadow: 'inset 0px 0px 0 1px #1890ff',
      },

      '& textarea': {
        width: '100%',
        height: '100%',
      },
    },

    entityStyles: {
      ...getInputClassStyles(entityStyles),
    },

    groupStyles: {
      ...getInputClassStyles(groupStyles),
    },

    ownStyles: {
      ...getInputClassStyles(ownStyles),
    },

    input: {},
  });

const Textarea: React.FC<TextareaRendererProps> = ({
  id,
  params,
  isDisabled,
  active,
  currentValue,
  sortableId,
  onElementChange,
  className,
  elementRef,
  entityStyles,
  groupStyles,
  ownStyles,
}) => {
  const { placeholder } = params;

  const handleTextareaChange = (event: ChangeEvent<HTMLInputElement>) => {
    onElementChange(id, event.target.value);
  };

  const textFieldClasses = getTextFieldStyles(
    isDisabled,
    entityStyles,
    groupStyles,
    ownStyles,
  )();
  const inputClasses = getInputStyles(
    active,
    entityStyles,
    groupStyles,
    ownStyles,
  )();

  const entityInlineStyles = R.pick(
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    entityStyles,
  );
  const groupInlineStyles = R.pick(
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    groupStyles,
  );
  const ownInlineStyles = R.pick(
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
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
    className: cn(
      isDisabled && styles.disabled,
      inputClasses.root,
      inputClasses.entityStyles,
      inputClasses.groupStyles,
      inputClasses.ownStyles,
    ),
  };

  return (
    <TextField
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      multiline
      rows={4}
      placeholder={placeholder}
      variant="outlined"
      className={cn(
        className,
        isDisabled && styles.disabled,
        textFieldClasses.root,
        textFieldClasses.entityStyles,
        textFieldClasses.groupStyles,
        textFieldClasses.ownStyles,
      )}
      style={inlineStyles}
      InputProps={InputProps}
      value={currentValue}
      onChange={handleTextareaChange}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
};

export { Textarea };
