import React, { useEffect } from 'react';
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
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { fetchTask } from '@Redux/pmtools/board/actions/tasks';
import Comment from './Comments';
import TaskTitle from './TaskTitle';
import DueDate from './DueDate';
import { IconButton } from './StyledComponents';
import Priority from './Priority';
import Status from './Status';
import MemberPicker from './MemberPicker';
import Description from './Description';
import Tags from './Tags';

const Dialog = styled(MuiDialog)({
  '& .MuiPaper-root': {
    minWidth: '420px',
    minHeight: '656px',
    borderRadius: 6,
  },
});

const InfoGrid = styled(Grid)({
  '& .Infosection': {
    overflowY: 'scroll',
    maxHeight: 'calc(100vh - 200px)',
  },

  '& span': {
    color: '#81818E',
    fontSize: 14,
    fontWeight: 500,
    margin: '16px 0',
  },

  '& p': {
    fontSize: 16,
    color: '#81818E',
  },
});

const AssigneeAvatar = styled(MuiAvatar)({
  width: 24,
  height: 24,
  fontSize: 14,
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDialog = ({ task, open, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(fetchTask(task.id));
    }
  }, [open, dispatch]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle display="flex" alignItems="center">
        <TaskTitle task={task} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <InfoGrid item xs={8}>
            <Tags />
            <Stack>
              <Description />
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <span>Related tasks</span>
              <IconButton>
                <AddIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <span>Checklist</span>
              <IconButton>
                <AddIcon />
              </IconButton>
            </Stack>
            <Stack>
              <span>Comments</span>
              <Comment />
            </Stack>
          </InfoGrid>
          <Grid item xs={4}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Status
                    </TableCell>
                    <TableCell>
                      <Status />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Due Date
                    </TableCell>
                    <TableCell>
                      <DueDate />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Assignee
                    </TableCell>
                    <TableCell>
                      <MemberPicker />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Responsible
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MemberPicker />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Priority
                    </TableCell>
                    <TableCell>
                      <Priority />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Story Points
                    </TableCell>
                    <TableCell>
                      <TextField type="number" variant="standard" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Time
                    </TableCell>
                    <TableCell>
                      <TextField type="number" variant="standard" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Author
                    </TableCell>
                    <TableCell>
                      <AuthorButton variant="text">
                        <AuthorAvatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                        <span>Aleksandra Sayapina</span>
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
