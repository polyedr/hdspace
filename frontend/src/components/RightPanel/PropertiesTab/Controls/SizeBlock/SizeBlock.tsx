import React, { useCallback, memo } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import capitalize from '@material-ui/core/utils/capitalize';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import {
  AppReduxState,
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

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

function mapState(state: AppReduxState) {
  return {
    width: selectCurrentEditableStyles(state, 'width'),
    height: selectCurrentEditableStyles(state, 'height'),
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

const SizeBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  activeItemID,
  width,
  height,
}) => {
  const classes = useStyles();

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
      <div className={classes.sizeControl}>
        <TextField
          className={classes.text}
          label={capitalize(sizeName)}
          type="text"
          name={sizeName}
          value={inputValue}
          onChange={handleInputChange}
          disabled={inputValue === 'auto'}
          margin="dense"
        />

        <FormControl margin="dense">
          <Select
            label="Units"
            onChange={(event) => handleSelectChange(event, sizeName)}
            value={Unit[getUnitFromValue(size)]}
            name={`${sizeName}_unit`}
          >
            {Object.keys(Unit).map((unit) => (
              <MenuItem key={unit} value={unit} dense>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        {renderSizeControl('height')}
        {renderSizeControl('width')}
      </div>
    </section>
  );
};

export default connect(mapState)(withConfigurableProperties(memo(SizeBlock)));
