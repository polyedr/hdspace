import React from 'react';
import { ColumnsElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { FormControlLabel } from '@material-ui/core';
import { useDebouncedValueChange } from '@Utils/debounceHooks';

const useStyles = makeStyles({
  wrapper: {
    margin: '1em 0 0 0',
    display: 'flex',
    alignItems: 'flex-start',
  },
  menuItem: {
    textTransform: 'capitalize',
  },
  row: {
    display: 'flex',
    '& > *:first-child': {
      marginRight: '1em',
    },
    width: '100%',
  },
});

const ruleStyles = [
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
] as const;

const ruleWidths = ['thin', 'medium', 'thick'];

type Props = {
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  ruleWidth: React.CSSProperties['columnRuleWidth'];
  ruleStyle: React.CSSProperties['columnRuleStyle'];
  ruleColor: React.CSSProperties['columnRuleColor'];
  activeElementId: PropertiesChangeProps<ColumnsElement>['activeElementId'];
  canEdit: boolean;
};

const ColumnRule: React.FC<Props> = ({
  updateStyles,
  activeElementId,
  ruleWidth,
  ruleStyle,
  ruleColor = 'transparent',
  canEdit,
}) => {
  const classes = useStyles();

  const [ruleColorValue, handleRuleColorChange] = useDebouncedValueChange(
    ruleColor,
    (newRuleColor) => {
      updateStyles({ columnRuleColor: newRuleColor });
    },
  );

  return (
    <>
      <FormControlLabel
        className={classes.wrapper}
        label="Column Rule"
        labelPlacement="top"
        control={
          <div className={classes.row}>
            <StyledTextField
              fullWidth
              label="Rule Style"
              value={ruleStyle || 'initial'}
              margin="dense"
              onChange={({ target: { value } }) =>
                updateStyles({ columnRuleStyle: value })
              }
              select
              disabled={!canEdit}
            >
              {ruleStyles.map((style) => (
                <MenuItem
                  value={style}
                  key={style}
                  className={classes.menuItem}
                >
                  {style}
                </MenuItem>
              ))}
            </StyledTextField>

            <StyledTextField
              fullWidth
              label="Rule Width"
              value={ruleWidth || 0}
              margin="dense"
              onChange={({ target: { value } }) =>
                updateStyles({ columnRuleWidth: value })
              }
              select
              disabled={!canEdit}
            >
              {ruleWidths.map((width) => (
                <MenuItem
                  value={width}
                  key={width}
                  className={classes.menuItem}
                >
                  {width}
                </MenuItem>
              ))}
            </StyledTextField>
          </div>
        }
      />
      <ColorSettings
        currentColor={ruleColorValue as string}
        activeElementId={activeElementId}
        onChange={handleRuleColorChange as (color: string) => void}
        disabled={!canEdit}
      />
    </>
  );
};

export default ColumnRule;
