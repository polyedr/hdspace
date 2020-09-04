import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import ColorSettings from '../../../components/ColorSettings/ColorSettings';
import {
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MAX_BORDER_WIDTH,
  MIN_BORDER_RADIUS,
  MIN_BORDER_WIDTH,
} from '../../../../../../constants/defaultParams';
import { Entity } from '../../../../../../domain/core';
import { LibraryElement } from '../../../../../../api/types';
import {
  getPermissibleValue,
  safeMatch,
  safeParseFloat,
  strToNumber,
} from '../../../../../../utils/NumberHelper';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import {
  CssLikeStyles,
  validateBorderRadius,
} from '../../../../../../utils/StyleHelper';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

const styles = require('./styles.scss');

const accessBorderRadius = (border: CssLikeStyles['border-radius']) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

function mapState(state: AppReduxState) {
  return {
    borderColor: selectCurrentEditableStyles(state, 'border-color'),
    borderWidth: selectCurrentEditableStyles(state, 'border-width'),
    borderRadius: selectCurrentEditableStyles(state, 'border-radius'),
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
