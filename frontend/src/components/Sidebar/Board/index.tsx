import { Stack, styled, TextField } from '@mui/material';
import fuzzysort from 'fuzzysort';
import {
  fetchBoard,
  updateColumnsOrder,
} from '@Redux/pmtools/board/actions/columns';
import { updateTasksOrder } from '@Redux/pmtools/board/actions/tasks';
import { selectBoard } from '@Redux/pmtools/board/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { selectUserData } from '@Redux/user/selectors';
import Column from './Column';
import { NewColumn } from './NewColumn';
import Members from './Members';

const ContentWrapper = styled('div')(() => ({
  padding: '20px 0 0 65px',
}));

const ContentHeader = styled('div')(() => ({
  padding: '0 0 20px',
}));

const Container = styled('div')(() => ({
  display: 'flex',
  overflow: 'scroll',
  width: '100%',
  height: 'calc(100vh - 127px)',

  '&::-webkit-scrollbar': {
    height: 5,
    background: '#E4E6EB',
    borderRadius: 6,
  },

  '&::-webkit-scrollbar-thumb': {
    background: '#B0B0BD',
    borderRadius: 6,
  },

  '&::-webkit-scrollbar-track': {
    borderRadius: 6,
  },
}));

const StyledForm = styled('div')(() => ({
  position: 'relative',
  width: 309,

  '& input': {
    padding: '7px 14px 7px 40px',
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

const StyledButton = styled(Button)<{ active?: boolean }>(
  ({ active = false, theme }) => ({
    backgroundColor: active ? theme.palette.primary.main : '#F3F4F6',
    color: active ? '#fff' : '#81818E',
    borderRadius: 4,
    boxShadow: 'none',
    textTransform: 'capitalize',

    '&:hover': {
      backgroundColor: active ? theme.palette.primary.main : '#e4e8ef',
      boxShadow: 'none',
    },
  }),
);

const NoContentWrapper = styled('div')({
  textAlign: 'center',
  marginTop: '10%',

  '& p': {
    margin: '10px 0 30px',
  },
});

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  textTransform: 'capitalize',
}));

function Board() {
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');

  const { columns } = useSelector(selectBoard);
  const { id: activeUserId } = useSelector(selectUserData);

  const projectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();

  const handleShowCreateColumn = useCallback(() => {
    setShowCreateColumn(true);
  }, []);

  const handleCloseCreateColumn = useCallback(() => {
    setShowCreateColumn(false);
  }, [setShowCreateColumn]);

  useEffect(() => {
    dispatch(fetchBoard(projectId));
  }, [dispatch, projectId]);

  const toggleFilteredUsers = useCallback(
    (id: number) => {
      const newFilteredUsers = [...filteredUsers];

      const index = filteredUsers.indexOf(id);

      if (index !== -1) {
        newFilteredUsers.splice(index, 1);
      } else {
        newFilteredUsers.push(id);
      }

      setFilteredUsers(newFilteredUsers);
    },
    [setFilteredUsers, filteredUsers],
  );

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
        dispatch(updateColumnsOrder(result, projectId));
        return null;
      }

      dispatch(updateTasksOrder(result));

      return null;
    },
    [projectId],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  const columnsToDisplay = useMemo(() => {
    let filteredColumns = [...columns];

    if (filteredUsers.length) {
      filteredColumns = filteredColumns.map((column) => {
        const tasks = column.tasks.filter((t) =>
          filteredUsers.includes(t.assignee_id ?? 0),
        );

        return {
          ...column,
          tasks,
        };
      });
    }

    if (searchText.trim().length > 0) {
      return filteredColumns.map((column: any) => {
        const searchResults = fuzzysort.go(searchText.trim(), column.tasks, {
          keys: ['title', 'description'],
        });

        return {
          ...column,
          tasks: searchResults.map((r) => r.obj),
        };
      });
    }

    return filteredColumns;
  }, [columns, searchText, filteredUsers, activeUserId]);

  return (
    <>
      <ContentWrapper>
        <ContentHeader>
          <Grid container spacing={2} alignItems="center">
            <Grid item md={8} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <StyledForm>
                  <TextField
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search Task"
                    fullWidth
                  />
                  <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </StyledForm>
                <Members
                  selected={filteredUsers}
                  onSelected={toggleFilteredUsers}
                />
                <StyledButton
                  onClick={() => toggleFilteredUsers(activeUserId)}
                  variant="contained"
                  active={filteredUsers.includes(activeUserId)}
                >
                  Only my tasks
                </StyledButton>
              </Stack>
            </Grid>
            <Grid item md={4} textAlign="right" pr={2}>
              <StyledButton
                onClick={handleShowCreateColumn}
                variant="contained"
              >
                New Column
              </StyledButton>
            </Grid>
          </Grid>
        </ContentHeader>
        {columnsToDisplay.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="board-columns"
              type="board-columns"
              direction="horizontal"
            >
              {(provided) => (
                <Container ref={provided.innerRef} {...provided.droppableProps}>
                  {columnsToDisplay.map((column, index) => (
                    <Column
                      column={column}
                      index={index}
                      key={column.id.toString()}
                    />
                  ))}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <NoContentWrapper>
            <h2>There is no task column in your board yet</h2>
            <p>
              Create new column by clicking on the button below and then add
              tasks in it.
            </p>
            <div>
              <PrimaryButton
                onClick={handleShowCreateColumn}
                variant="contained"
                color="primary"
              >
                New Column
              </PrimaryButton>
            </div>
          </NoContentWrapper>
        )}
      </ContentWrapper>
      <NewColumn
        projectId={projectId}
        open={showCreateColumn}
        onClose={handleCloseCreateColumn}
      />
    </>
  );
}

export default React.memo(Board);
