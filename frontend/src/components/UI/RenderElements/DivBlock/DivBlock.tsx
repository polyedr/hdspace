import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { DivBlockRendererProps } from '../types';
const styles = require('../styles.scss');

export const DivBlockRenderer = (props: DivBlockRendererProps) => {
  const { id, sortableId, tagStyles, ownStyles, isDisabled, children, className, elementRef, isBorderVisible } = props;

  const classes = makeStyles({
    tagStyles,
    ownStyles,
  })();

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem, classes.tagStyles, classes.ownStyles)}
      style={{ ...(isBorderVisible && isDisabled && { outline: 'none' })}}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </div>
  );
}
