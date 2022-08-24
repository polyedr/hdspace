import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Task from './Task';

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
  width: 309,
  backgroundColor: '#F3F4F6',
  marginRight: 16,
  borderRadius: '4px 4px 0px 0px',
  display: 'flex',
  flexDirection: 'column',
}));

const ColumnHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ColumnTitle = styled('h3')(() => ({
  fontSize: 14,
  fontWeight: 500,
  height: 48,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  margin: '0',
}));

const ButtonWrapper = styled('div')(() => ({
  margin: '0 8px 8px',
}));

const TasksContainer = styled('div')<{ isDraggingOver: boolean }>(() => {
  return {
    flexGrow: 1,
    // backgroundColor: isDraggingOver ? 'red' : 'initial',
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Draggable index={index} draggableId={column.id.toString()}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <ColumnHeader>
            <div {...provided.dragHandleProps}>
              <ColumnTitle>{column.title}</ColumnTitle>
            </div>
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
              <MenuItem>
                <EditIcon fontSize="small" />
                Edit Column
              </MenuItem>
              <MenuItem>
                <DeleteOutlineIcon fontSize="small" />
                Delete Column
              </MenuItem>
            </StyledMenu>
          </ColumnHeader>
          <ButtonWrapper>
            <NewTaskButton>
              <AddIcon fontSize="small" /> New Task
            </NewTaskButton>
          </ButtonWrapper>
          <Tasks column={column} />
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
