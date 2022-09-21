// eslint-disable-next-line import/no-cycle
import { createSelector } from 'reselect';
import { BoardRootState, BoardState, BoardTask } from '../types';

export const selectBoard = (state: BoardRootState) => state.board;

export const selectComments = (task: BoardTask) =>
  createSelector(selectBoard, (board: BoardState) => {
    const columnIndex = board.columns.findIndex((c) => c.id === task.column);
    const taskIndex = board.columns[columnIndex].tasks.findIndex(
      (t) => t.id === task.id,
    );

    return board.columns[columnIndex].tasks[taskIndex].comments ?? [];
  });

export const selectColumns = (state: BoardRootState) => state.board.columns;

export const selectLabels = (state: BoardRootState) => state.board.labels;
