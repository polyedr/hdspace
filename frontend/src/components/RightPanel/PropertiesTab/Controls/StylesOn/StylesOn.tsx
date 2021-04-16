import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, FormControlLabel } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Entity, PropertiesChangeProps, SmartElement } from '@Src/types';
import { selectActiveElementParams } from '@Redux/project/selectors/element';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const StylesOn: React.FC<PropertiesChangeProps<SmartElement<Entity>>> = ({
  updateParams,
  canEdit,
}) => {
  const { stylesOn } = useSelector(selectActiveElementParams);
  const classes = useStyles();
  const handleSwitchChange = () => {
    updateParams({ stylesOn: !stylesOn });
  };

  return (
    <div className={classes.wrapper}>
      <FormControlLabel
        control={
          <Switch
            checked={stylesOn || false}
            onClick={handleSwitchChange}
            disabled={!canEdit}
          />
        }
        label="Styles On"
      />
    </div>
  );
};

export default StylesOn;
