import { createSelector } from 'reselect';
import { AppReduxState } from '@Redux/types';

export const selectHistory = ({ project }: AppReduxState) =>
  project.control.history;

export const selectLastHistoryRecord = createSelector(
  selectHistory,
  (history) => (!history.length ? null : history[history.length - 1]),
);

export const selectCurrentHistoryRecordIndex = ({ project }: AppReduxState) =>
  project.control.currentHistoryRecord;

export const selectCurrentHistoryRecord = createSelector(
  selectHistory,
  selectCurrentHistoryRecordIndex,
  (history, currentIndex) => (currentIndex < 1 ? null : history[currentIndex]),
);

export const selectCanUndo = createSelector(
  selectCurrentHistoryRecord,
  (record) => record !== null,
);
export const selectCanRedo = createSelector(
  selectLastHistoryRecord,
  selectCurrentHistoryRecord,
  (lastRecord, currentRecord) =>
    lastRecord !== null && lastRecord !== currentRecord,
);
