import React, { useState, useCallback, } from 'react';
import * as R from 'ramda';
import classNames from 'classnames';

import { IActiveItem } from '$components/Editor/EditorWindow/';
import {
  LIST_SCENARIO_TYPE,
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MAX_BORDER_WIDTH,
  MIN_BORDER_RADIUS,
  MIN_BORDER_WIDTH,
  DEFAULT_BORDER,
} from '$constants/defaultParams';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { strToNumber, getPermissibleValue, safeParseFloat, safeMatch } from '$utils/NumberHelper';
import { validBorderRadius, IStylesElement } from '$utils/StyleHelper';
import { ColorPicker } from '$components/UI/ColorPicker/';

const styles = require('./styles.scss');

const accessBorderRadius = (styleItem: IStylesElement) => {
  const matchedValue = safeMatch(styleItem['border-radius']);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

interface IComponentProps {
  activeItem: IActiveItem,
  styleItem: IPanelEditProps['styleItem'],
  updateElementStyles: IPanelEditProps['updateElementStyles'],
  updateScenarioStyles: IPanelEditProps['updateScenarioStyles'],
}

export const BorderBlock: React.FunctionComponent<IComponentProps> = React.memo(({
  styleItem,
  activeItem,
  updateElementStyles,
  updateScenarioStyles,
}) => {
  const [isBorderColorPickerOpen, setIsBorderColorPickerOpen] = useState<boolean>(false);
  const handleActiveColorPicker = useCallback(() => {
    setIsBorderColorPickerOpen(!isBorderColorPickerOpen);
  }, [isBorderColorPickerOpen]);

  const handleBorder = useCallback(({ target: { value } }) => {
    const newWidth = getPermissibleValue(strToNumber(value), MIN_BORDER_WIDTH, MAX_BORDER_WIDTH);
    const newBorder = {
      ...styleItem,
      'border-width': `${newWidth}px`,
      'border-style': R.path(['border-style'], styleItem) || DEFAULT_BORDER['border-style'],
      'border-color': R.path(['border-color'], styleItem) || DEFAULT_BORDER['border-color'],
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newBorder);
    } else {
      updateElementStyles(activeItem.itemId, newBorder);
    }
  }, [activeItem, updateElementStyles, updateScenarioStyles, styleItem]);

  const handleBorderRadius = useCallback(({ target: { value } }) => {
    const newBorder = {
      ...styleItem,
      'border-radius': `${value}${accessBorderRadius(styleItem)}`,
      'border-width': R.path(['border-width'], styleItem) || '1px',
      'border-style': R.path(['border-style'], styleItem) || DEFAULT_BORDER['border-style'],
      'border-color': R.path(['border-color'], styleItem) || DEFAULT_BORDER['border-color'],
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newBorder);
    } else {
      updateElementStyles(activeItem.itemId, newBorder);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeBorderRadiusUnits = useCallback(({ target: { value } }) => {
    const newBorder = {
      ...styleItem,
      'border-radius': validBorderRadius(`${(styleItem['border-radius'] && parseFloat(styleItem['border-radius'])) || 1}${value}`),
      'border-width': R.path(['border-width'], styleItem) || '1px',
      'border-style': R.path(['border-style'], styleItem) || DEFAULT_BORDER['border-style'],
      'border-color': R.path(['border-color'], styleItem) || DEFAULT_BORDER['border-color'],
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newBorder);
    } else {
      updateElementStyles(activeItem.itemId, newBorder);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeColor = useCallback((newColor) => {
    if (newColor.length > 7) {
      return;
    }

    const newBorder = {
      ...styleItem,
      'border-color': newColor,
      'border-width': R.path(['border-width'], styleItem) || '1px',
      'border-style': R.path(['border-style'], styleItem) || DEFAULT_BORDER['border-style'],
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newBorder);
    } else {
      updateElementStyles(activeItem.itemId, newBorder);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  const handleChangeOpacity = useCallback(() => {
    console.log();
  }, []);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Border</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={classNames(styles.borderBlock, styles.borderBlock_width)}>
            <input
              className={styles.borderWidthField}
              name="width"
              type="number"
              value={safeParseFloat(styleItem['border-width']) || parseFloat(DEFAULT_BORDER['border-width'])}
              onChange={handleBorder}
              min={MIN_BORDER_WIDTH}
              max={MAX_BORDER_WIDTH}
            />
          </div>
          <div className={classNames(styles.borderBlock, styles.borderBlock_radius)}>
            <input
              className={styles.borderRadiusField}
              name="radius"
              type="number"
              value={
                safeParseFloat(validBorderRadius(styleItem['border-radius']))
                || parseFloat(DEFAULT_BORDER['border-radius'])
              }
              onChange={handleBorderRadius}
              min={MIN_BORDER_RADIUS}
              max={styleItem['border-radius'] && styleItem['border-radius'].indexOf('px') !== -1 ? MAX_BORDER_RADIUS : MAX_BORDER_RADIUS_PERCENT || 100}
            />
            <select
              className="dropDown"
              name="radius_units"
              onChange={handleChangeBorderRadiusUnits}
              value={accessBorderRadius(styleItem)}
            >
              <option value="px">px</option>
              <option value="%">percent</option>
            </select>
          </div>
        </div>
        <div className="propsElementsInnerBlock">
          <ColorPicker
            display={isBorderColorPickerOpen}
            color={styleItem['border-color'] || DEFAULT_BORDER['border-color']}
            onChangeComplete={color => handleChangeColor(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={styleItem['border-color'] || DEFAULT_BORDER['border-color']}
            onChange={({ target: { value } }) => handleChangeColor(value)}
          />
          <input
            className="colorField"
            type="text"
            value={1}
            onChange={handleChangeOpacity}
          />
        </div>
      </div>
    </div>
  );
});
