import { BoardColumn } from '@Redux/pmtools/types';
import { DropResult } from 'react-beautiful-dnd';
import { put, select } from 'redux-saga/effects';
import { setColumns } from '../actions/columns';
import { selectColumns } from '../selectors';

export function* updateTasksOrderSaga({
  dropResult,
}: {
  dropResult: DropResult;
  type: string;
}) {
  const { source, destination } = dropResult;

  if (!destination) {
    return null;
  }

  if (
    source.index === destination?.index &&
    source.droppableId === destination.droppableId
  ) {
    return null;
  }

  const columns: BoardColumn[] = yield select(selectColumns);

  const newColumns = Array.from(columns);

  const sourceColumnIndex = newColumns.findIndex(
    (c) => c.id.toString() === source.droppableId,
  );

  const destinationColumnIndex = newColumns.findIndex(
    (c) => c.id.toString() === destination?.droppableId,
  );

  const sourceTasks = newColumns[sourceColumnIndex].tasks;
  const destinationTasks = newColumns[destinationColumnIndex].tasks;

  destinationTasks.splice(
    destination?.index ?? 0,
    0,
    sourceTasks.splice(source.index, 1)[0],
  );

  yield put(setColumns(newColumns));

  return null;
}
