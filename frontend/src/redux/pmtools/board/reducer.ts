import { createReducer, Handlers } from 'reduxsauce';
import TYPES from '@Redux/actionTypes';
import * as columnActions from './actions/columns';
import * as taskActions from './actions/tasks';
import { BoardAction, BoardState } from '../types';

const INITIAL_STATE: BoardState = {
  fetching: true,
  columns: [],
  members: [],
  activeTask: null,
};

interface ActionHandler<T> {
  (state: BoardState, action: T): BoardState;
}

const setColumns: ActionHandler<ReturnType<typeof columnActions.setColumns>> = (
  state = INITIAL_STATE,
  { columns },
) => {
  return {
    ...state,
    columns: columns.map((column: any) => {
      column.tasks = column?.hasOwnProperty('tasks') ? column.tasks : [];
      return column;
    }),
  };
};

const setTasks: ActionHandler<ReturnType<typeof taskActions.setTasks>> = (
  state = INITIAL_STATE,
  { tasks },
) => {
  return {
    ...state,
    columns: state.columns.map((column) => {
      column.tasks = tasks.filter((t) => t.column === column.id);
      return column;
    }),
  };
};

const addTask: ActionHandler<ReturnType<typeof taskActions.addTask>> = (
  state = INITIAL_STATE,
  { task },
) => {
  const newState = { ...state };

  const columnIndex = state.columns.findIndex((c) => c.id === task.column);

  newState.columns[columnIndex].tasks.unshift(task);

  return newState;
};

const setTask: ActionHandler<ReturnType<typeof taskActions.setTask>> = (
  state = INITIAL_STATE,
  { task },
) => {
  const newState = { ...state };

  const columnIndex = state.columns.findIndex((c) => c.id === task.column);
  const taskIndex = state.columns[columnIndex].tasks.findIndex(
    (t) => t.id === task.id,
  );

  newState.columns[columnIndex].tasks[taskIndex] = {
    ...newState.columns[columnIndex].tasks[taskIndex],
    ...task,
  };

  return newState;
};

const setColumnsFetching: ActionHandler<
  ReturnType<typeof columnActions.setColumnsFetching>
> = (state = INITIAL_STATE, { fetching }) => ({
  ...state,
  fetching,
});

const addColumn: ActionHandler<ReturnType<typeof columnActions.addColumn>> = (
  state = INITIAL_STATE,
  { column },
) => {
  const newState = { ...state };

  column.tasks = [];
  newState.columns.push(column);

  return newState;
};

const updateColumn: ActionHandler<
  ReturnType<typeof columnActions.updateColumnOnState>
> = (state = INITIAL_STATE, { column, columnId }) => {
  const columnIndex = state.columns.findIndex((c) => c.id === columnId);

  state.columns[columnIndex] = {
    ...state.columns[columnIndex],
    ...column,
  };

  return {
    ...state,
  };
};

const deleteColumn: ActionHandler<
  ReturnType<typeof columnActions.deleteColumnFromState>
> = (state = INITIAL_STATE, { columnId }) => {
  return {
    ...state,
    columns: state.columns.filter((c) => c.id !== columnId),
  };
};

const HANDLERS: Handlers<BoardState> = {
  [TYPES.BOARD_SET_COLUMNS]: setColumns,
  [TYPES.BOARD_FETCH_COLUMNS_PENDING]: setColumnsFetching,
  [TYPES.BOARD_SET_TASKS]: setTasks,
  [TYPES.BOARD_ADD_TASK]: addTask,
  [TYPES.BOARD_SET_TASK]: setTask,
  [TYPES.BOARD_ADD_COLUMN]: addColumn,
  [TYPES.BOARD_DELETE_COLUMN_FROM_STATE]: deleteColumn,
  [TYPES.BOARD_UPDATE_COLUMN_ON_STATE]: updateColumn,
};

export default createReducer<BoardState, BoardAction>(INITIAL_STATE, HANDLERS);
