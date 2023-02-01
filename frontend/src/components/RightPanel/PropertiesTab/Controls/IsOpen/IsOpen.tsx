import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, FormControlLabel } from '@mui/material';
import { DropdownElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const IsOpen: React.FC<PropertiesChangeProps<DropdownElement>> = ({
  updateParams,
  canEdit,
}) => {
  const isOpen = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).isOpen,
  );
  const classes = useStyles();
  const handleSwitchChange = () => {
    updateParams({ isOpen: !isOpen });
  };

  return (
    <div className={classes.wrapper}>
      <FormControlLabel
        control={
          <Switch
            checked={isOpen || false}
            onChange={handleSwitchChange}
            disabled={!canEdit}
          />
        }
        label="Is Open"
      />
    </div>
  );
};

export default IsOpen;
