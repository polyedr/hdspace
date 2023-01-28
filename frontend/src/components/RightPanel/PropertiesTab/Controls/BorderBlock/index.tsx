import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getPermissibleValue,
  safeMatch,
  safeParseFloat,
  strToNumber,
} from '@Utils/NumberHelper';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import {
  StyledTextField,
  StyledToggleButton,
  StyledToggleButtonGroup,
} from '@Components/styledComponents';
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
import { MenuItem, Box } from '@mui/material';
import { styled, makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectDefaultStyles } from '@Redux/project/selectors/base';
import cn from 'classnames';
import BORDER_STYLE from '@Constants/borderStyle';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { useDebouncedCallback } from 'use-debounce';
import ColorSettings from '../../helperComponents/ColorSettings';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const useStyles = makeStyles({
  wrapper: {
    justifyContent: 'space-between',
  },
  text: {
    // width: '76px',
  },
  position: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  control: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  container: {
    // padding: '0 16px',
  },
  numberInput: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  borderStyleControl: {
    width: 'calc(50% - 40px) !important',
  },
  styleBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  styleInnerBlock: {
    width: '25%',
  },
  labelTextField: {
    fontSize: '12px',
    color: '#81818E',
  },
  borderWidthLabel: {
    // paddingBottom: '5px',
    width: 30,
  },
  detailedBorderWidth: {
    width: '45px',
  },
});

const accessBorderRadius = (border: string) => {
  const matchedValue = safeMatch(border);
  return matchedValue !== null ? matchedValue[0] : 'px';
};

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  borderColor?: React.CSSProperties['borderColor'];
  borderWidth?: React.CSSProperties['borderWidth'];
  borderTopWidth?: React.CSSProperties['borderTopWidth'];
  borderBottomWidth?: React.CSSProperties['borderBottomWidth'];
  borderRightWidth?: React.CSSProperties['borderRightWidth'];
  borderLeftWidth?: React.CSSProperties['borderLeftWidth'];
  borderRadius?: React.CSSProperties['borderRadius'];
  borderStyle?: React.CSSProperties['borderStyle'];
  isDefaultStyles?: boolean;
};

const detailedLabel = {
  borderTopWidth: 'Top',
  borderBottomWidth: 'Bottom',
  borderLeftWidth: 'Left',
  borderRightWidth: 'Right',
};

const CustomStyledToggleButton = styled(StyledToggleButton)({
  padding: '0 !important',
  margin: '0 !important',
});

const BorderBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  borderWidth,
  borderColor = 'transparent',
  borderRadius = 'px',
  borderStyle,
  masterScreenEnabled,
  canEdit,
  element,
  editableStyles,
  isDefaultStyles = false,
  borderTopWidth,
  borderBottomWidth,
  borderLeftWidth,
  borderRightWidth,
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

    if (!radius || !radius.includes('%')) {
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

  const [detailedBorderWidth, setDetailedBorderWidth] = useState({
    borderTopWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderRightWidth,
  });

  useEffect(() => {
    setDetailedBorderWidth({
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
    });
  }, [borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth]);

  const updateBorderWidth = (name, value) => {
    const newWidth = getPermissibleValue(
      strToNumber(value.toString()),
      MIN_BORDER_WIDTH,
      MAX_BORDER_WIDTH,
    );
    updateStyles({ [name]: `${newWidth}px` });
  };

  const debouncedValueChangeHandler = useDebouncedCallback(
    (value, name, cb) => {
      cb(name, value);
    },
    250,
  );

  const handleBorderWidthChange = (name, value) => {
    setDetailedBorderWidth({ ...detailedBorderWidth, [name]: value });
    debouncedValueChangeHandler.callback(value, name, updateBorderWidth);
  };

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

  const handleBorderStyleChange = (event) => {
    updateStyles({ borderStyle: event.target.value });
  };

  const [isBorderEditorOpen, setIsBorderEditorOpen] = useState(false);

  return (
    <div className={classes.container}>
      {!isDefaultStyles && !masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={[
            'borderColor',
            'borderWidth',
            'borderRadius',
            'borderBottomWidth',
            'borderLeftWidth',
            'borderRightWidth',
            'borderTopWidth',
          ]}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

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

      <div className={cn(classes.wrapper, classes.position)}>
        <div
          className={cn(classes.styleBlock)}
          style={{
            width: 'calc(50% - 10px) ',
          }}
        >
          {/* {!isDefaultStyles && ( */}
          <div className={cn(classes.labelTextField, classes.borderWidthLabel)}>
            W
          </div>
          <StyledTextField
            style={{ marginBottom: 0 }}
            type="number"
            value={width ? parseFloat(width as string) : ''}
            onChange={handleWidthChange}
            margin="dense"
            inputProps={{ className: classes.numberInput }}
            className={classes.text}
            disabled={!canEdit}
          />
          {/* )} */}
        </div>
        <StyledTextField
          style={{ marginBottom: 0 }}
          className={classes.borderStyleControl}
          margin="dense"
          value={borderStyle || BORDER_STYLE[1].value}
          onChange={handleBorderStyleChange}
          select
          disabled={!canEdit}
        >
          {BORDER_STYLE.map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </StyledTextField>

        <StyledToggleButtonGroup
          value={isBorderEditorOpen}
          exclusive
          size="small"
          style={isDefaultStyles ? { width: '20px', height: '20px' } : {}}
        >
          <CustomStyledToggleButton
            value
            disabled={!canEdit}
            onClick={() => setIsBorderEditorOpen(!isBorderEditorOpen)}
          >
            <CheckBoxOutlineBlankRoundedIcon fontSize="medium" />
          </CustomStyledToggleButton>
        </StyledToggleButtonGroup>
      </div>

      {isBorderEditorOpen && (
        <div className={cn(classes.styleBlock)} style={{ gap: 15 }}>
          {Object.keys(detailedBorderWidth).map((item) => (
            <div key={item} className={cn(classes.styleInnerBlock)}>
              <StyledTextField
                type="number"
                value={
                  detailedBorderWidth[item]
                    ? parseFloat(detailedBorderWidth[item] as string)
                    : ''
                }
                onChange={(event) =>
                  handleBorderWidthChange(item, event.target.value)
                }
                margin="dense"
                inputProps={{ className: classes.numberInput }}
                className={classes.detailedBorderWidth}
                disabled={!canEdit}
                placeholder="0"
              />
              <div className={classes.labelTextField}>
                {detailedLabel[item]}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={cn(classes.wrapper, classes.position)}>
        <div className={cn(classes.control, classes.position)}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <StyledTextField
              style={{ width: 'calc(50% - 10px)' }}
              type="number"
              value={safeParseFloat(validateBorderRadius(String(radius)))}
              onChange={handleRadiusChange}
              margin="dense"
              className={classes.text}
              disabled={!canEdit}
            />

            <Box sx={{ width: 'calc(50% - 5px)' }}>
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
              <div className={classes.labelTextField}>Radius</div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderBlock;
