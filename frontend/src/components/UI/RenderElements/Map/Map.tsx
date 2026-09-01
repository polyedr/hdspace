import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import GMap from '../../Widgets/GMap';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('map');

const Map = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { center, zoom, markerText, apiKey } = element.parameters.map_props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={element.id}
      data-ls-id={element.id}
      data-zoom={zoom}
      data-center={JSON.stringify(center)}
      data-marker={markerText}
      className={cn(
        'google-map',
        className,
        groupClass,
        isDisabled ? classes.disabled : classes.ownPseudoStyles,
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
