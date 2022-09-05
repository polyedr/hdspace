import React from 'react';
import {
  Avatar as MuiAvatar,
  Button as MuiButton,
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
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
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircleIcon from '@mui/icons-material/Circle';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import Comment from './Comments';
import TaskName from './TaskName';

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

const AddIconButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  width: 24,
  height: 24,
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

const Menu = styled(MuiMenu)({
  '& .MuiPaper-root': {
    boxShadow:
      '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08) !important',
  },
});

const StatusDropDownButton = styled(MuiButton)({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'capitalize',
  padding: '0 16px',

  '& .CircleIcon': {
    fontSize: '8px !important',
  },
});

const StatusMenuItem = styled(MuiMenuItem)({
  fontSize: 14,
  fontWeight: 500,
  padding: '8px 16px',

  '& svg': {
    fontSize: 8,
    marginRight: 5,
  },

  '&:first-child': {
    color: '#5064FF',
  },

  '&:nth-child(2)': {
    color: '#81818E',
  },

  '&:nth-child(3)': {
    color: '#1CC09F',
  },

  '&:nth-child(4)': {
    color: '#FAB200',
  },

  '&:hover': {
    backgroundColor: 'rgba(80, 100, 255, 0.1)',
  },
});

const PriorityDropDownButton = styled(MuiButton)({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'capitalize',
  padding: '0 16px',
  color: '#2A2A2D',

  '& .SignalIcon': {
    fontSize: '14px !important',
  },
});

const PriorityMenuItem = styled(MuiMenuItem)({
  fontSize: 14,
  fontWeight: 500,
  padding: '8px 16px',
  color: '#2A2A2D',

  '& svg': {
    fontSize: 16,
    marginRight: 5,
  },

  '&:first-child': {
    '& svg': {
      color: '#EF3052',
    },
  },

  '&:nth-child(2)': {
    '& svg': {
      color: '#EF3052',
    },
  },

  '&:nth-child(3)': {
    '& svg': {
      color: '#FAB200',
    },
  },

  '&:nth-child(4)': {
    '& svg': {
      color: '#5064FF',
    },
  },

  '&:nth-child(5)': {
    '& svg': {
      color: '#5064FF',
    },
  },

  '&:hover': {
    backgroundColor: 'rgba(80, 100, 255, 0.1)',
  },
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

const StatusDropDown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StatusDropDownButton
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<CircleIcon className="CircleIcon" />}
      >
        In Process
      </StatusDropDownButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <StatusMenuItem onClick={handleClose}>
          <CircleIcon fontSize="small" /> In Progress
        </StatusMenuItem>
        <StatusMenuItem onClick={handleClose}>
          <CircleIcon fontSize="small" /> Paused
        </StatusMenuItem>
        <StatusMenuItem onClick={handleClose}>
          <CircleIcon fontSize="small" /> Accepted
        </StatusMenuItem>
        <StatusMenuItem onClick={handleClose}>
          <CircleIcon fontSize="small" /> Waiting for Review
        </StatusMenuItem>
      </Menu>
    </div>
  );
};

const PriorityDropDown = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <PriorityDropDownButton
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<SignalCellularAltIcon className="SignalIcon" />}
      >
        Medium
      </PriorityDropDownButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <PriorityMenuItem onClick={handleClose}>
          <SignalCellularAltIcon fontSize="small" /> Highest
        </PriorityMenuItem>
        <PriorityMenuItem onClick={handleClose}>
          <SignalCellularAltIcon fontSize="small" /> High
        </PriorityMenuItem>
        <PriorityMenuItem onClick={handleClose}>
          <SignalCellularAltIcon fontSize="small" /> Medium
        </PriorityMenuItem>
        <PriorityMenuItem onClick={handleClose}>
          <SignalCellularAltIcon fontSize="small" /> Low
        </PriorityMenuItem>
        <PriorityMenuItem onClick={handleClose}>
          <SignalCellularAltIcon fontSize="small" /> Lowles
        </PriorityMenuItem>
      </Menu>
    </div>
  );
};

const TaskDialog = ({ task, open, onClose }) => {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle display="flex" alignItems="center">
        <TaskName task={task} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <InfoGrid item xs={8}>
            <div className="InfoSection">
              <Stack direction="row" spacing={2} alignItems="center">
                <span>Add Tag</span>
                <AddIconButton variant="text">
                  <AddIcon />
                </AddIconButton>
              </Stack>
              <Stack>
                <span>Description</span>
                <p>Add Description</p>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <span>Related tasks</span>
                <AddIconButton variant="text">
                  <AddIcon />
                </AddIconButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <span>Checklist</span>
                <AddIconButton variant="text">
                  <AddIcon />
                </AddIconButton>
              </Stack>
              <Stack>
                <span>Comments</span>
                <Comment />
              </Stack>
            </div>
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
                      <StatusDropDown />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Due Date
                    </TableCell>
                    <TableCell>
                      <AddIconButton variant="text">
                        <AddIcon />
                      </AddIconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Assignee
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} ml={1.3}>
                        <AssigneeAvatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                        <AssigneeAvatar
                          alt="Travis Howard"
                          src="/static/images/avatar/2.jpg"
                        />
                        <AssigneeAvatar
                          alt="Cindy Baker"
                          src="/static/images/avatar/3.jpg"
                        />
                        <AddIconButton variant="text">
                          <AddIcon />
                        </AddIconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Responsible
                    </TableCell>
                    <TableCell>
                      <AddIconButton variant="text">
                        <AddIcon />
                      </AddIconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Priority
                    </TableCell>
                    <TableCell>
                      <PriorityDropDown />
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
