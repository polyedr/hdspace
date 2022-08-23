import { styled } from '@mui/material';
import { fetchBoard } from '@Redux/pmtools/board/actions/columns';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import Column from './Column';

const initialData = [
  {
    id: 'todo',
    text: 'Todo',
    tasks: [
      {
        id: 'task-1',
        text: 'Task 1',
      },
      {
        id: 'task-2',
        text: 'Task 2',
      },
      {
        id: 'task-3',
        text: 'Task 3',
      },
      {
        id: 'task-4',
        text: 'Task 4',
      },
    ],
  },
  {
    id: 'in-progress',
    text: 'In Progress',
    tasks: [],
  },
  {
    id: 'done',
    text: 'Done',
    tasks: [],
  },
];

const Container = styled('div')(() => ({
  display: 'flex',
  padding: '100px',
}));

const Board = () => {
  const [boardState, setBoardState] = useState(initialData);

  const projectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoard());
  }, [dispatch, projectId]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination) {
        return null;
      }

      if (
        source.index === destination?.index &&
        source.droppableId === destination.droppableId
      ) {
        return null;
      }

      if (result.type === 'board-columns') {
        setBoardState((boardState) => {
          const newBoardState = Array.from(boardState);

          newBoardState.splice(
            destination.index,
            0,
            newBoardState.splice(source.index, 1)[0],
          );
          return newBoardState;
        });

        return null;
      }

      setBoardState((boardState) => {
        const newBoardState = Array.from(boardState);

        const sourceColumnIndex = newBoardState.findIndex(
          (c) => c.id === source.droppableId,
        );

        const destinationColumnIndex = newBoardState.findIndex(
          (c) => c.id === destination?.droppableId,
        );

        const sourceTasks = newBoardState[sourceColumnIndex].tasks;
        const destinationTasks = newBoardState[destinationColumnIndex].tasks;

        destinationTasks.splice(
          destination?.index ?? 0,
          0,
          sourceTasks.splice(source.index, 1)[0],
        );

        return newBoardState;
      });

      return null;
    },
    [setBoardState],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="board-columns"
        type="board-columns"
        direction="horizontal"
      >
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {boardState.map((column, index) => (
              <Column column={column} index={index} key={column.id} />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
