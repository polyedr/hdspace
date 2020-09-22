/* eslint-disable camelcase */

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MAX_MAP_ZOOM,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  MIN_MAP_ZOOM,
} from '../../../../../../constants/defaultParams';
import { MapElement, MapProps as MapParams } from '../../../../../../api/types';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { getPermissibleValue } from '../../../../../../utils/NumberHelper';

const styles = require('./MapProps.scss');

const ZOOM_STEP = 0.5;

type StateProps = {
  map_props: MapParams['map_props'];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    map_props: activeItemParams.map_props,
  };
}

type Props = StateProps & PropertiesChangeProps<MapElement>;

const MapProps: React.FC<Props> = ({ map_props, updateParams }) => {
  const handleCenterMapCoordsChange = useCallback(
    ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
      let newCenter;

      if (name === 'center_lat') {
        newCenter = {
          lat: Number(
            getPermissibleValue(
              Number(value),
              MIN_LATITUDE,
              MAX_LATITUDE,
            ).toFixed(5),
          ),
          lng: map_props.center.lng,
        };
      } else {
        newCenter = {
          lat: map_props.center.lat,
          lng: Number(
            getPermissibleValue(
              Number(value),
              MIN_LONGITUDE,
              MAX_LONGITUDE,
            ).toFixed(5),
          ),
        };
      }

      const newMapProps = {
        ...map_props,
        center: newCenter,
      };

      updateParams({ map_props: newMapProps });
    },
    [map_props, updateParams],
  );

  const handleMarkerTextChange = useCallback(
    ({ target: { value } }) => {
      if (value.length > 5) {
        return;
      }

      const newMapProps = {
        ...map_props,
        markerText: value,
      };

      updateParams({ map_props: newMapProps });
    },
    [map_props, updateParams],
  );

  const handleMapZoomChange = useCallback(
    ({ target: { value } }) => {
      const newMapProps = {
        ...map_props,
        zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
      };

      updateParams({ map_props: newMapProps });
    },
    [map_props, updateParams],
  );

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Map props</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <input
            className={styles.mapPropsField}
            type="number"
            id="map_center_lat"
            name="center_lat"
            value={map_props.center.lat}
            min={MIN_LATITUDE}
            max={MAX_LATITUDE}
            step={ZOOM_STEP}
            onChange={handleCenterMapCoordsChange}
          />
          <input
            className={styles.mapPropsField}
            type="number"
            id="map_center_lng"
            name="center_lng"
            value={map_props.center.lng}
            min={MIN_LONGITUDE}
            max={MAX_LONGITUDE}
            step={ZOOM_STEP}
            onChange={handleCenterMapCoordsChange}
          />
          <input
            className={styles.mapPropsField}
            type="number"
            id="map_zoom"
            name="zoom"
            value={map_props.zoom}
            min={MIN_MAP_ZOOM}
            max={MAX_MAP_ZOOM}
            onChange={handleMapZoomChange}
          />
        </div>
        <div className="propsElementsInnerBlock">
          <input
            className={styles.mapPropsTextField}
            type="text"
            name="markerText"
            id="map_markerText"
            value={map_props.markerText}
            onChange={handleMarkerTextChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(MapProps));
