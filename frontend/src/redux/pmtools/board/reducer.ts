import { createReducer, Handlers } from 'reduxsauce';
import TYPES from '@Redux/actionTypes';
import * as columnActions from './actions/columns';
import * as taskActions from './actions/tasks';
import * as commentActions from './actions/comments';
import * as labelsActions from './actions/labels';
import * as checklistActions from './actions/checklist';
import { BoardAction, BoardState, BoardTask } from '../types';

const INITIAL_STATE: BoardState = {
  fetching: true,
  columns: [],
  members: [],
  labels: [],
  activeTask: null,
};

type ActionHandler<T> = (state: BoardState, action: T) => BoardState;

function findColumnIndex(state: BoardState, columnId: number) {
  return state.columns.findIndex((c) => c.id === columnId);
}

function findTaskIndex(state: BoardState, task: BoardTask) {
  const columnIndex = findColumnIndex(state, task.column);
  return state.columns[columnIndex].tasks.findIndex((t) => t.id === task.id);
}

const setColumnsFetching: ActionHandler<
  ReturnType<typeof columnActions.setColumnsFetching>
> = (state = INITIAL_STATE, { fetching }) => ({
  ...state,
  fetching,
});

// columns

const addColumn: ActionHandler<ReturnType<typeof columnActions.addColumn>> = (
  state = INITIAL_STATE,
  { column },
) => {
  const columns = [...state.columns];

  column.tasks = [];
  columns.push(column);

  return {
    ...state,
    columns,
  };
};

const updateColumn: ActionHandler<
  ReturnType<typeof columnActions.updateColumnOnState>
> = (state = INITIAL_STATE, { column, columnId }) => {
  const columnIndex = findColumnIndex(state, columnId);

  const newColumns = [...state.columns];

  newColumns[columnIndex] = {
    ...state.columns[columnIndex],
    ...column,
  };

  return {
    ...state,
    columns: newColumns,
  };
};

const deleteColumn: ActionHandler<
  ReturnType<typeof columnActions.deleteColumnFromState>
> = (state = INITIAL_STATE, { columnId }) => ({
  ...state,
  columns: state.columns.filter((c) => c.id !== columnId),
});

const setColumns: ActionHandler<ReturnType<typeof columnActions.setColumns>> = (
  state = INITIAL_STATE,
  { columns },
) => ({
  ...state,
  columns: columns.map((column: any) => {
    column.tasks = Object.prototype.hasOwnProperty.call(column, 'tasks')
      ? column.tasks
      : [];
    return column;
  }),
});

// tasks

const setTasks: ActionHandler<ReturnType<typeof taskActions.setTasks>> = (
  state = INITIAL_STATE,
  { tasks },
) => ({
  ...state,
  columns: state.columns.map((column) => {
    column.tasks = tasks.filter((t) => t.column === column.id);
    return column;
  }),
});

const removeTask: ActionHandler<ReturnType<typeof taskActions.addTask>> = (
  state = INITIAL_STATE,
  { task },
) => {
  const newState = { ...state };
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  newState.columns[columnIndex].tasks.splice(taskIndex, 1);
  return newState;
};

const addTask: ActionHandler<ReturnType<typeof taskActions.addTask>> = (
  state = INITIAL_STATE,
  { task },
) => {
  const newState = { ...state };

  const columnIndex = findColumnIndex(state, task.column);

  newState.columns[columnIndex].tasks.unshift(task);

  return newState;
};

const setTask: ActionHandler<ReturnType<typeof taskActions.setTask>> = (
  state = INITIAL_STATE,
  { task },
) => {
  const newState = { ...state };

  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  newState.columns[columnIndex].tasks[taskIndex] = {
    ...newState.columns[columnIndex].tasks[taskIndex],
    ...task,
  };

  return newState;
};

// comments

const addComment: ActionHandler<
  ReturnType<typeof commentActions.addComment>
