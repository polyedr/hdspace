// @ts-nocheck

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ImageRendererProps } from '../types';

const styles = require('../styles.scss');

const Image: React.FC<ImageRendererProps> = ({
  id,
  params,
  sortableId,
  entityStyles,
  groupStyles,
  ownStyles,
  isDisabled,
  className,
  elementRef,
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
    <img
      ref={elementRef}
      src={params.imageURL}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedElem,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      alt={id}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
};

export default Image;
