import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDialog = ({ task, open, onClose }) => {
  return (
    <Dialog TransitionComponent={Transition} open={open} onClose={onClose}>
      <DialogTitle>{task.title}</DialogTitle>
      <DialogContent>some content of the task</DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
