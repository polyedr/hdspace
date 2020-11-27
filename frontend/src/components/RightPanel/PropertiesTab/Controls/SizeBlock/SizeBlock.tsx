import React, { useCallback, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import capitalize from '@material-ui/core/utils/capitalize';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  selectActiveElementId,
  selectCurrentEditableStyles,
} from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import StylesHeader from '../../helperComponents/StylesHeader';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  sizeControl: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'flex-end',
  },
  text: {
    width: 50,
  },
});

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

type ControlProps = {
  sizeName: SizeName;
};

const getUnitFromValue = (value: string): UnitName => {
  const unit = value.replace(/[0-9, \d+.\d+]/g, '');

  if (unit in Unit) {
    return unit as UnitName;
  }
  console.error('Incorrect unit', unit); // TODO validate users input value
  return Unit.px;
};

const SizeBlock: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  updateStyles,
  removeStyles,
}) => {
  const activeElementId = useSelector(selectActiveElementId);
  const width = useSelector(selectCurrentEditableStyles('width')) || 'auto';
  const height = useSelector(selectCurrentEditableStyles('height')) || 'auto';
  const classes = useStyles();

  const handleSelectChange = useCallback(
    ({ target: { value } }, sizeName: SizeName) => {
      const el = document.getElementById(activeElementId);

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
    [activeElementId, updateStyles, width, height],
  );

  const handleInputChange = useCallback(
    (name, value) => {
      const size = String(name === 'width' ? width : height) || 'auto';
      const unitValue = Unit[getUnitFromValue(size?.toString() || Unit.px)];

      const newSize = {
        [name]: unitValue === 'auto' ? 'auto' : `${value}${Unit[unitValue]}`,
      };

      updateStyles(newSize);
      updateStyles({ flexGrow: 0 });
    },
    [updateStyles, width, height],
  );

  const SizeControl: React.FC<ControlProps> = ({ sizeName }) => {
    const size = String(sizeName === 'width' ? width : height) || 'auto';
    const parsedSize = Number.isNaN(parseFloat(size))
      ? ''
      : String(parseFloat(size));
    const inputValue = size === 'auto' ? 'auto' : parsedSize;
    const [state, setState] = useState(inputValue);
    useEffect(() => {
      setState(inputValue);
    }, [inputValue]);
    const debounced = useDebouncedCallback((name, value) => {
      handleInputChange(name, value);
    }, 500);

    return (
      <div className={classes.sizeControl}>
        <StyledTextField
          className={classes.text}
          label={capitalize(sizeName)}
          type="text"
          name={sizeName}
          value={state}
          onChange={({ target: { name, value } }) => {
            setState(value);
            debounced.callback(name, value);
          }}
          disabled={inputValue === 'auto'}
          margin="dense"
        />

        <StyledTextField
          margin="dense"
          label="Units"
          onChange={(event) => handleSelectChange(event, sizeName)}
          value={Unit[getUnitFromValue(size)]}
          name={`${sizeName}_unit`}
          select
        >
          {Object.keys(Unit).map((unit) => (
            <MenuItem key={unit} value={unit} dense>
              {unit}
            </MenuItem>
          ))}
        </StyledTextField>
      </div>
    );
  };

  return (
    <section>
      <StylesHeader
        title="Width & Height"
        onClick={removeStyles}
        cssPropertiesNames={['width', 'height']}
      />

      <div className={classes.wrapper}>
        <SizeControl sizeName="height" />
        <SizeControl sizeName="width" />
      </div>
    </section>
  );
};

export default withConfigurableProperties(memo(SizeBlock));
