import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import { ListElement, PropertiesChangeProps } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

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
        control={<Switch checked={isOrdered} onChange={handleSwitchChange} />}
        label="Is Ordered"
      />
    </div>
  );
};

export default withConfigurableProperties(Ordered);
