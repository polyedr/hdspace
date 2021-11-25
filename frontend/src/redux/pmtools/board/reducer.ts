/* eslint-disable no-case-declarations */
import TYPES from '@Redux/actionTypes';
import { BoardState, InviteAction } from '../types';

const initialState: BoardState = {
  board: '',
  columnList: [],
  taskList: [],
};

const boardReducer = (
  state: BoardState = initialState,
  action: InviteAction,
) => {
  switch (action.type) {
    case TYPES.FETCH_COLUMNS_SUCCESS:
      return { ...state, columnList: action.payload };
    case TYPES.ADD_COLUMN_SUCCESS:
      return { ...state, columnList: [...state.columnList, action.payload] };
    case TYPES.EDIT_COLUMN_SUCCESS:
      return {
        ...state,
        columnList: [
          ...state.columnList.map((column) => {
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
        columnList: state.columnList.filter(
          (column) => column.id !== action.payload,
        ),
      };
    case TYPES.FETCH_TASKS_SUCCESS:
      return { ...state, taskList: action.payload };
    case TYPES.ADD_TASK_SUCCESS:
      return { ...state, taskList: [...state.taskList, action.payload] };
    case TYPES.EDIT_TASK_SUCCESS:
      return {
        ...state,
        taskList: [
          ...state.taskList.map((task) => {
            if (task.id === action.payload.id) {
              task.name = action.payload.name;
            }
            return task;
          }),
        ],
      };
    case TYPES.DELETE_TASK_SUCCESS:
      return {
        ...state,
        taskList: state.taskList.filter((task) => task.id !== action.payload),
      };
    case TYPES.UPDATE_CARD_INDEX_SUCCESS:
      const { destList, removed, dest, source, sourceList } = action.payload;
      sourceList.tasks.splice(source, 1);
      destList.tasks.splice(dest, 0, removed);
      return state;

    default:
      return state;
  }
};

export default boardReducer;
