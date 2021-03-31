import React, { useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  getPermissibleValue,
  safeMatch,
  safeParseFloat,
  strToNumber,
} from '@Utils/NumberHelper';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import {
  MAX_BORDER_WIDTH,
  MIN_BORDER_WIDTH,
  MAX_BORDER_RADIUS,
  MAX_BORDER_RADIUS_PERCENT,
  MIN_BORDER_RADIUS,
} from '@Constants/defaultParams';
import useDebouncedChange from '@Utils/useDeboucedChange';
import StylesHeader from '../../helperComponents/StylesHeader';
import ColorSettings from '../../helperComponents/ColorSettings';

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

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  borderColor?: React.CSSProperties['borderColor'];
  borderWidth?: React.CSSProperties['borderWidth'];
  borderRadius?: React.CSSProperties['borderRadius'];
};

const BorderBlock: React.FC<Props> = ({
  activeElementId,
  updateStyles,
  removeStyles,
  borderWidth,
  borderColor = 'transparent',
  borderRadius = 'px',
  masterScreenEnabled,
  canEdit,
}) => {
  const classes = useStyles();
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

  const [width, handleWidthChange] = useDebouncedChange(
    borderWidth,
    (value) => {
      const newWidth = getPermissibleValue(
        strToNumber(value.toString()),
        MIN_BORDER_WIDTH,
        MAX_BORDER_WIDTH,
      );

      updateStyles({ borderWidth: `${newWidth}px` });
    },
    250,
  );

  const [radius, handleRadiusChange] = useDebouncedChange(
    borderRadius,
    (value) => {
      updateStyles({
        borderRadius: `${value}${accessBorderRadius(String(borderRadius))}`,
      });
    },
    250,
  );

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
      {!masterScreenEnabled && canEdit && (
        <StylesHeader
          title="Border"
          onClick={removeStyles}
          cssPropertiesNames={['borderColor', 'borderWidth', 'borderRadius']}
        />
      )}

      <div className={classes.wrapper}>
        <StyledTextField
          label="Width"
          type="number"
          value={width ? parseFloat(width as string) : ''}
          onChange={handleWidthChange}
          margin="dense"
          className={classes.text}
          disabled={!canEdit}
        />

        <div className={classes.control}>
          <StyledTextField
            label="Radius"
            type="number"
            value={safeParseFloat(validateBorderRadius(String(radius)))}
            onChange={handleRadiusChange}
            margin="dense"
            className={classes.text}
            disabled={!canEdit}
          />

          <StyledTextField
            margin="dense"
            onChange={handleChangeBorderRadiusUnits}
            value={accessBorderRadius(String(borderRadius))}
            select
            disabled={!canEdit}
          >
            <MenuItem value="px" dense>
              px
            </MenuItem>
            <MenuItem value="%" dense>
              percent
            </MenuItem>
          </StyledTextField>
        </div>
      </div>

      <ColorSettings
        currentColor={borderColor}
        activeElementId={activeElementId}
        onChange={handleColorSettingsChange}
        disabled={!canEdit}
      />
    </div>
  );
};

export default BorderBlock;
