import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MAX_MAP_ZOOM,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  MIN_MAP_ZOOM,
} from '@Constants/defaultParams';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { getPermissibleValue } from '@Utils/NumberHelper';
import { MapElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';

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
  canEdit,
}) => {
  const classes = useStyles();
  const mapProps = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).map_props,
  );

  const [state, setState] = useState(mapProps);
  useEffect(() => {
    setState(mapProps);
  }, [mapProps]);
  const debounced = useDebouncedCallback((value) => {
    updateParams({
      map_props: value,
    });
  }, 500);

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

      setState(newMapProps);
      debounced.callback(newMapProps);
    },
    [mapProps, debounced],
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

      setState(newMapProps);
      debounced.callback(newMapProps);
    },
    [mapProps, debounced],
  );

  const handleMapZoomChange = useCallback(
    ({ target: { value } }) => {
      const newMapProps = {
        ...mapProps,
        zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
      };

      setState(newMapProps);
      debounced.callback(newMapProps);
    },
    [mapProps, debounced],
  );

  const handleMapApiKeyChange = useCallback(
    ({ target: { value } }) => {
      const newMapProps = {
        ...mapProps,
        apiKey: value,
      };
      setState(newMapProps);
      debounced.callback(newMapProps);
    },
    [mapProps, debounced],
  );

  if (!mapProps) {
    return null;
  }

  return (
    <div>
      <div className={classes.wrapper}>
        <StyledTextField
          label="Latitude"
          name="center_lat"
          type="number"
          value={state.center.lat}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
          disabled={!canEdit}
        />

        <StyledTextField
          label="Longitude"
          type="number"
          value={state.center.lng}
          onChange={handleCenterMapCoordsChange}
          margin="dense"
          className={classes.text}
          disabled={!canEdit}
        />

        <StyledTextField
          label="Zoom"
          type="number"
          value={state.zoom}
          onChange={handleMapZoomChange}
          margin="dense"
          className={classes.zoom}
          disabled={!canEdit}
        />
      </div>

      <StyledTextField
        label="Marker Text"
        value={state.markerText}
        onChange={handleMarkerTextChange}
        fullWidth
        margin="dense"
        disabled={!canEdit}
      />

      <StyledTextField
        label="API Key"
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              title="Insert an API key and reload the page"
            >
              <HelpOutlineIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        value={state.apiKey || ''}
        onChange={handleMapApiKeyChange}
        fullWidth
        margin="dense"
        disabled={!canEdit}
      />
    </div>
  );
};

export default MapProps;
