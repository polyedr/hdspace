import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { StyledTextField } from '@Components/styledComponents';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

interface Props {
  label: string;
  name: string;
  value: string;
  onDelayedChange: (name: string, value: string) => void;
}

const useStyles = makeStyles({
  var: {
    width: '100%',
    margin: '0.5em 0',
  },
});

const VarInput: React.FC<Props> = ({ label, name, value, onDelayedChange }) => {
  const classes = useStyles();

  const [varValue, handleVarValueChange] = useDebouncedInputChange(
    value || NOT_SELECTED_FRAMEWORK.themeVariables[name] || '',
    (newVarValue) => {
      onDelayedChange(name, newVarValue);
    },
    500,
  );
  return (
    <StyledTextField
      key={`var-${name}`}
      className={classes.var}
      label={label}
      value={varValue}
      onChange={handleVarValueChange}
    />
  );
};

export default VarInput;
