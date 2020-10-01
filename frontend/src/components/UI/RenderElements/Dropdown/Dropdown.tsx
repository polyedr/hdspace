// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles, Button } from '@material-ui/core';
import * as R from 'ramda';

import { DropdownRendererProps } from '../types';

const styles = require('../styles.scss');

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

const getDropdownStyles = (
  isDisabled: boolean,
  active: boolean,
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      outline: active ? '1px red solid' : 'none',
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        }),
      },
      '&:active': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        }),
      },
    },

    container: {
      '&.hovered $root': {
        outline: '1px solid #949494',
      },
    },

    entityStyles: {
      ...getDropdownClassStyles(entityStyles),
    },

    groupStyles: {
      ...getDropdownClassStyles(groupStyles),
    },

    ownStyles: {
      ...getDropdownClassStyles(ownStyles),
    },
  });

const getDivClassStyles = (style: React.CSSProperties) => ({
  marginTop: style.marginTop,
  marginRight: style.marginRight,
  marginBottom: style.marginBottom,
  marginLeft: style.marginLeft,
  position: 'relative' as React.CSSProperties['position'],
  display: 'inline-block',
  verticalAlign: 'top',
});

const getDivStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...getDivClassStyles(entityStyles),
    },

    groupStyles: {
      ...getDivClassStyles(groupStyles),
    },

    ownStyles: {
      ...getDivClassStyles(ownStyles),
    },
  });

const Dropdown: React.FC<DropdownRendererProps> = React.forwardRef(
  (
    {
      id,
      isDisabled,
      active,
      sortableId,
      params,
      children,
      className,
      entityStyles,
      groupStyles,
      ownStyles,
    },
    ref,
  ) => {
    const { textContent, showRipple, isOpen } = params;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      setAnchorEl(event.currentTarget);
    };

    const dropdownClasses = getDropdownStyles(
      isDisabled,
      active,
      entityStyles,
      groupStyles,
      ownStyles,
    )();
    const divClasses = getDivStyles(entityStyles, groupStyles, ownStyles)();

    const [Children] = React.Children.toArray(children);

    return isDisabled ? (
      <>
        <div
          key={id}
          className={cn(
            className,
            dropdownClasses.container,
            divClasses.entityStyles,
            divClasses.groupStyles,
            divClasses.ownStyles,
          )}
        >
          <Button
            ref={ref}
            id={id}
            data-ls-id={id}
            data-id={sortableId}
            aria-controls="simple-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            className={cn(
              dropdownClasses.root,
              styles.disabled,
              dropdownClasses.entityStyles,
              dropdownClasses.groupStyles,
              dropdownClasses.ownStyles,
            )}
            disableRipple
          >
            {textContent}
          </Button>
          {isOpen && React.cloneElement(Children, { anchorEl, setAnchorEl })}
        </div>
      </>
    ) : (
      <div
        className={cn(
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
      >
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuButtonClick}
          id={id}
          key={id}
          variant="contained"
          color="primary"
          className={cn(
            dropdownClasses.root,
            dropdownClasses.entityStyles,
            dropdownClasses.groupStyles,
            dropdownClasses.ownStyles,
          )}
          disableRipple={!showRipple}
        >
          {textContent}
        </Button>
        {React.cloneElement(Children, { anchorEl, setAnchorEl })}
      </div>
    );
  },
);

export default Dropdown;
