import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DropdownElement, PropertiesChangeProps } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const IsOpen: React.FC<PropertiesChangeProps<DropdownElement>> = ({
  updateParams,
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
          <Switch checked={isOpen || false} onChange={handleSwitchChange} />
        }
        label="Is Open"
      />
    </div>
  );
};

export default IsOpen;
