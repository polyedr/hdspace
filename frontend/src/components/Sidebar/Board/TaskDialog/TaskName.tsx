import React, { useCallback, useState } from 'react';
import { Button as MuiButton, Grid, Input } from '@mui/material';
import { styled } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const IconButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginLeft: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'auto',

  '& svg': {
    color: '#81818E',
    fontSize: 16,
  },
});

const TaskName = ({ task }) => {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);

  const handleChangeTaskTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTaskTitle(e.target.value.trim());
    },
    [],
  );

  const handleSetEditMode = useCallback(
    (mode: boolean) => {
      return () => setEditMode(mode);
    },
    [setEditMode],
  );

  const handleSaveTitle = useCallback(() => {
    // TODO: save title logic
  }, []);

  return (
    <>
      {editMode ? (
        <>
          <Input value={taskTitle} onChange={handleChangeTaskTitle} />
          <IconButton onClick={handleSaveTitle} variant="text">
            <CheckIcon />
          </IconButton>
          <IconButton onClick={handleSetEditMode(false)} variant="text">
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          {task.title}
          <IconButton onClick={handleSetEditMode(true)} variant="text">
            <EditIcon />
          </IconButton>
        </>
      )}
    </>
  );
};

export default TaskName;
