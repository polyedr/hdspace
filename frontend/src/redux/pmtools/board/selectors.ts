import { ColumnData } from '@Src/types/pmtools/types';
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
  (columnList, taskList) => {
    return columnList.map((l: any) => ({
      ...l,
      tasks: taskList.filter((card: any) => card.idList === l.id),
    }));
  },
);
