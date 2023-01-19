import React, { useCallback, useState } from 'react';
import {
  Box,
  IconButton as MuiIconButton,
  TextareaAutosize,
} from '@mui/material';
import { styled } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { BoardTask } from '@Redux/pmtools/types';

const IconButton = styled(MuiIconButton)({
  backgroundColor: '#F3F4F6 !important',
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginLeft: '10px !important',
  minWidth: 'auto',

  '& svg': {
    color: '#81818E',
    fontSize: 16,
  },
});

interface Props {
  task: BoardTask;
  onChange: (title: string) => void;
}

function TaskTitle({ task, onChange }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle] = useState(task.title);

  // const handleChangeTaskTitle = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setTaskTitle(e.target.value);
  //   },
  //   [],
  // );

  const handleSetEditMode = useCallback(
    (mode: boolean) => () => setEditMode(mode),
    [setEditMode],
  );

  const handleSaveTitle = useCallback(() => {
    onChange(taskTitle.trim());
    setEditMode(false);
  }, [taskTitle]);

  return (
    <>
      {editMode ? (
        <>
          <TextareaAutosize
            value={taskTitle}
            // onChange={handleChangeTaskTitle}
            style={{
              width: 'calc(100% - 90px)',
              border: 'none',
              minHeight: 40,
              borderBottom: '1px solid #000',
              outline: 'none',
            }}
          />
          <Box>
            <IconButton
              disabled={taskTitle.trim().length < 1}
              onClick={handleSaveTitle}
              // variant="text"
            >
              <CheckIcon />
            </IconButton>
            <IconButton onClick={handleSetEditMode(false)}>
              {/* <CancelIcon /> */}
              <CloseIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          {task.title}
          <IconButton onClick={handleSetEditMode(true)}>
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
}

export default TaskTitle;
