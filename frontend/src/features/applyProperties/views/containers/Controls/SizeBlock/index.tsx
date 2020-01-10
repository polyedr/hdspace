import React, { useCallback, memo } from 'react';
import * as R from 'ramda';

import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { safeParseFloat } from '$utils/NumberHelper';

import { IPanelEditProps } from '../../PanelEditProps';
const styles = require('./styles.scss');

const getLastChar = (value?: string | number): string => {
  if (typeof value === 'undefined') return '';
  const valueAsString = String(value);
  return (valueAsString[valueAsString.length -1] || '');
}

interface IComponentProps {
  activeItem: IPanelEditProps['activeItem'],
  styleItem: IPanelEditProps['styleItem'],
  updateElementStyles: IPanelEditProps['updateElementStyles'],
  updateScenarioStyles: IPanelEditProps['updateScenarioStyles'],
}

export const SizeBlock: React.FunctionComponent<IComponentProps> = memo((props) => {
  const {
    styleItem,
    activeItem,
    updateElementStyles,
    updateScenarioStyles,
  } = props;

  const handleChangeUnits = useCallback(({ target }) => {
    switch (target.value) {
      case 'width': {
        const el = document.getElementById(String(activeItem.itemId));
        if (el !== null) {
          let { clientWidth } = el;

          if (R.prop(('border-width'), styleItem)) {
            clientWidth += ((safeParseFloat(styleItem['border-width']) || 0) * 2);
          }
  
          if (styleItem.width === 'auto' || getLastChar(styleItem.width) === '%') {
            updateElementStyles(activeItem.itemId, { width: `${clientWidth}px` });
          }
        }
        break;
      }

      case 'auto_width':
        // updateElementStyles(activeItem.itemId, { width: 'auto' });
        if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
          updateScenarioStyles(activeItem.itemId, { width: 'auto' });
        } else {
          updateElementStyles(activeItem.itemId, { width: 'auto' });
        }
        break;

      case 'full_width':
        // updateElementStyles(activeItem.itemId, { width: '100%' });
        if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
          updateScenarioStyles(activeItem.itemId, { width: '100%' });
        } else {
          updateElementStyles(activeItem.itemId, { width: '100%' });
        }
        break;

      case 'height': {
        const el = document.getElementById(String(activeItem.itemId));
        if (el !== null) {
          const { clientHeight } = el;

          if (styleItem.height === 'auto' || getLastChar(styleItem.height) === '%') {
            updateElementStyles(activeItem.itemId, { height: `${clientHeight}px` });
          }
        }
        break;
      }

      case 'auto_height':
        // updateElementStyles(activeItem.itemId, { height: 'auto' });
        if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
          updateScenarioStyles(activeItem.itemId, { height: 'auto' });
        } else {
          updateElementStyles(activeItem.itemId, { height: 'auto' });
        }
        break;

      default: break;
    }
  }, [styleItem, activeItem, updateElementStyles, updateScenarioStyles]);

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

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newSize);
    } else {
      updateElementStyles(activeItem.itemId, newSize);
    }

    // updateElementStyles(activeItem.itemId, newSize);
  }, [activeItem, updateElementStyles, updateScenarioStyles]);

  const getSelected = useCallback((key: string) => {
    if (key === 'width') {
      if (styleItem && styleItem[key] && String(styleItem[key]).match(/px/i)) {
        return 'width';
      }

      if (styleItem && styleItem[key] && styleItem[key] === '100%') {
        return 'full_width';
      }

      return 'auto_width';
    }

    if (key === 'height') {
      return (styleItem && styleItem[key] && String(styleItem[key]).match(/px/i) && 'height') || 'auto_height';
    }

    return undefined;
  }, [styleItem]);

  const getUnitsDisableChange = useCallback(() => (
    // activeItem.itemType === 'block' || activeItem.itemType === 'group'
    false
  ), [activeItem]);

  const getSizeDisableChange = useCallback((value: 'height' | 'width') => (
    // activeItem.itemType === 'block'
    // || activeItem.itemType === 'group'
    styleItem[value] === 'auto'
    || styleItem[value] === '100%'
  ), [activeItem, styleItem]);

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
              value={(getLastChar(styleItem.width) === '%' ? styleItem.width : parseFloat(String(styleItem.width))) || 'auto'}
              onChange={handleChangeSize}
              disabled={getSizeDisableChange('width')}
            />
            <select
              className="dropDown"
              onChange={event => handleChangeUnits(event)}
              value={getSelected('width')}
              name="width_unit"
              disabled={getUnitsDisableChange()}
            >
              {
                activeItem.itemType !== 'block' && activeItem.itemType !== 'group' && activeItem.itemType !== 'container' && (
                  <option value="width">px</option>
                )
              }
              <option value="auto_width">Auto</option>
              <option value="full_width">Full</option>
            </select>
          </div>
          <div className={styles.sizeBlock}>
            <input
              className={styles.sizeField}
              type="text"
              name="height"
              value={(styleItem && parseFloat(String(styleItem.height))) || 'auto'}
              onChange={handleChangeSize}
              disabled={getSizeDisableChange('height')}
            />
            <select
              className="dropDown"
              onChange={handleChangeUnits}
              value={getSelected('height')}
              name="height_unit"
              disabled={getUnitsDisableChange()}
            >
              {
                activeItem.itemType !== 'block' && activeItem.itemType !== 'group' && activeItem.itemType !== 'container' && (
                  <option value="height">px</option>
                )
              }
              {/* <option value="height">px</option> */}
              <option value="auto_height">Auto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});
