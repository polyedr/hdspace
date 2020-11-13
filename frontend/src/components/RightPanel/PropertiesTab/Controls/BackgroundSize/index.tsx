import React, { useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

enum Unit {
  px = 'px',
  '%' = '%',
  auto = 'auto',
}

type UnitName = keyof typeof Unit;

type SelectedUnit = {
  width: UnitName;
  height: UnitName;
};

type SizeName = keyof SelectedUnit;

const getUnitFromValue = (value: string): UnitName => {
  const unit = value.replace(/[0-9, \d+.\d+]/g, '');

  if (unit in Unit) {
    return unit as UnitName;
  }
  console.error('Incorrect unit', unit);
  return Unit.px;
};

const BackgroundSize: React.FC<PropertiesChangeProps<
  LibraryElement<Entity>
>> = memo(({ updateStyles, removeStyles }) => {
  const activeElementId = useSelector(selectActiveElementId);
  const backgroundSize = useSelector(
    selectCurrentEditableStyles('backgroundSize'),
  ) as string;
  const [width, height] = backgroundSize?.split(' ');

  const handleSelectChange = useCallback(
    ({ target: { value } }, sizeName: SizeName) => {
      const el = document.getElementById(activeElementId);

      switch (value as UnitName) {
        case 'px': {
          if (el !== null) {
            const size =
              sizeName === 'width' ? el.offsetWidth : el.offsetHeight;

            const newBackgroundSize =
              sizeName === 'width'
                ? `${size}px ${height}`
                : `${width} ${size}px`;

            updateStyles({ backgroundSize: newBackgroundSize });
          }
          break;
        }

        case 'auto': {
          const newBackgroundSize =
            sizeName === 'width' ? `auto ${height}` : `${width} auto`;

          updateStyles({ backgroundSize: newBackgroundSize });
          break;
        }

        case '%':
          if (el !== null && el.parentElement !== null) {
            const parentStyles = getComputedStyle(el.parentElement);
            const parentXPadding = parseFloat(parentStyles.paddingLeft);
            const parentYPadding = parseFloat(parentStyles.paddingTop);

            const parentSize =
              sizeName === 'width'
                ? el.parentElement.clientWidth - parentXPadding * 2
                : el.parentElement.clientHeight - parentYPadding * 2;

            const size =
              sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
            const sizeInPercents = parentSize
              ? Math.round(Number((size * 10000) / parentSize)) / 100
              : 0;

            const newBackgroundSize =
              sizeName === 'width'
                ? `${sizeInPercents}% ${height}`
                : `${width} ${sizeInPercents}%`;

            updateStyles({ backgroundSize: newBackgroundSize });
          }
          break;

        default:
          break;
      }
    },
    [activeElementId, updateStyles, width, height],
  );

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => {
      const size = name === 'width' ? width : height;
      const unitValue = Unit[getUnitFromValue(size)];

      const newSize =
        unitValue === 'auto' ? 'auto' : `${value}${Unit[unitValue]}`;

      const newBackgroundSize =
        name === 'width' ? `${newSize} ${height}` : `${width} ${newSize}`;

      updateStyles({ backgroundSize: newBackgroundSize });
    },
    [updateStyles, width, height],
  );

  const renderSizeControl = (sizeName: SizeName) => {
    const size = sizeName === 'width' ? width : height;
    const parsedSize = Number.isNaN(parseFloat(size))
      ? ''
      : String(parseFloat(size));
    const inputValue = size === 'auto' ? 'auto' : parsedSize;

    return (
      <div>
        <input
          type="text"
          name={sizeName}
          value={inputValue}
          onChange={handleInputChange}
          disabled={inputValue === 'auto'}
        />

        <select
          className="dropDown"
          onChange={(event) => handleSelectChange(event, sizeName)}
          value={Unit[getUnitFromValue(size)]}
          name={`${sizeName}_unit`}
        >
          {Object.keys(Unit).map((key, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={index} value={key}>
              {Unit[key]}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div>
      <StylesHeader
        title="Background Size"
        onClick={removeStyles}
        cssPropertiesNames={['backgroundSize']}
      />

      <div>
        {renderSizeControl('width')}
        {renderSizeControl('height')}
      </div>
    </div>
  );
});

export default withConfigurableProperties(BackgroundSize);
