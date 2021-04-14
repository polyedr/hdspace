// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { TextField } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { omit, pick } from 'ramda';
import { TextareaRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const styles = require('../styles.scss');

const getTextFieldClassStyles = (style: React.CSSProperties) => ({
  width: style.width,
  height: style.height,
});

const getTextFieldStyles = (
  isDisabled: boolean,
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

    ownStyles: {
      ...getTextFieldClassStyles(ownStyles),
    },

    input: {},
  });

const getInputClassStyles = (style: React.CSSProperties) => ({
  ...omit(
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

const getInputStyles = (ownStyles: React.CSSProperties) =>
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

    ownStyles: {
      ...getInputClassStyles(ownStyles),
    },

    input: {},
  });

const MUITextarea: React.FC<TextareaRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      params,
      isDisabled,
      currentValue,
      className,
      ownStyles,
      groupClass,
    } = props;
    const { placeholder } = params;

    const eventHandlers = useEventHandlers(props);

    const textFieldClasses = getTextFieldStyles(isDisabled, ownStyles)();
    const inputClasses = getInputStyles(ownStyles)();

    const ownInlineStyles = pick(
      ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
      ownStyles,
    );
    const inlineStyles = {
      ...ownInlineStyles,
      transition: 'none',
    };

    const InputProps = {
      readOnly: isDisabled,
      className: cn(
        isDisabled && styles.disabled,
        inputClasses.root,
        groupClass,
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
          groupClass,
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

export default MUITextarea;
