/* eslint-disable camelcase */

import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MAX_MAP_ZOOM,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  MIN_MAP_ZOOM,
} from '@Constants/defaultParams';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { getPermissibleValue } from '@Utils/NumberHelper';
import { MapElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';

const useStyles = makeStyles({
  text: {
    width: 100,
  },
  zoom: {
    width: 50,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const MapProps: React.FC<PropertiesChangeProps<MapElement>> = ({
  updateParams,
}) => {
  const classes = useStyles();
  const mapProps = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).map_props,
  );

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
          lng: mapProps.center.lng,
        };
      } else {
        newCenter = {
          lat: mapProps.center.lat,
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
        ...mapProps,
        center: newCenter,
      };

      updateParams({ map_props: newMapProps });
    },
    [mapProps, updateParams],
  );

  const handleMarkerTextChange = useCallback(
    ({ target: { value } }) => {
      if (value.length > 5) {
        return;
      }

      const newMapProps = {
        ...mapProps,
        markerText: value,
      };

      updateParams({ map_props: newMapProps });
    },
    [mapProps, updateParams],
  );

  const handleMapZoomChange = useCallback(
    ({ target: { value } }) => {
      const newMapProps = {
        ...mapProps,
        zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
      };

      updateParams({ map_props: newMapProps });
    },
    [mapProps, updateParams],
  );

  return (
    <div>
      <div className={classes.wrapper}>
        <TextField
          label="Latitude"
          type="number"
          value={mapProps.center.lat}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Longitude"
          type="number"
          value={mapProps.center.lng}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Zoom"
          type="number"
          value={mapProps.zoom}
          onChange={handleMapZoomChange}
          margin="dense"
          className={classes.zoom}
        />
      </div>

      <TextField
        label="Marker Text"
        value={mapProps.markerText}
        onChange={handleMarkerTextChange}
        fullWidth
        margin="dense"
      />
    </div>
  );
};

export default withConfigurableProperties(MapProps);
