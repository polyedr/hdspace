import React from 'react';
import GoogleMapReact from 'google-map-react';

import { IMapProps } from '$redux/project/types';

const styles = require('./styles.scss');

interface IMarkerProps {
  text: string;
  lat: number;
  lng: number;
}

const Marker: React.FunctionComponent<IMarkerProps> = ({ text }) => {
  return (
    <div className={styles.mapMarker}>
      <p>{text}</p>
    </div>
  );
};

export const GMap: React.FunctionComponent<IMapProps> = ({
  center,
  zoom,
  markerText,
}) => (
  <GoogleMapReact
    center={center}
    zoom={zoom}
    yesIWantToUseGoogleMapApiInternals
  >
    <Marker lat={center.lat} lng={center.lng} text={markerText || ''} />
  </GoogleMapReact>
);
