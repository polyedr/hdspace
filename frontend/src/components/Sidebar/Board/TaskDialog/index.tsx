import React, { useCallback, useEffect, useState } from 'react';
import {
  Avatar as MuiAvatar,
  Button as MuiButton,
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableRow,
  TextField as MuiTextField,
  IconButton as MuiIconButton,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { fetchTask, updateTask } from '@Redux/pmtools/board/actions/tasks';
import { BoardTask } from '@Redux/pmtools/types';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import Comment from './Comments';
import TaskTitle from './TaskTitle';
import DueDate from './DueDate';
import { IconButton } from './StyledComponents';
import Priority from './Priority';
import Status from './Status';
import MemberPicker from './MemberPicker';
import Description from './Description';
import Tags from './Tags';
import Checklist from './Checklist';
import ProgressBar from './Checklist/ProgressBar';

const Dialog = styled(MuiDialog)({
  '& .MuiPaper-root': {
    minWidth: '420px',
    height: '656px',
    borderRadius: 6,
  },
});

const ActionIconwrapper = styled(MuiIconButton)({
  '& svg': {
    fontSize: 20,
    fill: '#81818E',
  },

  '&:hover': {
    '& svg': {
      fill: '#FAB200',
    },
  },
});

const InfoWrapper = styled('div')({
  overflowY: 'scroll',
  height: '590px',
  paddingRight: 24,

  '&::-webkit-scrollbar': {
    width: 4,
    background: '#F3F4F6',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#B0B0BD',
    borderRadius: 4,
  },

  '&::-webkit-scrollbar-track': {
    borderRadius: 4,
  },
});

const InfoTitle = styled('span')({
  color: '#81818E',
  fontSize: 14,
  fontWeight: 500,
  margin: '16px 0',
});

const AuthorAvatar = styled(MuiAvatar)({
  width: 24,
  height: 24,
  fontSize: 14,
});

const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    '& input': {
      padding: '6.5px 14px',
    },
    '& fieldset': {
      borderColor: '#E4E6EB !important',
    },
    '&:hover fieldset': {
      borderColor: 'var(--blue)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E4E6EB',
    },
  },
});

const StandardTextField = styled(MuiTextField)({
  '& .MuiInputBase-root:before': {
    borderColor: '#E4E6EB',
  },

  '& input': {
    maxWidth: 64,
  },
});

const TableCell = styled(MuiTableCell)({
  padding: '10px',
  border: 0,
  color: '#81818E',
  fontSize: 14,
});

const AuthorButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  borderRadius: '16px',
  height: 24,
  padding: 0,

  '& span': {
    padding: '3px 8px 3px 3px',
    color: '#2A2A2D',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

const RemoveButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  boxShadow: 'none',
  fontSize: 12,
  textTransform: 'capitalize',
  color: '#81818E',

  '&:hover': {
    boxShadow: 'none',
  },
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  task: BoardTask;
  open: boolean;
  onClose(): void;
}

const TaskDialog = ({ task, open, onClose }: Props) => {
  const dispatch = useDispatch();

  const [storyPoints, setStoryPoints] = useState(task.story_points.toString());
  const [time, setTime] = useState(task.time);

  useEffect(() => {
    if (open) {
      dispatch(fetchTask(task.id));
    }
  }, [open, dispatch]);

  const handleUpdateTask = useCallback(
    (field: keyof BoardTask, value) =>
      dispatch(updateTask(task, { [field]: value })),
    [task],
  );

  const handleChangeStoryPoints = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.match('^[0-9\\.\\-]+$') || e.target.value === '') {
        setStoryPoints(e.target.value);
      }
    },
    [setStoryPoints],
  );

  const handleChangeTime = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.match('^[0-9\\.\\-]+$') || e.target.value === '') {
        setTime(e.target.value);
      }
    },
    [setTime],
  );

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <Grid container alignItems="center">
        <Grid item xs={8}>
          <DialogTitle display="flex" alignItems="center">
            <TaskTitle
              onChange={(title) => handleUpdateTask('title', title)}
              task={task}
            />
          </DialogTitle>
        </Grid>
        <Grid item xs={4}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
            mr={2}
          >
            <ActionIconwrapper>
              <NotificationsIcon />
            </ActionIconwrapper>
            <ActionIconwrapper>
              <ShareIcon />
            </ActionIconwrapper>
            <ActionIconwrapper>
              <SettingsIcon />
            </ActionIconwrapper>
            <ActionIconwrapper>
              <CloseIcon />
            </ActionIconwrapper>
          </Stack>
        </Grid>
      </Grid>

      <DialogContent sx={{ paddingTop: 0 }}>
        <Grid container spacing={2} height="100%">
          <Grid item xs={8}>
            <InfoWrapper>
              <Tags
                task={task}
                onChange={(labels) => handleUpdateTask('label_ids', labels)}
              />
              <Stack>
                <InfoTitle>Description</InfoTitle>
                <Description
                  onSubmit={(desc) => handleUpdateTask('description', desc)}
                  task={task}
                />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <InfoTitle>Related tasks</InfoTitle>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <InfoTitle>Checklist</InfoTitle>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Stack>
                <ProgressBar />
                <RemoveButton variant="contained" color="inherit" size="small">
                  Remove
                </RemoveButton>
              </Stack>
              <Checklist />
              <Stack>
                <InfoTitle>Comments</InfoTitle>
                <Comment task={task} />
              </Stack>
            </InfoWrapper>
          </Grid>
          <Grid item xs={4}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Status
                    </TableCell>
                    <TableCell>
                      <Status
                        onChange={(status) =>
                          handleUpdateTask('status', status)
                        }
                        task={task}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Due Date
                    </TableCell>
                    <TableCell>
                      <DueDate
                        date={task.due_date}
                        onChange={(date) => handleUpdateTask('due_date', date)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Assignee
                    </TableCell>
                    <TableCell>
                      <MemberPicker
                        selected={task?.assignee_id?.toString()}
                        onChange={(member) =>
                          handleUpdateTask('assignee_id', member?.id)
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Responsible
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MemberPicker
                          selected={task?.responsible_id?.toString()}
                          onChange={(member) =>
                            handleUpdateTask('responsible_id', member?.id)
                          }
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Priority
                    </TableCell>
                    <TableCell>
                      <Priority
                        onChange={(priority) =>
                          handleUpdateTask('priority', priority)
                        }
                        task={task}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Story Points
                    </TableCell>
                    <TableCell>
                      <StandardTextField
                        value={storyPoints}
                        onChange={handleChangeStoryPoints}
                        onBlur={() =>
                          handleUpdateTask('story_points', storyPoints)
                        }
                        type="text"
                        variant="standard"
                        autoComplete="off"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Time
                    </TableCell>
                    <TableCell>
                      <StandardTextField
                        onChange={handleChangeTime}
                        type="text"
                        variant="standard"
                        autoComplete="off"
                        onBlur={() => handleUpdateTask('time', time)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Author
                    </TableCell>
                    <TableCell>
                      <AuthorButton variant="text">
                        <AuthorAvatar
                          alt={`${task.author.first_name} ${task.author.last_name}`}
                          src={task.author.profile_avatar}
                        />
                        <span>{`${task.author.first_name} ${task.author.last_name}`}</span>
                      </AuthorButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
