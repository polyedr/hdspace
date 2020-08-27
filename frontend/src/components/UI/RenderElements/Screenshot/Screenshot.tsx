/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ScreenshotRendererProps } from '../types';
import { IMAGES } from '$constants/images';

const styles = require('../styles.scss');

const Screenshot: React.FC<ScreenshotRendererProps> = ({
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

    ownStyles: params.imageURL
      ? {
          ...ownStyles,
          backgroundImage: `url(${params.imageURL})`, // TODO maybe need move
          // backgroundPosition: 'top left',
          backgroundSize: 'auto',
        }
      : {
          ...ownStyles,
          background: `no-repeat #E0E0E0 url(${IMAGES.imageIconSmall});`,
          backgroundPosition: 'center center',
        },
  })();

  return (
    <div
      ref={elementRef}
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
      tabIndex={isDisabled ? 0 : -1}
    />
  );
};

export { Screenshot };
