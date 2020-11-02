/* eslint-disable camelcase */

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
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

// const ZOOM_STEP = 0.5;

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
  const classes = useStyles();

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
    <div>
      <div className={classes.wrapper}>
        <TextField
          label="Latitude"
          type="number"
          value={map_props.center.lat}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Longitude"
          type="number"
          value={map_props.center.lng}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
        />

        <TextField
          label="Zoom"
          type="number"
          value={map_props.zoom}
          onChange={handleMapZoomChange}
          margin="dense"
          className={classes.zoom}
        />
      </div>

      <TextField
        label="Marker Text"
        value={map_props.markerText}
        onChange={handleMarkerTextChange}
        fullWidth
        margin="dense"
      />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(MapProps));
