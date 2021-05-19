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
  },
});

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
        value={enabledPseudoClass || 'not selected'}
        select
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const pseudoClass = e.target.value;
          dispatch(
            setEnabledPseudoClass(
              pseudoClass === 'not selected' ? null : pseudoClass,
            ),
          );
        }}
      >
        <MenuItem value="not selected">
          <em>Not selected</em>
        </MenuItem>
        <MenuItem value="focus">focus</MenuItem>
        <MenuItem value="hover">hover</MenuItem>
        <MenuItem value="active">active</MenuItem>
        <MenuItem value="target">target</MenuItem>
        <MenuItem value="visited">visited</MenuItem>
        <MenuItem value="hover-visible">hover-visible</MenuItem>
        <MenuItem value="focus-within">focus-within</MenuItem>
      </StyledTextField>
    </FormControl>
  );
};

export default PseudoSelectorsSection;
