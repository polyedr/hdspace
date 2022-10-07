import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createTask } from '@Redux/pmtools/board/actions/tasks';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import { deleteColumn } from '@Redux/pmtools/board/actions/columns';
import Task from './Task';
import { EditColumn } from './EditColumn';

const NewTaskButton = styled(ButtonBase)(() => ({
  width: '100% !important',
  textAlign: 'center',
  padding: '8px 14px 8px 8px',
  backgroundColor: '#E4E6EB',
  borderRadius: 4,
  color: '#81818E',

  '&:hover': {
    color: '#2A2A2D',
  },
}));

const Container = styled('div')(() => ({
  width: '309px',
  minWidth: '309px',
  backgroundColor: '#F3F4F6',
  marginRight: 16,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 145px)',
  paddingBottom: 20,
}));

const ColumnHeader = styled('div')<{ cardColor: string }>(({ cardColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `3px solid #${cardColor}`,
  borderRadius: '4px 4px 0px 0px',
}));

const ColumnTitle = styled('div')(() => ({
  flex: 1,
  '& h3': {
    fontSize: 14,
    fontWeight: 500,
    height: 48,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    margin: '0',
  },
}));

const ButtonWrapper = styled('div')(() => ({
  margin: '0 8px 8px',
}));

const NewTaskInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#5064FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5064FF',
    },
  },
});

const TasksContainer = styled('div')<{ isDraggingOver: boolean }>(() => {
  return {
    flexGrow: 1,
    overflow: 'auto',
    height: '100%',
    '&::-webkit-scrollbar': {
      width: 4,
      background: '#E4E6EB',
      borderRadius: 6,
    },

    '&::-webkit-scrollbar-thumb': {
      background: '#B0B0BD',
      borderRadius: 4,
    },

    '&::-webkit-scrollbar-track': {
      borderRadius: 4,
      backgroundClip: 'content-box',
    },
  };
});

const StyledMenu = styled(Menu)(() => ({
  '& .MuiMenuItem-root': {
    minHeight: '40px',
    fontSize: 14,
  },
  '& svg': {
    color: '#81818E',
    marginRight: '8px',
  },
}));

const Tasks = ({ column }) => {
  return (
    <Droppable droppableId={column.id.toString()} type="tasks">
      {(provided, snapshot) => (
        <TasksContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
        >
          {column.tasks.map((task, index) => (
            <Task task={task} key={task.id} index={index} />
          ))}
          {provided.placeholder}
        </TasksContainer>
      )}
    </Droppable>
  );
};

const Column = ({ column, index }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [showDelete, setShowDelete] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);

  const dispatch = useDispatch();

  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');

  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, []);

  const handleHideInput = useCallback(() => {
    setShowInput(false);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleCreateTask = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && title.trim().length) {
        dispatch(createTask({ title, columnId: column.id }));
        setTitle('');
      }
    },
    [title, setTitle, column],
  );

  const handleChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  const handleCloseEditColumn = useCallback(() => {
    setShowEditColumn(false);
  }, [setShowEditColumn]);

  const handleShowEditColumn = useCallback(() => {
    setShowEditColumn(true);
    setAnchorEl(null);
  }, [setShowEditColumn]);

  const handleShowDelete = useCallback(() => {
    setShowDelete(true);
    setAnchorEl(null);
  }, [setShowDelete]);

  const handleDeleteColumn = useCallback(() => {
    dispatch(deleteColumn(column.id));
  }, [column]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <>
      <Draggable index={index} draggableId={column.id.toString()}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <ColumnHeader cardColor={column.colour || 'F3F4F6'}>
              <ColumnTitle {...provided.dragHandleProps}>
                <h3>
                  {column.title} ({column.tasks.length})
                </h3>
              </ColumnTitle>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              <StyledMenu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleShowEditColumn}>
                  <EditIcon fontSize="small" />
                  Edit Column
                </MenuItem>
                <MenuItem onClick={handleShowDelete}>
                  <DeleteOutlineIcon fontSize="small" />
                  Delete Column
                </MenuItem>
              </StyledMenu>
            </ColumnHeader>
            <ButtonWrapper>
              <NewTaskButton onClick={handleShowInput}>
                <AddIcon sx={{ fontSize: 16 }} /> New Task
              </NewTaskButton>
            </ButtonWrapper>
            {showInput && (
              <NewTaskInput
                type="text"
                autoFocus
                onKeyUp={handleCreateTask}
                onBlur={handleHideInput}
                placeholder="Type Task Name"
                size="small"
                value={title}
                onChange={handleChangeTitle}
                sx={{ mx: 1, mb: 1, backgroundColor: '#fff' }}
              />
            )}
            <Tasks column={column} />
          </Container>
        )}
      </Draggable>
      <ConfirmModal
        show={showDelete}
        action={handleDeleteColumn}
        elementText="column"
        actionText="delete"
        hide={() => setShowDelete(false)}
      />
      <EditColumn
        open={showEditColumn}
        column={column}
        onClose={handleCloseEditColumn}
      />
    </>
  );
};

export default Column;
