import * as columnsApi from '@Api/pmtools/board/columnsApi';
import { BoardColumn } from '@Redux/pmtools/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { DropResult } from 'react-beautiful-dnd';
import { put, call, select } from 'redux-saga/effects';
import { setColumns, setColumnsFetching, setTasks } from '../actions/columns';
import { selectColumns } from '../selectors';

export function* fetchBoard({
  projectId,
}: {
  projectId: number;
  type: string;
}) {
  yield put(setColumnsFetching(true));

  try {
    const {
      data: { projectcolumn: columns },
    } = yield call(reqWrapper, columnsApi.fetchColumns, {
      projectId,
    });

    yield put(setColumns(columns));

    const {
      data: { results: tasks },
    } = yield call(reqWrapper, columnsApi.fetchTasks, {
      projectId,
    });

    yield put(setTasks(tasks));

    yield put(setColumnsFetching(false));
  } catch (err) {
    console.log(err);
  }
}

export function* updateColumnsOrderSaga({
  dropResult,
}: {
  dropResult: DropResult;
  type: string;
}) {
  const { source, destination } = dropResult;

  if (!destination) {
    return;
  }

  if (
    source.index === destination?.index &&
    source.droppableId === destination.droppableId
  ) {
    return;
  }

  const columns: BoardColumn[] = yield select(selectColumns);

  const newColumns = Array.from(columns);

  newColumns.splice(
    destination.index,
    0,
    newColumns.splice(source.index, 1)[0],
  );

  yield put(setColumns(newColumns));
}
