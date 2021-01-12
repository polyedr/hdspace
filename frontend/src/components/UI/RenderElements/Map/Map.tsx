// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MapRendererProps } from '../types';
import GMap from '../../GMap';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const Map: React.FC<MapRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className, entityClass, groupClass } = props;
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
        entityClass,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
      {...eventHandlers}
    >
      <GMap
        center={params.map_props.center}
        zoom={params.map_props.zoom}
        markerText={params.map_props.markerText}
        apiKey={params.map_props.apiKey}
      />
    </div>
  );
});

export default Map;
