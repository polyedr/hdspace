import { styled, TextField } from '@mui/material';
import { fetchBoard } from '@Redux/pmtools/board/actions/columns';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
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

const ContentWrapper = styled('div')(() => ({
  padding: '50px 0 0 50px',
}));

const ContentHeader = styled('div')(() => ({
  padding: '0 0 20px',
}));

const Container = styled('div')(() => ({
  display: 'flex',
}));

const StyledForm = styled('div')(() => ({
  position: 'relative',

  '& input': {
    padding: '10px 14px 10px 40px',
  },

  '& .MuiIconButton-root': {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',

    '& svg': {
      color: '#81818E',
      fontSize: 18,

      '&:focus': {
        backgroundColor: 'none',
      },
    },
  },
}));

const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    fontSize: 16,
  },
}));

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#F3F4F6',
  color: '#81818E',
  borderRadius: 4,

  '&:hover': {
    backgroundColor: '#e4e8ef',
  },
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
    <ContentWrapper>
      <ContentHeader>
        <Grid container spacing={2} alignItems="center">
          <Grid item md={2}>
            <StyledForm>
              <TextField type="text" placeholder="Search Task" />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </StyledForm>
          </Grid>
          <Grid item md={2}>
            <StyledAvatarGroup max={4}>
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ width: 32, height: 32 }}
              />
              <Avatar
                alt="Travis Howard"
                src="/static/images/avatar/2.jpg"
                sx={{ width: 32, height: 32 }}
              />
              <Avatar
                alt="Cindy Baker"
                src="/static/images/avatar/3.jpg"
                sx={{ width: 32, height: 32 }}
              />
              <Avatar
                alt="Agnes Walker"
                src="/static/images/avatar/4.jpg"
                sx={{ width: 32, height: 32 }}
              />
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
                sx={{ width: 32, height: 32 }}
              />
            </StyledAvatarGroup>
          </Grid>
          <Grid item md={2}>
            <StyledButton variant="contained">Only my tasks</StyledButton>
          </Grid>
          <Grid item md={5} style={{ textAlign: 'right' }}>
            <StyledButton variant="contained">New Column</StyledButton>
          </Grid>
        </Grid>
      </ContentHeader>
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
    </ContentWrapper>
  );
};

export default Board;
