import React from 'react';
import cn from 'classnames';
import { makeStyles, Paper, MenuList } from '@material-ui/core';

import { sharedClasses } from '$styles/sharedClasses';

import { SelectMenuRendererProps } from '../types';
const styles = require('../styles.scss');

const getStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 1,
  },

  entityStyles: {
    ...entityStyles,
  },

  groupStyles: {
    ...groupStyles,
  },

  ownStyles: {
    ...ownStyles,
  },
});

const SelectMenuComponent = (props: SelectMenuRendererProps) => {
  const {
    id,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    children,
    className,
    elementRef,
  } = props;

  const handlePaperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement).focus();
  };

  const classes = getStyles(entityStyles, groupStyles, ownStyles)();

  return isDisabled ? (
    <div style={{ position: 'relative' }}>
      <Paper
        ref={elementRef}
        id={id}
        data-ls-id={id}
        tabIndex={0}
        key={id}
        className={cn(
          className,
          sharedClasses.unsortable,
          styles.addedElem,
          classes.root,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        elevation={8}
        onClick={handlePaperClick}
      >
        <MenuList>{children}</MenuList>
      </Paper>
    </div>
  ) : <>{children}</>;
};

export { SelectMenuComponent as SelectMenu };
