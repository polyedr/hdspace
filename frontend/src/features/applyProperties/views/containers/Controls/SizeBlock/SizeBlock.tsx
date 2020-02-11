import React, { useCallback, memo, useState } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { CssLikeStyles } from '$utils/StyleHelper';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { selectors } from '$redux/project';

const styles = require('./SizeBlock.scss');

function keys<Object>(obj: Object) {
  return Object.keys(obj) as [keyof Object];
}

enum Unit {
  px = 'px',
  '%' = '%',
  auto = 'auto',
}

type StateProps = {
  width: string | number;
  height: string | number;
};

type Props = StateProps & PropertiesChangeProps;

const getUnitFromString = (str: string): keyof typeof Unit => {
  const symbol = str.replace(/[0-9, \d+\.\d+]/g, '');

  if (symbol in Unit) {
    return symbol as keyof typeof Unit;
  } else {
    return Unit.px;
  }
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    width: activeItemStyles.width,
    height: activeItemStyles.height,
  };
}

export const Component: React.FC<Props> = memo((props) => {
  const { width, height, updateStyles, activeItemID } = props;

  const widthSymbol = Unit[getUnitFromString(String(width))];
  const heighthSymbol = Unit[getUnitFromString(String(height))];

  const [selectedUnit, setSelectedUnit] = useState<{ width: keyof typeof Unit; height: keyof typeof Unit; }>({
    width: widthSymbol,
    height: heighthSymbol,
  });

  const handleSelectChange = useCallback(({ target: { value } }, sizeName: keyof typeof selectedUnit) => {
    const el = document.getElementById(activeItemID);

    switch (value as keyof typeof Unit) {
      case 'px': {
        if (el !== null) {
          const size = sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
          updateStyles({ [sizeName]: `${size}px` });
        }
        break;
      }

      case 'auto':
        updateStyles({ [sizeName]: 'auto' });
        break;

      case '%':
        if (el !== null && el.parentElement !== null) {
          const parentStyles = getComputedStyle(el.parentElement);
          const parentXPadding = parseFloat(parentStyles.paddingLeft);
          const parentYPadding = parseFloat(parentStyles.paddingTop);
          
          const parentSize = sizeName === 'width' 
            ? el.parentElement.offsetWidth - parentXPadding * 2
            : el.parentElement.offsetHeight - parentYPadding * 2;

          const size = sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
          const sizeInPercents = parentSize ? Math.round(Number(size * 10000 / parentSize)) / 100 : 0;

          updateStyles({ [sizeName]: `${sizeInPercents}%` });
        }
        break;

      default: break;
    }

    setSelectedUnit({ ...selectedUnit, [sizeName]: value });
  }, [selectedUnit, activeItemID, updateStyles, width, height]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    const unitValue = selectedUnit[name as keyof typeof selectedUnit];

    const newSize = {
      [name]: unitValue === 'auto' ? 'auto' : `${value}${Unit[unitValue]}`,
    };

    updateStyles(newSize);
  }, [updateStyles, selectedUnit]);

  const getSizeDisableChange = useCallback((value: 'height' | 'width') => (
    ((value === 'height' ? height : width)) === 'auto'
  ), [height, width]);

  const renderSizeControl = (sizeName: keyof typeof selectedUnit) => {
    const size = sizeName === 'width' ? width : height;
    const parsedSize = Number.isNaN(parseFloat(String(size))) ? '' : String(parseFloat(String(size)));
    const inputValue = size === 'auto' ? 'auto' : parsedSize;
    
    return (
      <>
        <input
          className={styles.sizeField}
          type="text"
          name={sizeName}
          value={inputValue}
          onChange={handleInputChange}
          disabled={getSizeDisableChange(sizeName)}
        />
        <select
          className="dropDown"
          onChange={event => handleSelectChange(event, sizeName)}
          value={selectedUnit[sizeName]}
          name={`${sizeName}_unit`}
        >
          {keys(Unit).map((key) => <option value={key}>{Unit[key]}</option>)}
        </select>
      </>
    );
  };

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Width & Height</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={styles.sizeBlock}>
            {renderSizeControl('width')}
          </div>
          <div className={styles.sizeBlock}>
            {renderSizeControl('height')}
          </div>
        </div>
      </div>
    </div>
  );
});

export const SizeBlock = connect(mapState)(withConfigurableProperties(Component));
