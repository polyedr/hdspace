import TYPES from '@Redux/actionTypes';
import { BoardState, InviteAction } from '../types';

const initialState: BoardState = {
  columnList: [],
  taskList: [],
  loaderBoard: false,
};

const boardReducer = (
  state: BoardState = initialState,
  action: InviteAction,
) => {
  switch (action.type) {
    case TYPES.LOADER_BOARD:
      return { ...state, loaderBoard: action.payload };
    case TYPES.SUCCESS_FETCH_COLUMNS:
      return { ...state, columnList: action.payload };
    case TYPES.SUCCESS_ADD_COLUMN:
      return { ...state, columnList: [...state.columnList, action.payload] };
    case TYPES.SUCCESS_EDIT_COLUMN:
      return {
        ...state,
        columnList: [
          ...state.columnList.filter(
            (column) => column.id !== action.payload.id,
          ),
          action.payload,
        ],
      };
    case TYPES.SUCCESS_DELETE_COLUMN:
      return {
        ...state,
        columnList: state.columnList.filter(
          (column) => column.id !== action.payload,
        ),
      };
    case TYPES.SUCCESS_FETCH_TASKS:
      return { ...state, taskList: action.payload };
    case TYPES.SUCCESS_ADD_TASK:
      return { ...state, taskList: [...state.taskList, action.payload] };
    case TYPES.SUCCESS_EDIT_TASK:
      return {
        ...state,
        taskList: [
          ...state.taskList.filter((task) => task.id !== action.payload.id),
          action.payload,
        ],
      };
    case TYPES.SUCCESS_DELETE_TASK:
      return {
        ...state,
        taskList: state.taskList.filter((task) => task.id !== action.payload),
      };

    default:
      return state;
  }
};

export default boardReducer;
