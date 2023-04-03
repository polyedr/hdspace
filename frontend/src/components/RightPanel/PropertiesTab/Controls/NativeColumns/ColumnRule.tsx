import React from 'react';
import { FormControlLabel, MenuItem } from '@mui/material';
import {
  ColumnsElement,
  PropertiesChangeProps,
  StateElement,
} from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { useColumnControlStyles } from '@Components/RightPanel/PropertiesTab/Controls/NativeColumns/styles';

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

interface Props {
  element: StateElement;
  canEdit: boolean;
  updateStyles: PropertiesChangeProps<ColumnsElement>['updateStyles'];
  removeStyles: PropertiesChangeProps<ColumnsElement>['removeStyles'];
  ruleWidth: React.CSSProperties['columnRuleWidth'];
  ruleStyle: React.CSSProperties['columnRuleStyle'];
  ruleColor: React.CSSProperties['columnRuleColor'];
}

const ColumnRule: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  element,
  ruleWidth,
  ruleStyle,
  ruleColor = 'transparent',
  canEdit,
}) => {
  const classes = useColumnControlStyles();

  const [ruleColorValue, handleRuleColorChange] = useDebouncedValueChange(
    ruleColor,
    (newRuleColor) => {
      updateStyles({ columnRuleColor: newRuleColor });
    },
  );

  return (
    <>
      <FormControlLabel
        classes={{ root: classes.rootLabel, label: classes.label }}
        label="Column Fill"
        labelPlacement="start"
        control={
          <div className={classes.control}>
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
                <MenuItem value={style} key={style}>
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
                <MenuItem value={width} key={width}>
                  {width}
                </MenuItem>
              ))}
            </StyledTextField>
          </div>
        }
      />
      <ColorSettings
        onClick={removeStyles}
        propsToRemove={['columnRuleColor']}
        currentColor={ruleColorValue as string}
        activeElementId={element.id}
        onChange={handleRuleColorChange as (color: string) => void}
        disabled={!canEdit}
      />
    </>
  );
};

export default ColumnRule;
