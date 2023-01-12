import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, FormControlLabel } from '@mui/material';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { ButtonElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Ripple: React.FC<PropertiesChangeProps<ButtonElement>> = ({
  updateParams,
  canEdit,
}) => {
  const classes = useStyles();
  const showRipple = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).showRipple,
  );

  const handleSwitchChange = () => {
    updateParams({ showRipple: !showRipple });
  };

  return (
    <div className={classes.wrapper}>
      <FormControlLabel
        control={
          <Switch
            checked={showRipple || false}
            onChange={handleSwitchChange}
            disabled={!canEdit}
          />
        }
        label="Show Ripple"
      />
    </div>
  );
};

export default Ripple;
