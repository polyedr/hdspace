import React, { useCallback, memo } from 'react';
import * as R from 'ramda';

import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';

const styles = require('./styles.scss');

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
        let { clientWidth } = document.getElementById(String(activeItem.itemId));

        if (R.prop(('border-width'), styleItem)) {
          clientWidth += (parseFloat(styleItem['border-width']) * 2);
        }

        if (styleItem.width === 'auto' || styleItem.width[String(styleItem.width).length - 1] === '%') {
          updateElementStyles(activeItem.itemId, { width: `${clientWidth}px` });
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
        const { clientHeight } = document.getElementById(String(activeItem.itemId));

        if (styleItem.height === 'auto' || styleItem.height[String(styleItem.height).length - 1] === '%') {
          updateElementStyles(activeItem.itemId, { height: `${clientHeight}px` });
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

    return null;
  }, [styleItem]);

  const getUnitsDisableChange = useCallback(() => (
    // activeItem.itemType === 'block' || activeItem.itemType === 'group'
    false
  ), [activeItem]);

  const getSizeDisableChange = useCallback(value => (
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
              value={(styleItem
                && styleItem.width
                && (styleItem.width[String(styleItem.width).length - 1] === '%' ? styleItem.width : parseFloat(String(styleItem.width)))) || 'auto'}
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
