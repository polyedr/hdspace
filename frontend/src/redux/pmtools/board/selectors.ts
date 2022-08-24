// eslint-disable-next-line import/no-cycle
import { BoardRootState } from '../types';

export const selectBoard = (state: BoardRootState) => state.board;

export const selectColumns = (state: BoardRootState) => state.board.columns;
