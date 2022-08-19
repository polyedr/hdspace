import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Task from './Task';

const NewTaskButton = styled(ButtonBase)(() => ({
  width: '100% !important',
  textAlign: 'center',
  padding: '8px 14px 8px 8px',
  backgroundColor: '#E4E6EB',
  borderRadius: 4,
}));

const Container = styled('div')(() => ({
  width: 260,
  backgroundColor: '#F3F4F6',
  marginRight: 16,
  borderRadius: '4px 4px 0px 0px',
  display: 'flex',
  flexDirection: 'column',
}));

const ColumnHeader = styled('h3')(() => ({
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

const Tasks = ({ column }) => {
  return (
    <Droppable droppableId={column.id} type="tasks">
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
  return (
    <Draggable index={index} draggableId={column.id}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <div {...provided.dragHandleProps}>
            <ColumnHeader>{column.text}</ColumnHeader>
          </div>
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
