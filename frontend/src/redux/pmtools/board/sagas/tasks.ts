import * as Board from '@Api/pmtools/board/tasksApi';
import {
  addMemberToTasks,
  deleteMemberToTasks,
} from '@Api/pmtools/board/tasksApi';
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
import { ServerProject } from '@Src/types';
import { call, put, select } from 'redux-saga/effects';
import {
  requestAddTask,
  requestDeleteMemberTask,
  requestDeleteTask,
  requestEditTask,
  requestUpdateCardIndex,
  successUpdateCardIndex,
} from '../actions/tasks';
import { selectColumn } from '../selectors';

export function* taskDeleteMemberSaga({
  payload: { cardId, userId },
}: ReturnType<typeof requestDeleteMemberTask>): TasksAddSagaGenerator {
  try {
    yield call(deleteMemberToTasks, cardId, userId);
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskAddSaga({
  payload: { project, action, email, ...payload },
}: ReturnType<typeof requestAddTask>): TasksAddSagaGenerator {
  try {
    const task = yield call(reqWrapper, Board.createTask, {
      data: payload,
    });
    if (email) {
      // @ts-ignore
      const member = yield call(addMemberToTasks, task.id, email);
      task.idMembers = member.map((item: any) => item.id);
    }
    yield put({ type: TYPES.ADD_TASK_SUCCESS, payload: task });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* taskEditSaga({
  payload: { project, action, email, ...payload },
}: ReturnType<typeof requestEditTask>): TasksEditSagaGenerator {
  try {
    const project: ServerProject['id'] = yield select(selectCurrentProjectId);
    const selectedTask = yield call(reqWrapper, Board.updateTask, {
      data: payload,
    });
    if (email && !selectedTask.idMembers.find((id) => id === email)) {
      const members = yield call(addMemberToTasks, payload.id, email);
      selectedTask.idMembers = members.map((item: any) => item.id);
    }
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
    const project: ServerProject['id'] = yield select(selectCurrentProjectId);
    yield call(reqWrapper, Board.deleteTask, { taskId });
    yield put({ type: TYPES.DELETE_TASK_SUCCESS, payload: taskId });
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* moveCardToList({
  payload: { destination, source },
}: ReturnType<typeof requestUpdateCardIndex>): MoveCardGenerator {
  try {
    const sourceList = yield select(selectColumn(source.droppableId));
    const destList = yield select(selectColumn(destination.droppableId));
    const removed = sourceList.tasks[source.index];
    yield put(
      successUpdateCardIndex({
        destList,
        removed,
        dest: destination.index,
        sourceList,
        source: source.index,
      }),
    );

    const up = destList.tasks[destination.index - 1];
    const down = destList.tasks[destination.index + 1];
    const start = destList.tasks[0];
    const end = destList.tasks[destList.tasks.length - 1];
    const pos = up && down && (up.pos + down.pos) / 2;
    const count = removed.id === end.id ? end.pos * 2 : start.pos / 2;
    yield call(Board.apiMoveCardToList, {
      cardId: removed.id,
      destination: destination.droppableId,
      newPos: pos || count,
    });
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
