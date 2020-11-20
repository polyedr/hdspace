import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDebouncedCallback } from 'use-debounce';
import {
  getPermissibleValue,
  safeMatch,
  safeParseFloat,
  strToNumber,
} from '../../../../../utils/NumberHelper';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
} from '../../../../../types';

import {
  MAX_BORDER_WIDTH,
  MIN_BORDER_WIDTH,
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MIN_BORDER_RADIUS,
} from '../../../../../constants/defaultParams';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  text: {
    width: 50,
  },
  control: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
});

const accessBorderRadius = (border: string) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

const BorderBlock: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  activeItemID,
  updateStyles,
  removeStyles,
}) => {
  const classes = useStyles();
  const borderColor =
    useSelector(selectCurrentEditableStyles('borderColor')) || 'transparent';
  const borderWidth = useSelector(selectCurrentEditableStyles('borderWidth'));
  const borderRadius =
    useSelector(selectCurrentEditableStyles('borderRadius')) || 'px';

  const validateBorderRadius = useCallback((radius: string | null) => {
    if (!radius) {
      return undefined;
    }

    const value = parseInt(radius) || MIN_BORDER_RADIUS;

    if (value && value < MIN_BORDER_RADIUS) {
      return `${MIN_BORDER_RADIUS}px`;
    }

    if (!radius || radius.indexOf('%') === -1) {
      return `${value > MAX_BORDER_RADIUS ? MAX_BORDER_RADIUS : value}px`;
    }

    return `${
      value > MAX_BORDER_RADIUS_PERCENT ? MAX_BORDER_RADIUS_PERCENT : value
    }%`;
  }, []);

  const debouncedBorderWidth = useDebouncedCallback((value) => {
    const newWidth = getPermissibleValue(
      strToNumber(value.toString()),
      MIN_BORDER_WIDTH,
      MAX_BORDER_WIDTH,
    );

    updateStyles({ borderWidth: `${newWidth}px` });
  }, 250);

  const debouncedBorderRadius = useDebouncedCallback((value) => {
    updateStyles({
      borderRadius: `${value}${accessBorderRadius(String(borderRadius))}`,
    });
  }, 250);

  const handleChangeBorderRadiusUnits = ({ target: { value } }) => {
    updateStyles({
      borderRadius: `${parseInt(borderRadius.toString())}${value}`,
    });
  };

  const handleColorSettingsChange = useCallback(
    (color: string) => {
      updateStyles({ borderColor: color });
    },
    [updateStyles],
  );

  return (
    <div>
      <StylesHeader
        title="Border"
        onClick={removeStyles}
        cssPropertiesNames={['borderColor', 'borderWidth', 'borderRadius']}
      />

      <div className={classes.wrapper}>
        <TextField
          label="Width"
          type="number"
          defaultValue={borderWidth ? parseFloat(borderWidth as string) : ''}
          onChange={(ev) => debouncedBorderWidth.callback(ev.target.value)}
          margin="dense"
          className={classes.text}
        />

        <div className={classes.control}>
          <TextField
            label="Radius"
            type="number"
            defaultValue={safeParseFloat(
              validateBorderRadius(String(borderRadius)),
            )}
            onChange={(ev) =>
              debouncedBorderRadius.callback(parseInt(ev.target.value))
            }
            margin="dense"
            className={classes.text}
          />

          <FormControl margin="dense">
            <Select
              onChange={handleChangeBorderRadiusUnits}
              value={accessBorderRadius(String(borderRadius))}
            >
              <MenuItem value="px" dense>
                px
              </MenuItem>
              <MenuItem value="%" dense>
                percent
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <ColorSettings
        currentColor={borderColor}
        activeItemID={activeItemID}
        onChange={handleColorSettingsChange}
      />
    </div>
  );
};

export default withConfigurableProperties(BorderBlock);
