import { ColumnData, TaskData } from '@Src/types/pmtools/types';
import sortById from '@Utils/sortById';
import { createSelector } from 'reselect';
import { BoardRootState } from '../types';

export const selectColumnList = (state: BoardRootState) =>
  state.board.columnList;

export const selectTaskList = (state: BoardRootState) => state.board.taskList;

export const selectColumn = (id: ColumnData['id']) =>
  createSelector(selectColumnList, (columnList) =>
    columnList.find((item: ColumnData) => item.id === id),
  );

export const selectColumnListWithTasks = createSelector(
  selectColumnList,
  selectTaskList,
  (columnList, taskList) =>
    columnList.map((column: ColumnData) => ({
      ...column,
      tasks: sortById(
        taskList.filter((item: TaskData) => item.column === column.id),
      ),
    })),
);
