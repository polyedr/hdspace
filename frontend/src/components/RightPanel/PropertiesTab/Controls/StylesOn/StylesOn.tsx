import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
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
          <Switch checked={stylesOn || false} onClick={handleSwitchChange} />
        }
        label="Styles On"
      />
    </div>
  );
};

export default withConfigurableProperties(StylesOn);
