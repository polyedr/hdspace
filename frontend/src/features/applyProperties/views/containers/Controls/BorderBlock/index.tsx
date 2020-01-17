import React, { useState, useCallback, } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MAX_BORDER_WIDTH,
  MIN_BORDER_RADIUS,
  MIN_BORDER_WIDTH,
  DEFAULT_BORDER,
} from '$constants/defaultParams';
import { strToNumber, getPermissibleValue, safeParseFloat, safeMatch } from '$utils/NumberHelper';
import { validBorderRadius, CssLikeStyles } from '$utils/StyleHelper';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { ColorPicker } from '$components/UI/ColorPicker/';

const styles = require('./styles.scss');

const accessBorderRadius = (border: CssLikeStyles['border-radius']) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

type StateProps = {
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    borderStyle: activeItemStyles['border-style'],
    borderColor: activeItemStyles['border-color'],
    borderWidth: activeItemStyles['border-width'],
    borderRadius: activeItemStyles['border-radius'],
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FunctionComponent<Props> = React.memo(({
  borderStyle,
  borderColor,
  borderWidth,
  updateStyles,
  borderRadius,
}) => {
  const [isBorderColorPickerOpen, setIsBorderColorPickerOpen] = useState<boolean>(false);
  const handleActiveColorPicker = useCallback(() => {
    setIsBorderColorPickerOpen(!isBorderColorPickerOpen);
  }, [isBorderColorPickerOpen]);

  const handleBorder = useCallback(({ target: { value } }) => {
    const newWidth = getPermissibleValue(strToNumber(value), MIN_BORDER_WIDTH, MAX_BORDER_WIDTH);

    updateStyles({
      'border-width': `${newWidth}px`,
      'border-style': borderStyle || DEFAULT_BORDER['border-style'],
      'border-color': borderColor || DEFAULT_BORDER['border-color'],
    });
  }, [updateStyles]);

  const handleBorderRadius = useCallback(({ target: { value } }) => {
    updateStyles({
      'border-radius': `${value}${accessBorderRadius(borderRadius)}`,
      'border-width': borderWidth || '1px',
      'border-style': borderStyle || DEFAULT_BORDER['border-style'],
      'border-color': borderColor || DEFAULT_BORDER['border-color'],
    });
  }, [updateStyles]);

  const handleChangeBorderRadiusUnits = useCallback(({ target: { value } }) => {
    updateStyles({
      'border-radius': validBorderRadius(`${(borderRadius && parseFloat(borderRadius)) || 1}${value}`),
      'border-width': borderWidth || '1px',
      'border-style': borderStyle || DEFAULT_BORDER['border-style'],
      'border-color': borderColor || DEFAULT_BORDER['border-color'],
    });
  }, [updateStyles]);

  const handleChangeColor = useCallback((newColor) => {
    if (newColor.length > 7) {
      return;
    }

    updateStyles({
      'border-color': newColor,
      'border-width': borderWidth || '1px',
      'border-style': borderStyle || DEFAULT_BORDER['border-style'],
    });
  }, [updateStyles]);

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
              value={safeParseFloat(borderWidth) || parseFloat(DEFAULT_BORDER['border-width'])}
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
                safeParseFloat(validBorderRadius(borderRadius))
                || parseFloat(DEFAULT_BORDER['border-radius'])
              }
              onChange={handleBorderRadius}
              min={MIN_BORDER_RADIUS}
              max={borderRadius && borderRadius.indexOf('px') !== -1 ? MAX_BORDER_RADIUS : MAX_BORDER_RADIUS_PERCENT || 100}
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
            display={isBorderColorPickerOpen}
            color={borderColor || DEFAULT_BORDER['border-color']}
            onChangeComplete={color => handleChangeColor(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={borderColor || DEFAULT_BORDER['border-color']}
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

export const BorderBlock = connect(mapState)(withConfigurableProperties(Component));
