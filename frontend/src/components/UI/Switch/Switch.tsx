import React from 'react';
import { makeStyles, Switch } from '@material-ui/core';

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

const SwitchComponent = (props: Props) => {
  const classes = useStyles();

  return (
    <Switch
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

export { SwitchComponent as Switch };
