import { createReducer, Handlers } from 'reduxsauce';
import TYPES from '@Redux/actionTypes';
import * as columnActions from './actions/columns';
import { BoardState } from '../types';

const INITIAL_STATE: BoardState = {
  fetching: true,
  columns: [],
  members: [],
  tasks: [],
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
    columns,
  };
};

const setColumnsFetching: ActionHandler<
  ReturnType<typeof columnActions.setColumnsFetching>
> = (state = INITIAL_STATE, { fetching }) => ({
  ...state,
  fetching,
});

const HANDLERS: Handlers<BoardState> = {
  [TYPES.BOARD_SET_COLUMNS]: setColumns,
  [TYPES.BOARD_FETCH_COLUMNS_PENDING]: setColumnsFetching,
};

export default createReducer(INITIAL_STATE, HANDLERS);
