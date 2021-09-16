import { IColumn } from '@Src/types/board/types';
import sortById from '@Utils/sortById';
import { createSelector } from 'reselect';
import { BoardRootState } from '../types';

export const selectColumnList = (state: BoardRootState) =>
  state.board.columnList;

export const selectTaskList = (state: BoardRootState) => state.board.taskList;

export const selectColumn = (id: number) =>
  createSelector(selectColumnList, (columnList) =>
    columnList.find((item: IColumn) => item.id === id),
  );

export const selectLoaderBoard = (state: BoardRootState) =>
  state.board.loaderBoard;

export const selectColumnListWithTasks = createSelector(
  selectColumnList,
  selectTaskList,
  (columnList, taskList) =>
    columnList.map((column: any) => ({
      ...column,
      tasks: sortById(
        taskList.filter((item: any) => item.column === column.id),
      ),
    })),
);
