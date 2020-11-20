/* eslint-disable camelcase */

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDebounce } from 'use-debounce';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MAX_MAP_ZOOM,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  MIN_MAP_ZOOM,
} from '../../../../../constants/defaultParams';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { getPermissibleValue } from '../../../../../utils/NumberHelper';
import { MapElement, PropertiesChangeProps } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

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

  const [state, setState] = useState(mapProps);
  const [debouncedState] = useDebounce(state, 500);

  useEffect(() => {
    updateParams({ map_props: debouncedState });
  }, [debouncedState, updateParams]);

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
          lng: state.center.lng,
        };
      } else {
        newCenter = {
          lat: state.center.lat,
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
        ...state,
        center: newCenter,
      };

      setState(newMapProps);
    },
    [state],
  );

  const handleMarkerTextChange = useCallback(
    ({ target: { value } }) => {
      if (value.length > 5) {
        return;
      }

      const newMapProps = {
        ...state,
        markerText: value,
      };

      setState(newMapProps);
    },
    [state],
  );

  const handleMapZoomChange = useCallback(
    ({ target: { value } }) => {
      const newMapProps = {
        ...state,
        zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
      };

      setState(newMapProps);
    },
    [state],
  );

  return (
    <div>
      <div className={classes.wrapper}>
        <TextField
          label="Latitude"
          name="center_lat"
          type="number"
          value={state.center.lat}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Longitude"
          type="number"
          value={state.center.lng}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Zoom"
          type="number"
          value={state.zoom}
          onChange={handleMapZoomChange}
          margin="dense"
          className={classes.zoom}
        />
      </div>

      <TextField
        label="Marker Text"
        value={state.markerText}
        onChange={handleMarkerTextChange}
        fullWidth
        margin="dense"
      />
    </div>
  );
};

export default withConfigurableProperties(MapProps);
