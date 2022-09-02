import { BoardColumn, BoardNewTask } from '@Redux/pmtools/types';
import * as tasksApi from '@Api/pmtools/board/tasksApi';
import { call } from 'ramda';
import { DropResult } from 'react-beautiful-dnd';
import { put, select } from 'redux-saga/effects';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { setColumns } from '../actions/columns';
import { selectColumns } from '../selectors';
import { addTask } from '../actions/tasks';

export function* fetchTaskSaga({ taskId }: { taskId: number; type: string }) {
  try {
    const { data } = yield call(reqWrapper, tasksApi.fetchTask, { taskId });
  } catch (error) {
    console.log('fetch task error', error);
  }
}

export function* updateTasksOrderSaga({
  dropResult,
}: {
  dropResult: DropResult;
  type: string;
}) {
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
}: {
  task: BoardNewTask;
  type: string;
}) {
  try {
    const { data: task } = yield call(reqWrapper, tasksApi.createTask, {
      title,
      columnId,
    });

    yield put(addTask(task));
  } catch (error) {
    console.log('task create error', error);
  }
}
