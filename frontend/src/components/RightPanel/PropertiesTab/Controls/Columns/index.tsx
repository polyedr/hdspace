import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import { useDebouncedCallback } from 'use-debounce';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { ColumnsElement, PropertiesChangeProps } from '../../../../../types';
import { selectCurrentEditableStyles } from '../../../../../redux/project/selectors';
import { StyledTextField } from '../../../../styledComponents';

const useStyles = makeStyles({
  control: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

const ColumnsControls: React.FC<PropertiesChangeProps<ColumnsElement>> = ({
  updateStyles,
}) => {
  const classes = useStyles();
  const count = useSelector(selectCurrentEditableStyles('columnCount'));
  const width = useSelector(selectCurrentEditableStyles('columnWidth')) || 0;
  const fill = useSelector(selectCurrentEditableStyles('columnFill'));
  const gap = useSelector(selectCurrentEditableStyles('columnGap'));
  const ruleWidth = useSelector(selectCurrentEditableStyles('columnRuleWidth'));
  const ruleStyle = useSelector(selectCurrentEditableStyles('columnRuleStyle'));
  const ruleColor = useSelector(selectCurrentEditableStyles('columnRuleColor'));

  const [countState, setCountState] = useState(count);
  useEffect(() => {
    setCountState(count);
  }, [count]);
  const debouncedCount = useDebouncedCallback(
    (value) => updateStyles({ columnCount: value }),
    250,
  );
  const handleCountChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const validValue = +value < 1 ? 1 : +value;
    setCountState(validValue);
    debouncedCount.callback(validValue);
  };

  const [countUnits, setCountUnits] = useState(
    count === 'auto' ? 'auto' : 'units',
  );

  const handleCountUnitsChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    const defaultCount = 2;
    if (value === 'auto') {
      updateStyles({ columnCount: 'auto' });
    } else {
      setCountState(defaultCount);
      updateStyles({ columnCount: defaultCount });
    }
    setCountUnits(value);
  };

  return (
    <div>
      <div className={classes.control}>
        <StyledTextField
          value={countState || 0}
          onChange={handleCountChange}
          label="Column Count"
          margin="dense"
          type={countUnits === 'auto' ? 'text' : 'number'}
          disabled={countUnits === 'auto'}
        />

        <StyledTextField
          value={countUnits}
          onChange={handleCountUnitsChange}
          label="Units"
          margin="dense"
          select
        >
          <MenuItem value="units">Units</MenuItem>
          <MenuItem value="auto">Auto</MenuItem>
        </StyledTextField>
      </div>
      <StyledTextField
        value={parseInt(width.toString())}
        onChange={(ev) => updateStyles({ columnWidth: `${ev.target.value}px` })}
        label="Column Width"
        margin="dense"
        type="number"
      />
      <div>{width}</div>
      <div>{fill}</div>
      <div>{gap}</div>
      <div>{ruleWidth}</div>
      <div>{ruleStyle}</div>
      <div>{ruleColor}</div>
    </div>
  );
};

export default withConfigurableProperties(ColumnsControls);
