/* eslint-disable no-case-declarations */
import TYPES from '@Redux/actionTypes';
import { BoardState, InviteAction } from '../types';

const initialState: BoardState = {
  board: null,
  columns: [],
  tasks: [],
  members: [],
};

const boardReducer = (
  state: BoardState = initialState,
  action: InviteAction,
) => {
  switch (action.type) {
    case TYPES.MEMBERS_SAVED_SUCCESS:
      return { ...state, members: action.payload };
    case TYPES.FETCH_COLUMNS_SUCCESS:
      return { ...state, columns: action.payload };
    case TYPES.ADD_COLUMN_SUCCESS:
      return { ...state, columns: [...state.columns, action.payload] };
    case TYPES.EDIT_COLUMN_SUCCESS:
      return {
        ...state,
        columns: [
          ...state.columns.map((column) => {
            if (column.id === action.payload.id) {
              column.name = action.payload.name;
            }
            return column;
          }),
        ],
      };
    case TYPES.BOARD_SAVED_SUCCESS:
      return { ...state, board: action.payload };
    case TYPES.DELETE_COLUMN_SUCCESS:
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.payload),
      };
    case TYPES.FETCH_TASKS_SUCCESS:
      return { ...state, tasks: action.payload };
    case TYPES.ADD_TASK_SUCCESS:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case TYPES.EDIT_TASK_SUCCESS:
      return {
        ...state,
        tasks: [
          ...state.tasks.map((task) => {
            if (task.id === action.payload.id) {
              task.name = action.payload.name;
              task.idMembers = action.payload.idMembers;
            }
            return task;
          }),
        ],
      };
    case TYPES.DELETE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case TYPES.UPDATE_CARD_INDEX_SUCCESS:
      const { tasks } = state;
      const { destList, removed, dest, source, sourceList } = action.payload;
      const taskList = [...tasks];
      sourceList.tasks.splice(source, 1);
      destList.tasks.splice(dest, 0, removed);
      const removeIndex = taskList.findIndex((item) => item.id === removed.id);
      taskList[removeIndex].idList = destList.id;
      return {
        ...state,
        tasks: taskList,
      };
    case TYPES.UPDATE_COLUMN_INDEX_SUCCESS:
      const { columns } = state;
      const {
        dest: destColumnIndex,
        source: sourceColumnIndex,
      } = action.payload;
      const columnsList = [...columns];
      const removedColumn = columnsList.splice(sourceColumnIndex, 1);
      columnsList.splice(destColumnIndex, 0, removedColumn[0]);
      return {
        ...state,
        columns: columnsList,
      };

    default:
      return state;
  }
};

export default boardReducer;
