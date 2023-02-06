/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import RemoveStyles from '../../helperComponents/RemoveStyles';

enum Unit {
  px = 'px',
  '%' = '%',
  auto = 'auto',
}

type UnitName = keyof typeof Unit;

interface SelectedUnit {
  width: UnitName;
  height: UnitName;
}

type SizeName = keyof SelectedUnit;

const getUnitFromValue = (value: string | number): UnitName =>
  Unit[value.toString().replace(/[0-9, \d+.\d+]/g, '')] || Unit.px;

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundSize?: React.CSSProperties['backgroundSize'];
};

const BackgroundSize: React.FC<Props> = memo(
  ({
    updateStyles,
    removeStyles,
    canEdit,
    backgroundSize,
    masterScreenEnabled,
    element,
    editableStyles,
  }) => {
    const editorDocument = useSelector(selectEditorDocument);

    const [width, height] = useMemo(() => {
      if (!backgroundSize) {
        return [0, 0];
      }
      const stringSize = backgroundSize.toString();
      if (stringSize.indexOf(' ') > 0) {
        return stringSize.split(' ');
      }
      return [backgroundSize, backgroundSize];
    }, [backgroundSize]);

    const handleSelectChange = useCallback(
      ({ target: { value } }, sizeName: SizeName) => {
        if (editorDocument) {
          const el = editorDocument.getElementById(element.id);

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
        }
      },
      [updateStyles, width, height, editorDocument],
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
      const parsedSize = Number.isNaN(parseFloat(size.toString()))
        ? ''
        : String(parseFloat(size.toString()));
      const inputValue = size === 'auto' ? 'auto' : parsedSize;

      return (
        <div>
          <input
            type="text"
            name={sizeName}
            value={inputValue}
            onChange={handleInputChange}
            disabled={inputValue === 'auto' || !canEdit}
          />

          <select
            className="dropDown"
            onChange={(event) => handleSelectChange(event, sizeName)}
            value={Unit[getUnitFromValue(size)]}
            name={`${sizeName}_unit`}
            disabled={!canEdit}
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
        {!masterScreenEnabled && canEdit && (
          <RemoveStyles
            onClick={removeStyles}
            propsToRemove={['backgroundSize']}
            editableStyles={editableStyles}
            type={element.type}
          />
        )}

        <div>
          {renderSizeControl('width')}
          {renderSizeControl('height')}
        </div>
      </div>
    );
  },
);

export default BackgroundSize;
