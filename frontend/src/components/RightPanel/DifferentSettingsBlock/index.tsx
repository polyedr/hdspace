import React, { useCallback } from 'react';

import * as Actions from '$redux/project/actions';
import { T as ProjectT } from '$redux/project';
import { elementTypes } from '$constants/menu';
import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_MAP_PROPS,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
  MIN_MAP_ZOOM,
  MAX_MAP_ZOOM,
} from '$constants/defaultParams';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { IMapProps } from '$redux/project/types';
import { getPermissibleValue } from '$utils/NumberHelper';

const styles = require('./styles.scss');

const ZOOM_STEP = 0.5;

interface IComponentProps {
  params: IPanelEditProps['params'],
  activeItem: ProjectT.ActiveItem,
  itemType: string,
  updateElementParameters: typeof Actions.updateElementParameters,
}

const Component: React.FunctionComponent<IComponentProps> = ({
  params,
  activeItem,
  itemType,
  updateElementParameters,
}) => {
  const handlePlaceholderChange = useCallback(({ target: { value } }) => {
    updateElementParameters(activeItem.itemId, { dynamic_placeholder: value });
  }, [activeItem.itemId, updateElementParameters]);

  const handleTextContentChange = useCallback(({ target: { value } }) => {
    updateElementParameters(activeItem.itemId, { content: value });
  }, [activeItem.itemId, updateElementParameters]);

  const handleCenterMapCoordsChange = useCallback(({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!params.map_props) return;

    let newCenter;

    if (name === 'center_lat') {
      newCenter = {
        lat: Number(getPermissibleValue(Number(value), MIN_LATITUDE, MAX_LATITUDE).toFixed(5)),
        lng: params.map_props.center.lng,
      };
    } else {
      newCenter = {
        lat: params.map_props?.center.lat,
        lng: Number(getPermissibleValue(Number(value), MIN_LONGITUDE, MAX_LONGITUDE).toFixed(5)),
      };
    }

    const newMapProps = {
      ...params.map_props,
      center: newCenter,
    };

    updateElementParameters(activeItem.itemId, { map_props: newMapProps });
  }, [params.map_props, activeItem.itemId, updateElementParameters]);

  const handleMarkerTextChange = useCallback(({ target: { value } }) => {
    if (value.length > 5) {
      return;
    }

    const newMapProps = {
      ...params.map_props,
      markerText: value,
    };

    updateElementParameters(activeItem.itemId, { map_props: newMapProps as IMapProps }); // TODO: fix typings
  }, [params.map_props, activeItem.itemId, updateElementParameters]);

  const handleMapZoomChange = useCallback(({ target: { value } }) => {
    const newMapProps = {
      ...params.map_props,
      zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
    };

    updateElementParameters(activeItem.itemId, { map_props: newMapProps as IMapProps });
  }, [params.map_props, activeItem.itemId, updateElementParameters]);

  return (
    <div className="propsElementsBlock">
      {itemType === elementTypes.input && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Placeholder</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <input
                className={styles.labelField}
                id="placeholder_setting_input"
                type="text"
                placeholder={DEFAULT_PLACEHOLDER}
                value={params.dynamic_placeholder || params.placeholder}
                onChange={handlePlaceholderChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {(itemType === elementTypes.text || itemType === elementTypes.button) && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Text content</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <textarea
                className={styles.textContentField}
                name="text_content"
                value={params.content || activeItem.itemType || ''}
                onChange={handleTextContentChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {(itemType === elementTypes.map) && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Map props</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <input
                className={styles.mapPropsField}
                type="number"
                id="map_center_lat"
                name="center_lat"
                value={(params.map_props && params.map_props.center.lat) || DEFAULT_MAP_PROPS.center.lat}
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
                value={(params.map_props && params.map_props.center.lng) || DEFAULT_MAP_PROPS.center.lng}
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
                value={(params.map_props && params.map_props.zoom) || DEFAULT_MAP_PROPS.zoom}
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
                value={(params.map_props && params.map_props.markerText) || DEFAULT_MAP_PROPS.markerText}
                onChange={handleMarkerTextChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export const DifferentSettingsBlock = React.memo(Component);
