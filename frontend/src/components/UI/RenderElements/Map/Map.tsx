/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';
import { MapRendererProps } from '../types';
import GMap from '../../GMap';

const styles = require('../styles.scss');

const Map: React.FC<MapRendererProps> = React.forwardRef(
  (
    {
      id,
      params,
      isDisabled,
      entityStyles,
      groupStyles,
      ownStyles,
      sortableId,
      className,
    },
    ref,
  ) => {
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
        ref={ref}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        className={cn(
          className,
          styles.addedWidget,
          isDisabled && styles.disabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        onClick={(event) => isDisabled && event.preventDefault()}
      >
        <GMap
          center={params.map_props.center}
          zoom={params.map_props.zoom}
          markerText={params.map_props.markerText}
        />
      </div>
    );
  },
);

export default Map;
