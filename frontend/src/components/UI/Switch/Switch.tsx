import React from 'react';
import { makeStyles, Switch as MaterialSwitch } from '@material-ui/core';

type Props = {
  checked: boolean;
  onChange(): void;
};

const useStyles = makeStyles({
  switchBase: {
    '&$checked': {
      color: '#18a689',
    },
    '&$checked + $track': {
      backgroundColor: '#18a689',
    },
  },
  checked: {},
  track: {},
});

const Switch = (props: Props) => {
  const classes = useStyles();

  return (
    <MaterialSwitch
      size="small"
      classes={{
        switchBase: classes.switchBase,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
};

export default Switch;
