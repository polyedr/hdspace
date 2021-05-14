import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { selectCurrentUIFramework } from '@Redux/project/selectors/screen';
import { FRAMEWORK_VARIABLES } from '@Constants/frameworks/variables';
import { StyledTextField } from '@Components/styledComponents';
import Scrollbar from '@Components/UI/Scrollbar';
import { updateCurrentUIFrameworkVariables } from '@Redux/project/actions';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    textTransform: 'none',
    '&.Mui-selected': {
      backgroundColor: palette.panel.light,
    },
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.03),
    },
    height: '100%',
    padding: '1em',
  },
  wrapper: {
    height: '100%',
  },
  var: {
    width: '100%',
    margin: '0.5em 0',
  },
}));

const VariablesTab: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const uiFramework = useSelector(selectCurrentUIFramework);
  const defaultVariables = FRAMEWORK_VARIABLES[uiFramework.name];

  const handleVariableChange = useCallback(
    (varName, varValue) => {
      dispatch(
        updateCurrentUIFrameworkVariables({
          [varName]: varValue,
        }),
      );
    },
    [dispatch],
  );

  const delayedVariableChange = useDebouncedCallback(handleVariableChange, 750);

  return (
    <div className={classes.root}>
      <Scrollbar autoHeightMin="100%" style={{ height: '100%' }}>
        <div className={classes.wrapper}>
          {Object.keys(defaultVariables).map((varName) => (
            <StyledTextField
              key={`var-${varName}`}
              className={classes.var}
              label={defaultVariables[varName].label}
              value={
                uiFramework.themingVariables[varName] ||
                defaultVariables[varName].value
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                delayedVariableChange.callback(varName, event.target.value);
              }}
            />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default VariablesTab;
