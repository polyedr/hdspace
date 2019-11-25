import React from 'react';
import GoogleMapReact from 'google-map-react';

import { IMapProps } from '$redux/project/reducer';
import { DEFAULT_MAP_PROPS } from '$constants/defaultParams';

const styles = require('./styles.scss');

interface IMarkerProps {
  text: string,
  lat: number,
  lng: number,
}

const Marker: React.FunctionComponent<IMarkerProps> = ({ text }) => {
  return (
    <div className={styles.mapMarker}>
      <p>
        {text}
      </p>
    </div>
  );
};

export const GMap: React.FunctionComponent<IMapProps> = ({
  center,
  zoom,
  markerText,
}) => (
  <GoogleMapReact
    defaultCenter={DEFAULT_MAP_PROPS.center}
    defaultZoom={DEFAULT_MAP_PROPS.zoom}
    center={center}
    zoom={zoom}
    yesIWantToUseGoogleMapApiInternals
  >
    <Marker
      lat={center.lat}
      lng={center.lng}
      text={markerText || ''}
    />
  </GoogleMapReact>
);
