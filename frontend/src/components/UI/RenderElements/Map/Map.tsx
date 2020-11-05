// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MapRendererProps } from '../types';
import GMap from '../../GMap';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const Map: React.FC<MapRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className } = props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        className,
        isDisabled && classes.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      {...eventHandlers}
    >
      <GMap
        center={params.map_props.center}
        zoom={params.map_props.zoom}
        markerText={params.map_props.markerText}
      />
    </div>
  );
});

export default Map;
