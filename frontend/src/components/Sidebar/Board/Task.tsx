import { styled } from '@mui/material/styles';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled('div')(() => ({
  padding: '10px 12px',
  margin: '0 8px 8px',
  backgroundColor: '#FFFFFF',
  boxShadow:
    '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08)',
  flexGrow: 1,
}));

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {task.text}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
