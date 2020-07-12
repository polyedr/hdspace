import React from 'react';
import cn from 'classnames';
import { makeStyles, Button } from '@material-ui/core';

import { DropdownRendererProps } from '../types';
const styles = require('../styles.scss');

const DropdownComponent = (props: DropdownRendererProps) => {
  const { id, style, isDisabled, active, sortableId, params, children, elementRef, className } = props;
  const { backgroundColor, color, ...restStyles } = style;
  const { marginTop, marginRight, marginBottom, marginLeft, ...editableRestStyles } = restStyles;
  const { textContent, showRipple, isOpen } = params;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const classes = makeStyles({
    container: {
      '&.hovered $root': {
        outline: '1px solid #949494',
      },
    },
    root: {
      cursor: isDisabled ? 'default' : 'pointer',
      ...editableRestStyles,
      backgroundColor,
      color,
      outline: active ? '1px red solid' : 'none',
      ...(isDisabled && { transition: 'none' }),
      '&:hover': {
        backgroundColor,
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
      '&:active': {
        color,
        ...(isDisabled && { boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }),
      },
    },
  })();

  const [Children] = React.Children.toArray(children);

  return isDisabled ? (
    <>
      <div
        key={id}
        style={{
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          display: 'inline-block',
          verticalAlign: 'top',
        }}
        className={cn(className, classes.container)}
      >
        <Button
          ref={elementRef}
          id={id}
          data-ls-id={id}
          data-id={sortableId}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          className={cn(classes.root, styles.disabled)}
          disableRipple
        >
          {textContent}
        </Button>
        {isOpen && React.cloneElement(Children, { anchorEl, setAnchorEl })}
      </div>
    </>
  ) : (
    <div
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
      }}
    >
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuButtonClick}
        id={id}
        key={id}
        variant="contained"
        color="primary"
        className={classes.root}
        disableRipple={!showRipple}
      >
        {textContent}
      </Button>
      {React.cloneElement(Children, { anchorEl, setAnchorEl })}
    </div>
  );
};

export { DropdownComponent as Dropdown };
