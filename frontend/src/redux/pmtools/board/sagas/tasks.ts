import * as Board from '@Api/pmtools/board/tasksApi';
import { panelErrorMsg } from '@Redux/actions';
import TYPES from '@Redux/actionTypes';
import { requestAddHistory } from '@Redux/pmtools/activity/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  MoveCardGenerator,
  TasksAddSagaGenerator,
  TasksEditSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, put, select } from 'redux-saga/effects';
import {
  requestAddTask,
  requestDeleteTask,
  requestEditTask,
  requestUpdateCardIndex,
  successUpdateCardIndex,
} from '../actions/tasks';
import { selectColumn } from '../selectors';

export function* taskAddSaga({
  payload: { project, action, ...payload },
}: ReturnType<typeof requestAddTask>): TasksAddSagaGenerator {
  try {
    const task = yield call(reqWrapper, Board.createTask, {
      data: payload,
    });
    yield put({ type: TYPES.ADD_TASK_SUCCESS, payload: task });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskEditSaga({
  payload: { project, action, ...payload },
}: ReturnType<typeof requestEditTask>): TasksEditSagaGenerator {
  try {
    const project = yield select(selectCurrentProjectId);
    const selectedTask = yield call(reqWrapper, Board.updateTask, {
      data: payload,
    });
    yield put({ type: TYPES.EDIT_TASK_SUCCESS, payload: selectedTask });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskDeleteSaga({
  payload: { taskId, action },
}: ReturnType<typeof requestDeleteTask>) {
  try {
    const project: number = yield select(selectCurrentProjectId);
    yield call(reqWrapper, Board.deleteTask, { taskId });
    yield put({ type: TYPES.DELETE_TASK_SUCCESS, payload: taskId });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

// eslint-disable-next-line consistent-return
export function* moveCardToList({
  payload: { destination, source },
}: ReturnType<typeof requestUpdateCardIndex>): MoveCardGenerator {
  try {
    const sourceList = yield select(selectColumn(source.droppableId));
    const destList = yield select(selectColumn(destination.droppableId));
    const card = sourceList.tasks[source.index];
    const [removed] = sourceList.tasks.slice(source.index);

    // ============================
    /* 
     TODO
     source delete removed
     dest add removed
    */

    // ============================
    yield put(
      successUpdateCardIndex({
        destList,
        removed,
        dest: destination.index,
      }),
    );

    // const up = destList.tasks[destination.index - 1];
    // const down = destList.tasks[destination.index + 1];
    // const start = destList.tasks[0];
    // const end = destList.tasks[destList.tasks.length - 1];
    // const pos = up && down && (up.pos + down.pos) / 2;
    // const count = card.id === end.id ? end.pos * 2 : start / 2;

    // yield call(Board.apiMoveCardToList, {
    //   cardId: card.id,
    //   destination: destination.droppableId,
    //   newPos: pos || count,
    // });
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
  }
}
