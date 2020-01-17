import React, { useCallback, memo, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { safeParseFloat } from '$utils/NumberHelper';
import { CssLikeStyles } from '$utils/StyleHelper';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { selectors } from '$redux/project';

const styles = require('./styles.scss');

const getLastChar = (value?: string | number): string => {
  if (typeof value === 'undefined') return '';
  const valueAsString = String(value);
  return (valueAsString[valueAsString.length -1] || '');
}

type StateProps = {
  borderWidth: string;
  width: string | number;
  height: string | number;
};

type Props = StateProps & PropertiesChangeProps;

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    borderWidth: activeItemStyles['border-width'],
    width: activeItemStyles.width,
    height: activeItemStyles.height,
  };
}

export const Component: React.FC<Props> = memo((props) => {
  const {
    borderWidth,
    width,
    height,
    updateStyles,
    activeItemID,
  } = props;

  useEffect(() => { // TODO: set these props when creating elements/containers, not here
    if (typeof width === 'undefined') {
      updateStyles({ width: 'auto' });
    }
    if (typeof height === 'undefined') {
      updateStyles({ height: 'auto' });
    }
    if (typeof borderWidth === 'undefined') {
      updateStyles({ 'border-width': '0' });
    }
  }, [activeItemID, updateStyles]);

  const handleChangeUnits = useCallback(({ target }) => {
    switch (target.value) {
      case 'width': {
        const el = document.getElementById(activeItemID);
        if (el !== null) {
          let { clientWidth } = el;

          if (borderWidth) {
            clientWidth += ((safeParseFloat(borderWidth) || 0) * 2);
          }
  
          if (width === 'auto' || getLastChar(width) === '%') {
            updateStyles({ width: `${clientWidth}px` });
          }
        }
        break;
      }

      case 'auto_width':
        updateStyles({ width: 'auto' });
        break;

      case 'full_width':
        updateStyles({ width: '100%' });
        break;

      case 'height': {
        const el = document.getElementById(activeItemID);
        if (el !== null) {
          const { clientHeight } = el;

          if (height === 'auto' || getLastChar(height) === '%') {
            updateStyles({ height: `${clientHeight}px` });
          }
        }
        break;;
      }

      case 'auto_height':
        updateStyles({ height: 'auto' });
        break;

      default: break;
    }
  }, [updateStyles, borderWidth, width, height]);

  const handleChangeSize = useCallback(({ target }) => {
    let newSize;

    if (target.value.length <= 0) {
      newSize = {
        [target.name]: 'auto',
      };
    } else {
      newSize = {
        [target.name]: `${target.value}px`,
      };
    }

    updateStyles(newSize);
  }, [updateStyles]);

  const getSelected = useCallback((key: string) => {
    if (key === 'width') {
      if (width && String(width).match(/px/i)) {
        return 'width';
      }

      if (height === '100%') {
        return 'full_width';
      }

      return 'auto_width';
    }

    if (key === 'height') {
      return (height && String(height).match(/px/i) && 'height') || 'auto_height';
    }

    return undefined;
  }, [height, width]);

  const getSizeDisableChange = useCallback((value: 'height' | 'width') => (
    // activeItem.itemType === 'block'
    // || activeItem.itemType === 'group'
    ((value === 'height' ? height : width)) === 'auto'
    || (value === 'height' ? height : width) === '100%'
  ), [height, width]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Width & Height</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={styles.sizeBlock}>
            <input
              className={styles.sizeField}
              type="text"
              name="width"
              value={(getLastChar(width) === '%' ? width : parseFloat(String(width))) || 'auto'}
              onChange={handleChangeSize}
              disabled={getSizeDisableChange('width')}
            />
            <select
              className="dropDown"
              onChange={event => handleChangeUnits(event)}
              value={getSelected('width')}
              name="width_unit"
            >
              <option value="width">px</option>
              <option value="auto_width">Auto</option>
              <option value="full_width">Full</option>
            </select>
          </div>
          <div className={styles.sizeBlock}>
            <input
              className={styles.sizeField}
              type="text"
              name="height"
              value={parseFloat(String(height)) || 'auto'}
              onChange={handleChangeSize}
              disabled={getSizeDisableChange('height')}
            />
            <select
              className="dropDown"
              onChange={handleChangeUnits}
              value={getSelected('height')}
              name="height_unit"
            >
              <option value="height">px</option>
              <option value="auto_height">Auto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

export const SizeBlock = connect(mapState)(withConfigurableProperties(Component));
