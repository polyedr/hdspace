import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ListElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Ordered: React.FC<PropertiesChangeProps<ListElement>> = ({
  updateParams,
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
          <Switch checked={isOrdered || false} onChange={handleSwitchChange} />
        }
        label="Is Ordered"
      />
    </div>
  );
};

export default Ordered;
