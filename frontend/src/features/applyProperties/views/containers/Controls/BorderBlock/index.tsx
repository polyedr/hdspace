import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';

import {
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MAX_BORDER_WIDTH,
  MIN_BORDER_RADIUS,
  MIN_BORDER_WIDTH,
} from '$constants/defaultParams';
import {
  strToNumber,
  getPermissibleValue,
  safeParseFloat,
  safeMatch,
} from '$utils/NumberHelper';
import { validateBorderRadius, CssLikeStyles } from '$utils/StyleHelper';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import ColorSettings from '$features/applyProperties/views/components/ColorSettings/ColorSettings';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

import StylesHeader from '../../../components/StylesHeader/StylesHeader';

const styles = require('./styles.scss');

const accessBorderRadius = (border: CssLikeStyles['border-radius']) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

function mapState(state: AppReduxState) {
  return {
    borderColor: selectors.selectCurrentEditableStyles(state, 'border-color'),
    borderWidth: selectors.selectCurrentEditableStyles(state, 'border-width'),
    borderRadius: selectors.selectCurrentEditableStyles(state, 'border-radius'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const BorderBlock: React.FC<Props> = ({
  activeItemID,
  updateStyles,
  removeStyles,
  borderColor,
  borderWidth,
  borderRadius,
}) => {
  const handleBorderWidthChange = useCallback(
    ({ target: { value } }) => {
      const newWidth = getPermissibleValue(
        strToNumber(value),
        MIN_BORDER_WIDTH,
        MAX_BORDER_WIDTH,
      );

      updateStyles({ 'border-width': `${newWidth}px` });
    },
    [updateStyles],
  );

  const handleBorderRadius = useCallback(
    ({ target: { value } }) => {
      updateStyles({
        'border-radius': `${value}${accessBorderRadius(borderRadius)}`,
      });
    },
    [updateStyles],
  );

  const handleChangeBorderRadiusUnits = useCallback(
    ({ target: { value } }) => {
      updateStyles({
        'border-radius': validateBorderRadius(
          `${parseFloat(borderRadius)}${value}`,
        ),
      });
    },
    [updateStyles],
  );

  const handleColorSettingsChange = useCallback(
    (color: string) => {
      updateStyles({ 'border-color': color });
    },
    [updateStyles],
  );

  return (
    <div className="propsElementsBlock">
      <StylesHeader
        title="Border"
        onClick={removeStyles}
        cssPropertiesNames={['border-color', 'border-width', 'border-radius']}
      />
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
              max={
                borderRadius.indexOf('px') !== -1
                  ? MAX_BORDER_RADIUS
                  : MAX_BORDER_RADIUS_PERCENT
              }
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
          <ColorSettings
            currentColor={borderColor}
            activeItemID={activeItemID}
            onChange={handleColorSettingsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(BorderBlock)));
