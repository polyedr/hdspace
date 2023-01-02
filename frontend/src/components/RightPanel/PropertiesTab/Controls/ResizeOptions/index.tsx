import React, { useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { FormControlLabel, Switch } from '@mui/material';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ResizeOptionsControl: React.FC<
  PropertiesChangeProps<LibraryElement<Entity>>
> = ({ updateParams, canEdit, element }) => {
  const classes = useStyles();

  const { keepAspectRatio } = element.parameters;

  const handleSwitchChange = useCallback(() => {
    updateParams({ keepAspectRatio: !keepAspectRatio });
  }, [keepAspectRatio, updateParams]);

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Switch
            checked={keepAspectRatio || false}
            onChange={handleSwitchChange}
            disabled={!canEdit}
          />
        }
        label="Keep Aspect Ratio"
      />
    </div>
  );
};

export default ResizeOptionsControl;
