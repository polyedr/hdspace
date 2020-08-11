/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { GMap } from '$components/UI/GMap';

import { MapRendererProps } from '../types';

const styles = require('../styles.scss');

const Map: React.FC<MapRendererProps> = ({
  id,
  params,
  isDisabled,
  entityStyles,
  groupStyles,
  ownStyles,
  sortableId,
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
    <div
      ref={elementRef}
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
      tabIndex={isDisabled ? 0 : -1}
    >
      <GMap
        center={params.map_props.center}
        zoom={params.map_props.zoom}
        markerText={params.map_props.markerText}
      />
    </div>
  );
};

export { Map };
