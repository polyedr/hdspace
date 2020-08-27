/* eslint-disable no-console */

import React, { useCallback, memo } from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

import { StylesHeader } from '../../../components/StylesHeader/StylesHeader';

const styles = require('./SizeBlock.scss');

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

function mapState(state: AppReduxState) {
  return {
    width: selectors.selectCurrentEditableStyles(state, 'width'),
    height: selectors.selectCurrentEditableStyles(state, 'height'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const getUnitFromValue = (value: string): UnitName => {
  const unit = value.replace(/[0-9, \d+.\d+]/g, '');

  if (unit in Unit) {
    return unit as UnitName;
  }
  console.error('Incorrect unit', unit); // TODO validate users input value
  return Unit.px;
};

const SizeBlock: React.FC<Props> = memo((props) => {
  const { updateStyles, removeStyles, activeItemID, width, height } = props;

  const handleSelectChange = useCallback(
    ({ target: { value } }, sizeName: SizeName) => {
      const el = document.getElementById(activeItemID);

      switch (value as UnitName) {
        case 'px': {
          if (el !== null) {
            const size =
              sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
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

            const parentSize =
              sizeName === 'width'
                ? el.parentElement.clientWidth - parentXPadding * 2
                : el.parentElement.clientHeight - parentYPadding * 2;

            const size =
              sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
            const sizeInPercents = parentSize
              ? Math.round(Number((size * 10000) / parentSize)) / 100
              : 0;

            updateStyles({ [sizeName]: `${sizeInPercents}%` });
          }
          break;

        default:
          break;
      }
    },
    [activeItemID, updateStyles, width, height],
  );

  const handleInputChange = useCallback(
    ({ target: { name, value } }) => {
      const size = name === 'width' ? width : height;
      const unitValue = Unit[getUnitFromValue(size)];

      const newSize = {
        [name]: unitValue === 'auto' ? 'auto' : `${value}${Unit[unitValue]}`,
      };

      updateStyles(newSize);
      updateStyles({ 'flex-grow': 0 });
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
      <>
        <input
          className={styles.sizeField}
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
          {R.keys(Unit).map((key, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={index} value={key}>
              {Unit[key]}
            </option>
          ))}
        </select>
      </>
    );
  };

  return (
    <div className="propsElementsBlock">
      <StylesHeader
        title="Width & Height"
        onClick={removeStyles}
        cssPropertiesNames={['width', 'height']}
      />
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={styles.sizeBlock}>{renderSizeControl('width')}</div>
          <div className={styles.sizeBlock}>{renderSizeControl('height')}</div>
        </div>
      </div>
    </div>
  );
});

const Component = connect(mapState)(withConfigurableProperties(SizeBlock));
export { Component as SizeBlock };
