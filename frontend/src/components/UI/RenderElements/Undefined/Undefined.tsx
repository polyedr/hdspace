import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { SharedRendererProps } from '../types';
const styles = require('../styles.scss');

const Undefined = (props: SharedRendererProps) => {
  const {
    id,
    entityStyles,
    groupStyles,
    ownStyles,
    sortableId,
    isDisabled,
    className,
    elementRef,
    children,
  } = props;

  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
  })();

  return (
    <div
      ref={elementRef}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedContainer,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </div>
  );
}

export { Undefined };
