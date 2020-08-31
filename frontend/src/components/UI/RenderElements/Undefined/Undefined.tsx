/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { SharedRendererProps } from '../types';

const styles = require('../styles.scss');

const Undefined: React.FC<SharedRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  sortableId,
  isDisabled,
  className,
  elementRef,
  children,
}) => {
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
};

export default Undefined;
