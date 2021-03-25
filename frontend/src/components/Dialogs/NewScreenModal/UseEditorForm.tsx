import { makeStyles, Button } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    textAlign: 'right',
  },
});

type Props = {
  onClose: (...args: any) => void;
};

const UseEditorForm: FC<Props> = ({ onClose }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        Drag&apos;n&apos;drop or click buttons on the right panel to create
        elements
      </div>

      <div className={classes.actions}>
        <Button variant="contained" color="secondary" onClick={onClose}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default UseEditorForm;
