import React from 'react';
import GoogleMapReact from 'google-map-react';
import { IMapProps } from '../../../types';

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

const GMap: React.FC<IMapProps> = ({ center, zoom, markerText }) => (
  <GoogleMapReact
    center={center}
    zoom={zoom}
    yesIWantToUseGoogleMapApiInternals
  >
    <Marker lat={center?.lat} lng={center?.lng} text={markerText || ''} />
  </GoogleMapReact>
);

export default GMap;
