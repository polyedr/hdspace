// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MapRendererProps } from '../types';
import GMap from '../../Widgets/GMap';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('map');

const Map: React.FC<MapRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className, groupClass } = props;
  const { center, zoom, markerText, apiKey } = params.map_props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      data-zoom={zoom}
      data-center={JSON.stringify(center)}
      data-marker={markerText}
      className={cn(
        'google-map',
        className,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
      {...eventHandlers}
    >
      <GMap
        center={center}
        zoom={zoom}
        markerText={markerText}
        apiKey={apiKey}
      />
    </div>
  );
});

export default Map;
