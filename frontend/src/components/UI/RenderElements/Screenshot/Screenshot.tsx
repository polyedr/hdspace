/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ScreenshotRendererProps } from '../types';
import { IMAGES } from '../../../../constants/images';

const styles = require('../styles.scss');

const Screenshot: React.FC<ScreenshotRendererProps> = React.forwardRef(
  ({ id, params, entityStyles, groupStyles, ownStyles, className }, ref) => {
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
            backgroundImage: `url(${params.imageURL})`,
          }
        : {
            ...ownStyles,
            background: `no-repeat #E0E0E0 url(${IMAGES.imageIconSmall});`,
            backgroundPosition: 'center center',
            backgroundSize: 'auto',
          },
    })();

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      />
    );
  },
);

export default Screenshot;
