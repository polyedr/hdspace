import { call } from 'ramda';
import { put, select } from 'redux-saga/effects';
import { BoardColumn } from '@Redux/pmtools/types';
import * as tasksApi from '@Api/pmtools/board/tasksApi';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as taskActions from '../actions/tasks';
import { setColumns } from '../actions/columns';
import { selectColumns } from '../selectors';

export function* fetchTaskSaga({
  taskId,
}: ReturnType<typeof taskActions.fetchTask>) {
  try {
    const { data } = yield call(reqWrapper, tasksApi.fetchTask, { taskId });

    yield put(taskActions.setTask(data));
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

export function* updateTaskSags({
  payload: { task, fields },
}: ReturnType<typeof taskActions.updateTask>) {
  try {
    yield put(taskActions.setTask({ ...task, ...fields }));

    const { data } = yield call(reqWrapper, tasksApi.updateTask, {
      taskId: task.id,
      fields,
    });

    yield put(taskActions.setTask(data));
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

export function* updateTasksOrderSaga({
  dropResult,
}: ReturnType<typeof taskActions.updateTasksOrder>) {
  const { source, destination, draggableId } = dropResult;

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

  if (source.droppableId !== destination.droppableId) {
    yield call(reqWrapper, tasksApi.updateTask, {
      taskId: draggableId,
      fields: {
        column: destination.droppableId,
      },
    });

    yield call(reqWrapper, tasksApi.updateTasksSequence, {
      columnId: destination.droppableId,
      data: {
        children: destinationTasks.map((t) => ({ id: t.id })),
      },
    });
  }

  yield call(reqWrapper, tasksApi.updateTasksSequence, {
    columnId: source.droppableId,
    data: {
      children: sourceTasks.map((t) => ({ id: t.id })),
    },
  });

  return null;
}

export function* createTaskSaga({
  task: { title, columnId },
}: ReturnType<typeof taskActions.createTask>) {
  try {
    const { data: task } = yield call(reqWrapper, tasksApi.createTask, {
      title,
      columnId,
    });

    yield put(taskActions.addTask(task));
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
