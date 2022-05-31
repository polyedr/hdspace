import React, { useCallback, useMemo } from 'react';
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
import {
  useDebouncedInputChange,
  useDebouncedValueChange,
} from '@Utils/debounceHooks';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

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
  isDefaultStyles?: boolean;
};

const BorderBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  borderWidth,
  borderColor = 'transparent',
  borderRadius = 'px',
  masterScreenEnabled,
  canEdit,
  element,
  editableStyles,
  isDefaultStyles = false,
}) => {
  const classes = useStyles();
  const defaultStyles = useSelector(selectCurrentProjectDefaultStyles);

  const borderRadiusUnits = useMemo(
    () => accessBorderRadius(String(borderRadius)),
    [borderRadius],
  );

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

  const [width, handleWidthChange] = useDebouncedInputChange(
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

  const [radius, handleRadiusChange] = useDebouncedInputChange(
    (isDefaultStyles && defaultStyles?.border?.borderRadius) || borderRadius,
    (value) => {
      updateStyles({
        borderRadius: `${value}${accessBorderRadius(String(borderRadius))}`,
      });
    },
    250,
  );

  const [radiusUnitsValue, handleRadiusUnitsChange] = useDebouncedInputChange(
    borderRadiusUnits,
    (unitsValue: string) => {
      updateStyles({
        borderRadius: `${parseInt(borderRadius.toString())}${unitsValue}`,
      });
    },
  );

  const [borderColorValue, handleBorderColorChange] = useDebouncedValueChange(
    borderColor,
    (newBorderColor: string) => {
      updateStyles({ borderColor: newBorderColor });
    },
  );

  return (
    <div>
      {!isDefaultStyles && !masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={['borderColor', 'borderWidth', 'borderRadius']}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

      <div className={classes.wrapper}>
        {!isDefaultStyles && (
          <StyledTextField
            label="Width"
            type="number"
            value={width ? parseFloat(width as string) : ''}
            onChange={handleWidthChange}
            margin="dense"
            className={classes.text}
            disabled={!canEdit}
          />
        )}

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
            onChange={handleRadiusUnitsChange}
            value={radiusUnitsValue}
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

      {!isDefaultStyles && (
        <ColorSettings
          onClick={removeStyles}
          propsToRemove={['borderColor']}
          currentColor={borderColorValue as string}
          activeElementId={element.id}
          onChange={handleBorderColorChange as (newBorderColor: string) => void}
          disabled={!canEdit}
        />
      )}
    </div>
  );
};

export default BorderBlock;
