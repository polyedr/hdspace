import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch, FormControlLabel } from '@mui/material';
import { ListElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Ordered: React.FC<PropertiesChangeProps<ListElement>> = ({
  updateParams,
  canEdit,
}) => {
  const classes = useStyles();

  const isOrdered = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).isOrdered,
  );
  const handleSwitchChange = useCallback(() => {
    updateParams({ isOrdered: !isOrdered });
  }, [updateParams, isOrdered]);

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            checked={isOrdered || false}
            onChange={handleSwitchChange}
            disabled={!canEdit}
          />
        }
        label="Is Ordered"
      />
    </div>
  );
};

export default Ordered;
