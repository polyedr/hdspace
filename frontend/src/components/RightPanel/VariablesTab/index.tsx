import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lighten, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FRAMEWORK_VARIABLES } from '@Constants/frameworks/variables';
import Scrollbar from '@Components/UI/Scrollbar';
import { updateCurrentUIFrameworkVariables } from '@Redux/project/actions';
import { selectCurrentUIFramework } from '@Redux/project/selectors/base';
import VarInput from './VarInput';

const useStyles = makeStyles<Theme>(({ palette }) => ({
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
}));

const VariablesTab: React.FC<{}> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const uiFramework = useSelector(selectCurrentUIFramework);
  const defaultVariables = FRAMEWORK_VARIABLES[uiFramework.name];

  const handleVarUpdate = useCallback(
    (name: string, value: string) => {
      dispatch(updateCurrentUIFrameworkVariables({ [name]: value }));
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <Scrollbar autoHeightMin="100%" style={{ height: '100%' }}>
        <div className={classes.wrapper}>
          {Object.keys(defaultVariables).map((varName) => (
            <VarInput
              key={`var-${varName}-input`}
              label={defaultVariables[varName].label}
              name={varName}
              value={
                uiFramework.themeVariables[varName] ||
                defaultVariables[varName].value
              }
              onDelayedChange={handleVarUpdate}
            />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default VariablesTab;
