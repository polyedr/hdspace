import { IColumnData, IServerTaskData } from '@Src/types/pmtools/board';
import { createSelector } from 'reselect';
import { BoardRootState } from '../types';

export const selectColumnList = ({ board }: BoardRootState) => board.columns;
export const selectTaskList = ({ board }: BoardRootState) => board.tasks;
export const selectBoardData = ({ board }: BoardRootState) => board.board;
export const selectMembersData = ({ board }: BoardRootState) => board.members;

export const selectTaskWithMembers = createSelector(
  selectTaskList,
  selectMembersData,
  (tasks, members) => {
    return tasks.map((task) => ({
      ...task,
      members: task.idMembers.map((id) =>
        members.find((m: any) => m?.id === id),
      ),
    }));
  },
);

export const selectColumnListWithTasks = createSelector(
  selectColumnList,
  selectTaskWithMembers,
  (columns, tasks) => {
    return columns.map((column) => ({
      ...column,
      tasks: tasks.filter((task: IServerTaskData) => task.idList === column.id),
    }));
  },
);

export const selectColumn = (value: string) =>
  createSelector(selectColumnListWithTasks, (columns) => {
    return columns.find((column: IColumnData) => column.id === value);
  });