> = (state = INITIAL_STATE, { comment, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  newState.columns[columnIndex].tasks[taskIndex].comments = [
    comment,
    ...(newState.columns[columnIndex].tasks[taskIndex].comments ?? []),
  ];

  return newState;
};

const updateComment: ActionHandler<
  ReturnType<typeof commentActions.commentUpdated>
> = (state = INITIAL_STATE, { comment: partialComment, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  const comments =
    newState.columns[columnIndex].tasks[taskIndex].comments ?? [];

  const commentIndex = comments.findIndex((c) => c.id === partialComment.id);

  comments[commentIndex] = {
    ...comments[commentIndex],
    ...partialComment,
  };

  newState.columns[columnIndex].tasks[taskIndex].comments = [...comments];

  return newState;
};

const removeComment: ActionHandler<
  ReturnType<typeof commentActions.removeComment>
> = (state = INITIAL_STATE, { commentId, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  const { comments } = newState.columns[columnIndex].tasks[taskIndex];

  newState.columns[columnIndex].tasks[taskIndex].comments = comments?.filter(
    (c) => c.id !== commentId,
  );

  return newState;
};

// labels

const addProjectLabels: ActionHandler<
  ReturnType<typeof labelsActions.setProjectLabels>
> = (state = INITIAL_STATE, { labels }) => ({
  ...state,
  labels,
});

const addProjectLabel: ActionHandler<
  ReturnType<typeof labelsActions.addProjectLabel>
> = (state = INITIAL_STATE, { label }) => ({
  ...state,
  labels: [...state.labels, label],
});

const deleteProjectLabel: ActionHandler<
  ReturnType<typeof labelsActions.projectLabelDeleted>
> = (state = INITIAL_STATE, { id }) => ({
  ...state,
  labels: state.labels.filter((l) => l.id !== id),
});

// checklist
const addChecklistItem: ActionHandler<
  ReturnType<typeof checklistActions.checklistItemCreated>
> = (state = INITIAL_STATE, { item, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  const { checklist } = newState.columns[columnIndex].tasks[taskIndex];

  newState.columns[columnIndex].tasks[taskIndex].checklist = [
    ...checklist,
    item,
  ];

  return newState;
};

const updateChecklistItem: ActionHandler<
  ReturnType<typeof checklistActions.checklistItemUpdated>
> = (state = INITIAL_STATE, { item, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  const checklist = [
    ...newState.columns[columnIndex].tasks[taskIndex].checklist,
  ];

  const itemIndex = checklist.findIndex((c) => c.id === item.id);

  const updatedItem = {
    ...checklist[itemIndex],
    ...item,
  };

  checklist[itemIndex] = updatedItem;

  newState.columns[columnIndex].tasks[taskIndex].checklist = checklist;

  return newState;
};

const deleteChecklistItem: ActionHandler<
  ReturnType<typeof checklistActions.checklistItemDeleted>
> = (state = INITIAL_STATE, { itemId, task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };

  const { checklist } = newState.columns[columnIndex].tasks[taskIndex];

  newState.columns[columnIndex].tasks[taskIndex].checklist = checklist.filter(
    (c) => c.id !== itemId,
  );

  return newState;
};

const deleteChecklist: ActionHandler<
  ReturnType<typeof checklistActions.checklistDeleted>
> = (state = INITIAL_STATE, { task }) => {
  const columnIndex = findColumnIndex(state, task.column);
  const taskIndex = findTaskIndex(state, task);

  const newState = { ...state };
  newState.columns[columnIndex].tasks[taskIndex].checklist = [];

  return newState;
};

const HANDLERS: Handlers<BoardState> = {
  [TYPES.BOARD_SET_COLUMNS]: setColumns,
  [TYPES.BOARD_FETCH_COLUMNS_PENDING]: setColumnsFetching,
  [TYPES.BOARD_SET_TASKS]: setTasks,
  [TYPES.BOARD_REMOVE_TASK]: removeTask,
  [TYPES.BOARD_ADD_TASK]: addTask,
  [TYPES.BOARD_SET_TASK]: setTask,
  [TYPES.BOARD_ADD_COLUMN]: addColumn,
  [TYPES.BOARD_DELETE_COLUMN_FROM_STATE]: deleteColumn,
  [TYPES.BOARD_UPDATE_COLUMN_ON_STATE]: updateColumn,

  [TYPES.BOARD_TASK_ADD_COMMENT]: addComment,
  [TYPES.BOARD_TASK_COMMENT_UPDATED]: updateComment,
  [TYPES.BOARD_TASK_REMOVE_COMMENT]: removeComment,

  [TYPES.BOARD_SET_PROJECT_LABELS]: addProjectLabels,
  [TYPES.BOARD_ADD_PROJECT_LABEL]: addProjectLabel,
  [TYPES.BOARD_PROJECT_LABEL_DELETED]: deleteProjectLabel,

  [TYPES.BOARD_CHECKLIST_ITEM_CREATED]: addChecklistItem,
  [TYPES.BOARD_CHECKLIST_ITEM_UPDATED]: updateChecklistItem,
  [TYPES.BOARD_CHECKLIST_ITEM_DELETED]: deleteChecklistItem,
  [TYPES.BOARD_CHECKLIST_DELETED]: deleteChecklist,
};

export default createReducer<BoardState, BoardAction>(INITIAL_STATE, HANDLERS);
