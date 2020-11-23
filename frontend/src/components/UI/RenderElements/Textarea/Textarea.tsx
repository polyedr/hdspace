// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';
import * as R from 'ramda';
import { TextareaRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

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
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      width: '100%',
      height: '100%',

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

const Textarea: React.FC<TextareaRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      params,
      isDisabled,
      currentValue,
      className,
      entityStyles,
      groupStyles,
      ownStyles,
    } = props;
    const { placeholder } = params;

    const eventHandlers = useEventHandlers(props);

    const textFieldClasses = getTextFieldStyles(
      isDisabled,
      entityStyles,
      groupStyles,
      ownStyles,
    )();
    const inputClasses = getInputStyles(entityStyles, groupStyles, ownStyles)();

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
        ref={ref}
        id={id}
        data-ls-id={id}
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
        {...eventHandlers}
      />
    );
  },
);

export default Textarea;
