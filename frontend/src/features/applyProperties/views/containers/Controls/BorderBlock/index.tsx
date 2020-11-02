import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import makeStyles from '@material-ui/core/styles/makeStyles';
import StylesHeader from '../../../components/StylesHeader/StylesHeader';
import ColorSettings from '../../../components/ColorSettings/ColorSettings';
import {
  MAX_BORDER_WIDTH,
  MIN_BORDER_WIDTH,
} from '../../../../../../constants/defaultParams';
import { Entity } from '../../../../../../domain/core';
import { LibraryElement } from '../../../../../../api/types';
import {
  getPermissibleValue,
  safeMatch,
  safeParseFloat,
  strToNumber,
} from '../../../../../../utils/NumberHelper';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import {
  CssLikeStyles,
  validateBorderRadius,
} from '../../../../../../utils/StyleHelper';
import { AppReduxState } from '../../../../../../shared/types/app';
import { selectCurrentEditableStyles } from '../../../../../../redux/project/selectors';

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

const accessBorderRadius = (border: CssLikeStyles['border-radius']) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

function mapState(state: AppReduxState) {
  return {
    borderColor: selectCurrentEditableStyles(state, 'border-color'),
    borderWidth: selectCurrentEditableStyles(state, 'border-width'),
    borderRadius: selectCurrentEditableStyles(state, 'border-radius'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const BorderBlock: React.FC<Props> = ({
  activeItemID,
  updateStyles,
  removeStyles,
  borderColor,
  borderWidth,
  borderRadius,
}) => {
  const classes = useStyles();

  const handleBorderWidthChange = ({ target: { value } }) => {
    const newWidth = getPermissibleValue(
      strToNumber(value),
      MIN_BORDER_WIDTH,
      MAX_BORDER_WIDTH,
    );

    updateStyles({ 'border-width': `${newWidth}px` });
  };

  const handleBorderRadius = ({ target: { value } }) => {
    updateStyles({
      'border-radius': `${value}${accessBorderRadius(borderRadius)}`,
    });
  };

  const handleChangeBorderRadiusUnits = ({ target: { value } }) => {
    updateStyles({
      'border-radius': validateBorderRadius(
        `${parseFloat(borderRadius)}${value}`,
      ),
    });
  };

  const handleColorSettingsChange = useCallback(
    (color: string) => {
      updateStyles({ 'border-color': color });
    },
    [updateStyles],
  );

  return (
    <div>
      <StylesHeader
        title="Border"
        onClick={removeStyles}
        cssPropertiesNames={['border-color', 'border-width', 'border-radius']}
      />

      <div className={classes.wrapper}>
        <TextField
          label="Width"
          type="number"
          value={parseFloat(borderWidth)}
          onChange={handleBorderWidthChange}
          margin="dense"
          className={classes.text}
        />

        <div className={classes.control}>
          <TextField
            label="Radius"
            type="number"
            value={safeParseFloat(validateBorderRadius(borderRadius))}
            onChange={handleBorderRadius}
            margin="dense"
            className={classes.text}
          />

          <FormControl margin="dense">
            <Select
              onChange={handleChangeBorderRadiusUnits}
              value={accessBorderRadius(borderRadius)}
            >
              <MenuItem value="px">px</MenuItem>
              <MenuItem value="%">percent</MenuItem>
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

export default connect(mapState)(withConfigurableProperties(memo(BorderBlock)));
