// @ts-nocheck

import React, { useState } from 'react';
import cn from 'classnames';
import { makeStyles, Button } from '@material-ui/core';
import * as R from 'ramda';
import { DropdownRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

export const DropdownContext = React.createContext();

const useDivStyles = makeStyles(() => {
  const getDivClassStyles = (style: React.CSSProperties) => ({
    marginTop: style.marginTop,
    marginRight: style.marginRight,
    marginBottom: style.marginBottom,
    marginLeft: style.marginLeft,
    position: 'relative' as React.CSSProperties['position'],
    display: 'inline-block',
    verticalAlign: 'top',
  });
  return {
    entityStyles: ({ entityStyles }) => getDivClassStyles(entityStyles),
    groupStyles: ({ groupStyles }) => getDivClassStyles(groupStyles),
    ownStyles: ({ ownStyles }) => getDivClassStyles(ownStyles),
  };
});

const useMainStyles = makeComponentStyles({
  root: ({ isDisabled }) => ({
    cursor: isDisabled ? 'default' : 'pointer',
    ...(isDisabled && { transition: 'none' }),
    '&:hover,&active': {
      ...(isDisabled && {
        boxShadow:
          '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      }),
    },
  }),
});

const useDropdownStyles = makeStyles(() => {
  const getDropdownClassStyles = (style: React.CSSProperties) => {
    const dropdownStyles = R.omit(
      ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
      style,
    );

    return {
      ...dropdownStyles,
      backgroundColor: dropdownStyles.backgroundColor,
      color: dropdownStyles.color,
      '&:hover': {
        backgroundColor: dropdownStyles.backgroundColor,
        color: dropdownStyles.color,
      },

      '&:active': {
        color: dropdownStyles.color,
      },
    };
  };

  return {
    entityStyles: ({ entityStyles }) => getDropdownClassStyles(entityStyles),
    groupStyles: ({ groupStyles }) => getDropdownClassStyles(groupStyles),
    ownStyles: ({ ownStyles }) => getDropdownClassStyles(ownStyles),
  };
});

const Dropdown: React.FC<DropdownRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, params, children, className } = props;
    const { textContent, showRipple, isOpen } = params;

    const eventHandlers = useEventHandlers(props);

    const divClasses = useDivStyles(props);
    const mainClasses = useMainStyles(props);
    const dropdownClasses = useDropdownStyles(props);
    const [open, setOpen] = useState<boolean>(false);

    const handleMenuButtonClick = () => {
      if (!isDisabled) {
        setOpen(!open);
      }
    };

    return (
      <div
        key={id}
        className={cn(
          ...(isDisabled ? [className] : []),
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        ref={ref}
        {...eventHandlers}
      >
        <Button
          id={id}
          data-ls-id={id}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleMenuButtonClick}
          className={cn(
            ...(isDisabled ? [mainClasses.root, mainClasses.disabled] : []),
            dropdownClasses.entityStyles,
            dropdownClasses.groupStyles,
            dropdownClasses.ownStyles,
          )}
          disableRipple={!showRipple}
        >
          {textContent}
        </Button>
        <DropdownContext.Provider
          value={{
            anchorRef: ref,
            open: (isDisabled && isOpen) || open,
            setOpen,
          }}
        >
          {children}
        </DropdownContext.Provider>
      </div>
    );
  },
);

export default Dropdown;
