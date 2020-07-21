import React from 'react';
import { Checkbox, makeStyles } from '@material-ui/core';

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

const CheckboxComponent = (props: Props) => {
  const { checked, name, onChange } = props;

  const classes = useStyles();

  return (
    <Checkbox
      color="default"
      className={classes.root}
      name={name}
      checked={checked}
      onChange={onChange}
    />
  );
};

export { CheckboxComponent as Checkbox };
