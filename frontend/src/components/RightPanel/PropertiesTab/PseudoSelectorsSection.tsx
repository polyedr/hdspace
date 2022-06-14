import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectEnabledPseudoClass } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import { setEnabledPseudoClass } from '@Redux/project/actions';

const useStyles = makeStyles({
  root: {
    padding: '1em',
    width: '100%',
    backgroundColor: '#ffffff',
  },
});

const PSEUDO_CLASS_VALUES = [
  'Not selected',
  'focus',
  'hover',
  'active',
  'target',
  'visited',
  'focus-within',
];

const PseudoSelectorsSection = () => {
  const dispatch = useDispatch();
  const enabledPseudoClass = useSelector(selectEnabledPseudoClass);
  const classes = useStyles();

  useEffect(
    () => () => {
      dispatch(setEnabledPseudoClass(null));
    },
    [dispatch],
  );

  return (
    <FormControl className={classes.root}>
      <StyledTextField
        label="Pseudo-class"
        margin="dense"
        value={enabledPseudoClass || 'Not selected'}
        select
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const pseudoClass = e.target.value;
          dispatch(
            setEnabledPseudoClass(
              pseudoClass === 'Not selected' ? null : pseudoClass,
            ),
          );
        }}
      >
        {PSEUDO_CLASS_VALUES.map((value) => {
          return (
            <MenuItem value={value} key={value}>
              {value}
            </MenuItem>
          );
        })}
      </StyledTextField>
    </FormControl>
  );
};

export default PseudoSelectorsSection;
