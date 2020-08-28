import React from 'react';
import { Checkbox as MaterialCheckbox, makeStyles } from '@material-ui/core';

type Props = {
  name: string;
  checked: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void;
};

const useStyles = makeStyles({
  root: {
    color: '#1cc09f',
    '&$checked': {
      color: '#1cc09f',
    },
  },
  checked: {},
});

const Checkbox: React.FC<Props> = ({ checked, name, onChange }) => {
  const classes = useStyles();

  return (
    <MaterialCheckbox
      color="default"
      className={classes.root}
      name={name}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default Checkbox;
