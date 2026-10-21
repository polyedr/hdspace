/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import GoogleMapReact from 'google-map-react';
import { IMapProps } from '@Src/types';

import styles from './styles.module.scss?inline';

interface IMarkerProps {
  text: string;
  lat: number;
  lng: number;
}

const Marker: React.FC<IMarkerProps> = ({ text }) => (
  <div className={styles.mapMarker}>
    <p>{text}</p>
  </div>
);

const MapComponent = GoogleMapReact as any;

function GMap({ center, zoom, markerText, apiKey }: IMapProps) {
  return (
    <MapComponent
      center={center}
      zoom={zoom}
      bootstrapURLKeys={{ key: apiKey }}
      yesIWantToUseGoogleMapApiInternals
    >
      {/* google-map-react Marker child typing is incomplete */}
      <Marker
        lat={center?.lat as any}
        lng={center?.lng as any}
        text={markerText || ''}
      />
    </MapComponent>
  );
}

export default GMap;
