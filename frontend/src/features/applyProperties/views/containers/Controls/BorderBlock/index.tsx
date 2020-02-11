import React, { useCallback, } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MAX_BORDER_WIDTH,
  MIN_BORDER_RADIUS,
  MIN_BORDER_WIDTH,
} from '$constants/defaultParams';
import { ColorPicker, useColor, normalizeColor } from '$components/UI/ColorPicker/';
import { strToNumber, getPermissibleValue, safeParseFloat, safeMatch } from '$utils/NumberHelper';
import { validateBorderRadius, CssLikeStyles } from '$utils/StyleHelper';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

const styles = require('./styles.scss');

const accessBorderRadius = (border: CssLikeStyles['border-radius']) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

type StateProps = {
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    borderColor: activeItemStyles['border-color'],
    borderWidth: activeItemStyles['border-width'],
    borderRadius: activeItemStyles['border-radius'],
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FunctionComponent<Props> = React.memo(({
  borderColor,
  borderWidth,
  borderRadius,
  activeItemID,
  updateStyles,
}) => {
  const [currentBorderColor, setCurrentBorderColor] = useColor(borderColor, activeItemID);

  const handleBorderWidthChange = useCallback(({ target: { value } }) => {
    const newWidth = getPermissibleValue(strToNumber(value), MIN_BORDER_WIDTH, MAX_BORDER_WIDTH);

    updateStyles({ 'border-width': `${newWidth}px` });
  }, [updateStyles]);

  const handleBorderRadius = useCallback(({ target: { value } }) => {
    updateStyles({ 'border-radius': `${value}${accessBorderRadius(borderRadius)}` });
  }, [updateStyles]);

  const handleChangeBorderRadiusUnits = useCallback(({ target: { value } }) => {
    updateStyles({ 'border-radius': validateBorderRadius(`${parseFloat(borderRadius)}${value}`) });
  }, [updateStyles]);

  const handleColorChange = useCallback((color) => {
    const newColor = normalizeColor(color);

    setCurrentBorderColor(newColor);

    if (newColor.isValid) {
      updateStyles({ 'border-color': newColor.value, });
    }
  }, [updateStyles]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Border</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={cn(styles.borderBlock, styles.borderBlock_width)}>
            <input
              className={styles.borderWidthField}
              name="width"
              type="number"
              value={parseFloat(borderWidth)}
              onChange={handleBorderWidthChange}
              min={MIN_BORDER_WIDTH}
              max={MAX_BORDER_WIDTH}
            />
          </div>
          <div className={cn(styles.borderBlock, styles.borderBlock_radius)}>
            <input
              className={styles.borderRadiusField}
              name="radius"
              type="number"
              value={safeParseFloat(validateBorderRadius(borderRadius))}
              onChange={handleBorderRadius}
              min={MIN_BORDER_RADIUS}
              max={borderRadius.indexOf('px') !== -1 ? MAX_BORDER_RADIUS : MAX_BORDER_RADIUS_PERCENT}
            />
            <select
              className="dropDown"
              name="radius_units"
              onChange={handleChangeBorderRadiusUnits}
              value={accessBorderRadius(borderRadius)}
            >
              <option value="px">px</option>
              <option value="%">percent</option>
            </select>
          </div>
        </div>
        <div className="propsElementsInnerBlock">
          <ColorPicker
            color={borderColor}
            onChangeComplete={color => handleColorChange(color)}
          />
          <input
            className={cn("colorField", { inputWithError: !currentBorderColor.isValid })}
            type="text"
            value={currentBorderColor.value}
            onBlur={() => handleColorChange(borderColor)}
            onChange={({ target: { value } }) => handleColorChange(value)}
          />
        </div>
      </div>
    </div>
  );
});

export const BorderBlock = connect(mapState)(withConfigurableProperties(Component));
