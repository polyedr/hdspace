import * as columnsApi from '@Api/pmtools/board/columnsApi';
import * as tasksApi from '@Api/pmtools/board/tasksApi';
import * as labelsApi from '@Api/pmtools/board/labelsApi';
import { BoardColumn, BoardNewColumn } from '@Redux/pmtools/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { DropResult } from 'react-beautiful-dnd';
import { put, call, select } from 'redux-saga/effects';
import {
  addColumn,
  deleteColumnFromState,
  setColumns,
  setColumnsFetching,
  updateColumnOnState,
} from '../actions/columns';
import { setTasks } from '../actions/tasks';
import { selectColumns } from '../selectors';
import { setProjectLabels } from '../actions/labels';

export function* fetchBoard({
  projectId,
}: {
  projectId: number;
  type: string;
}) {
  yield put(setColumnsFetching(true));

  try {
    const {
      data: { projectcolumn: columns, tasklabels: labels },
    } = yield call(reqWrapper, columnsApi.fetchColumns, {
      projectId,
    });

    yield put(setColumns(columns));
    yield put(setProjectLabels(labels));

    const {
      data: { results: tasks },
    } = yield call(reqWrapper, tasksApi.fetchTasks, {
      projectId,
    });

    yield put(setTasks(tasks));

    yield put(setColumnsFetching(false));
  } catch (err) {
    console.log(err);
  }
}

export function* updateColumnsSequence({ projectId }: { projectId: string }) {
  const columns: BoardColumn[] = yield select(selectColumns);

  yield call(reqWrapper, columnsApi.updateColumnsSequence, {
    contentType: 'application/json',
    projectId,
    data: {
      children: columns.map((c) => ({ id: c.id })),
    },
  });
}

export function* updateColumnsOrderSaga({
  payload: { dropResult, projectId },
}: {
  payload: {
    projectId: number;
    dropResult: DropResult;
  };
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

  yield call(reqWrapper, columnsApi.updateColumnsSequence, {
    projectId,
    data: {
      children: newColumns.map((c) => ({ id: c.id })),
    },
  });
}

export function* createColumnSaga({
  column,
}: {
  column: BoardNewColumn;
  type: string;
}) {
  try {
    const { data: createdColumn } = yield call(
      reqWrapper,
      columnsApi.createColumn,
      column,
    );

    yield put(addColumn(createdColumn));
  } catch (error) {
    console.log('create column error', error);
  }
}

export function* updateColumnSaga({
  column: fields,
  columnId,
}: {
  column: BoardNewColumn;
  columnId: number;
  type: string;
}) {
  try {
    yield put(updateColumnOnState(fields, columnId));

    yield call(reqWrapper, columnsApi.updateColumn, {
      fields,
      columnId,
    });
  } catch (error) {
    console.log('update column error', error);
  }
}

export function* deleteColumnSaga({
  columnId,
}: {
  columnId: number;
  type: string;
}) {
  try {
    yield put(deleteColumnFromState(columnId));

    yield call(reqWrapper, tasksApi.deleteColumn, {
      columnId,
    });
  } catch (error) {
    console.log('delete column error', error);
  }
}
