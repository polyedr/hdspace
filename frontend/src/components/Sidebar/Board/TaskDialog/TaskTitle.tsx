import React, { useCallback, useState } from 'react';
import { Button as MuiButton, Grid, Input } from '@mui/material';
import { styled } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import { BoardTask } from '@Redux/pmtools/types';

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

interface Props {
  task: BoardTask;
  onChange(title: string): void;
}

const TaskTitle = ({ task, onChange }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);

  const handleChangeTaskTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTaskTitle(e.target.value);
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
    onChange(taskTitle.trim());
    setEditMode(false);
  }, []);

  return (
    <>
      {editMode ? (
        <>
          <Input value={taskTitle} onChange={handleChangeTaskTitle} />
          <IconButton
            disabled={taskTitle.trim().length < 1}
            onClick={handleSaveTitle}
            variant="text"
          >
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

          {/* <Grid container alignItems="center">
            <Grid item xs={6} display="flex" alignItems="center">
              {task.title}
              <EditIconButton onClick={handleSetEditMode(true)} variant="text">
                <EditIcon />
              </EditIconButton>
            </Grid>
            <Grid item xs={6} textAlign="right" pr={2}>
              <NotificationsIcon className="BellIcon" />
              <ShareIcon />
              <SettingsIcon />
              {/* {onClose ? (
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : null} *
            </Grid>
          </Grid> */}
        </>
      )}
    </>
  );
};

export default TaskTitle;
