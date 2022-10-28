/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import GoogleMapReact from 'google-map-react';
import { IMapProps } from '@Src/types';

const styles = require('./styles.scss');

interface IMarkerProps {
  text: string;
  lat: number;
  lng: number;
}

const Marker: React.FC<IMarkerProps> = ({ text }) => {
  return (
    <div className={styles.mapMarker}>
      <p>{text}</p>
    </div>
  );
};

const GMap = ({ center, zoom, markerText, apiKey }: IMapProps) => (
  <GoogleMapReact
    center={center}
    zoom={zoom}
    bootstrapURLKeys={{ key: apiKey }}
    yesIWantToUseGoogleMapApiInternals
  >
    <Marker lat={center?.lat} lng={center?.lng} text={markerText || ''} />
  </GoogleMapReact>
);

export default GMap;
