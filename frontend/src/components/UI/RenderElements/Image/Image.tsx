import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ImageRendererProps } from '../types';
const styles = require('../styles.scss');

const Image = (props: ImageRendererProps) => {
  const {
    id,
    params,
    sortableId,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    className,
    elementRef,
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
}

export { Image };