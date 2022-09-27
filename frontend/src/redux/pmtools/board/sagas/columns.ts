import * as columnsApi from '@Api/pmtools/board/columnsApi';
import * as tasksApi from '@Api/pmtools/board/tasksApi';
import { BoardColumn } from '@Redux/pmtools/types';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { put, call, select } from 'redux-saga/effects';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as columnActions from '../actions/columns';
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
}: ReturnType<typeof columnActions.fetchBoard>) {
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
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  }
}

export function* updateColumnsOrderSaga({
  payload: { dropResult, projectId },
}: ReturnType<typeof columnActions.updateColumnsOrder>) {
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
}: ReturnType<typeof columnActions.createColumn>) {
  try {
    const { data: createdColumn } = yield call(
      reqWrapper,
      columnsApi.createColumn,
      column,
    );

    yield put(addColumn(createdColumn));
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  }
}

export function* updateColumnSaga({
  column: fields,
  columnId,
}: ReturnType<typeof columnActions.updateColumn>) {
  try {
    yield put(updateColumnOnState(fields, columnId));

    yield call(reqWrapper, columnsApi.updateColumn, {
      fields,
      columnId,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  }
}

export function* deleteColumnSaga({
  columnId,
}: ReturnType<typeof columnActions.deleteColumn>) {
  try {
    yield put(deleteColumnFromState(columnId));

    yield call(reqWrapper, tasksApi.deleteColumn, {
      columnId,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  }
}
