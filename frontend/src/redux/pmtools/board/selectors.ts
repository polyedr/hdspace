import { IColumnData, IServerTaskData } from '@Src/types/pmtools/trelloTypes';
import { createSelector } from 'reselect';
import { BoardRootState } from '../types';

export const selectColumnList = (state: BoardRootState) =>
  state.board.columnList;

export const selectTaskList = (state: BoardRootState) => state.board.taskList;

export const selectBoardData = (state: BoardRootState) => state.board.board;

export const selectColumnListWithTasks = createSelector(
  selectColumnList,
  selectTaskList,
  (columnList, taskList) => {
    return columnList.map((l: IColumnData) => ({
      ...l,
      tasks: taskList.filter((card: IServerTaskData) => card.idList === l.id),
    }));
  },
);

export const selectColumn = (value: string) =>
  createSelector(selectColumnListWithTasks, (columnList) => {
    return columnList.find((item: IColumnData) => item.id === value);
  });
