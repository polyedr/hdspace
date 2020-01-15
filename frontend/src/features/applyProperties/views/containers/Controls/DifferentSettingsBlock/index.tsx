import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors, T as ProjectT } from '$redux/project/';
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
import { IMapProps } from '$redux/project/types';
import { getPermissibleValue } from '$utils/NumberHelper';
import { withParamsChangeHandler, ParamsChangeHandler } from '$utils/withParamsChangeHandler';

const styles = require('./styles.scss');

const ZOOM_STEP = 0.5;

type StateProps = {
  activeItemID: string;
  activeItemType: string;
  map_props: ProjectT.IScreenProps['map_props'];
  dynamic_placeholder: ProjectT.IScreenProps['dynamic_placeholder'];
  placeholder: ProjectT.IScreenProps['placeholder'];
  content: ProjectT.IScreenProps['content'];
}

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;
  const activeItem = selectors.selectActiveItem(state);

  return {
    activeItemID: activeItem.itemId,
    activeItemType: activeItem.itemType,
    map_props: activeItemParams.map_props,
    dynamic_placeholder: activeItemParams.dynamic_placeholder,
    placeholder: activeItemParams.placeholder,
    content: activeItemParams.content,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
};

type Props = StateProps & typeof mapDispatch & ParamsChangeHandler;

const Component: React.FC<Props> = ({
  map_props,
  dynamic_placeholder,
  placeholder,
  activeItemType,
  content,
  updateParams,
}) => {
  const handlePlaceholderChange = useCallback(({ target: { value } }) => {
    updateParams({ dynamic_placeholder: value });
  }, [updateParams]);

  const handleTextContentChange = useCallback(({ target: { value } }) => {
    updateParams({ content: value });
  }, [updateParams]);

  const handleCenterMapCoordsChange = useCallback(({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!map_props) return;

    let newCenter;

    if (name === 'center_lat') {
      newCenter = {
        lat: Number(getPermissibleValue(Number(value), MIN_LATITUDE, MAX_LATITUDE).toFixed(5)),
        lng: map_props.center.lng,
      };
    } else {
      newCenter = {
        lat: map_props?.center.lat,
        lng: Number(getPermissibleValue(Number(value), MIN_LONGITUDE, MAX_LONGITUDE).toFixed(5)),
      };
    }

    const newMapProps = {
      ...map_props,
      center: newCenter,
    };

    updateParams({ map_props: newMapProps });
  }, [map_props, updateParams]);

  const handleMarkerTextChange = useCallback(({ target: { value } }) => {
    if (value.length > 5) {
      return;
    }

    const newMapProps = {
      ...map_props,
      markerText: value,
    };

    updateParams({ map_props: newMapProps as IMapProps }); // TODO: fix typings
  }, [map_props, updateParams]);

  const handleMapZoomChange = useCallback(({ target: { value } }) => {
    const newMapProps = {
      ...map_props,
      zoom: getPermissibleValue(Number(value), MIN_MAP_ZOOM, MAX_MAP_ZOOM),
    };

    updateParams({ map_props: newMapProps as IMapProps });
  }, [map_props, updateParams]);

  return (
    <div className="propsElementsBlock">
      {activeItemType === elementTypes.input && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Placeholder</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <input
                className={styles.labelField}
                id="placeholder_setting_input"
                type="text"
                placeholder={DEFAULT_PLACEHOLDER}
                value={dynamic_placeholder || placeholder}
                onChange={handlePlaceholderChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {(activeItemType === elementTypes.text || activeItemType === elementTypes.button) && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Text content</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <textarea
                className={styles.textContentField}
                name="text_content"
                value={content || activeItemType || ''}
                onChange={handleTextContentChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
      {(activeItemType === elementTypes.map) && (
        <React.Fragment>
          <p className="propsElementsBlockTitle">Map props</p>
          <div className="propsElementsContentBlock">
            <div className="propsElementsInnerBlock">
              <input
                className={styles.mapPropsField}
                type="number"
                id="map_center_lat"
                name="center_lat"
                value={(map_props?.center.lat) || DEFAULT_MAP_PROPS.center.lat}
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
                value={(map_props?.center.lng) || DEFAULT_MAP_PROPS.center.lng}
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
                value={(map_props?.zoom) || DEFAULT_MAP_PROPS.zoom}
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
                value={(map_props?.markerText) || DEFAULT_MAP_PROPS.markerText}
                onChange={handleMarkerTextChange}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const DifferentSettingsBlock = connect(mapState, mapDispatch)(withParamsChangeHandler(Component));
export { DifferentSettingsBlock };
