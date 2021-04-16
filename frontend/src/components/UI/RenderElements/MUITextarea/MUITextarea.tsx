import React from 'react';
import cn from 'classnames';
import { makeStyles, TextField } from '@material-ui/core';
import * as R from 'ramda';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

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

const MUITextarea = React.forwardRef<HTMLTextAreaElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { placeholder, textContent } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const eventHandlers = useEventHandlers(props);

    const textFieldClasses = getTextFieldStyles(
      isDisabled || false,
      element.styles.ownStyles,
    )();
    const inputClasses = getInputStyles(element.styles.ownStyles)();

    const ownInlineStyles = R.pick(
      ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
      element.styles.ownStyles,
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
        id={element.id}
        data-ls-id={element.id}
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
        defaultValue={textContent}
        {...eventHandlers}
      />
    );
  },
);

export default MUITextarea;
