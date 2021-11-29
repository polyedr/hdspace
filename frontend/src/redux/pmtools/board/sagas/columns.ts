import * as Board from '@Api/pmtools/board/columnApi';
import { apiGetMembersOfBoard, fetchTasks } from '@Api/pmtools/board/tasksApi';
import { panelErrorMsg } from '@Redux/actions';
import { requestAddHistory } from '@Redux/pmtools/activity/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
} from '@Src/types/pmtools/generators';
import { call, put, select } from 'redux-saga/effects';
import * as actions from '../actions/columns';
import { successFetchMembers, successFetchTask } from '../actions/tasks';
import { selectBoardData } from '../selectors';

export function* columnsFetchSaga() {
  try {
    const { id: boardId } = yield select(selectBoardData);
    const columns = yield call(Board.fetchColumns, boardId);
    const tasks = yield call(fetchTasks, boardId);
    const members = yield call(apiGetMembersOfBoard, boardId);
    yield put(successFetchMembers(members));
    yield put(successFetchTask(tasks));
    yield put(actions.successFetchColumn(columns));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnAddSaga({
  payload: { project, name, action },
}: ReturnType<typeof actions.requestAddColumn>): ColumnSagaGenerator {
  try {
    const board = yield call(reqWrapper, Board.apiGetBoard, { project });
    const boardId = JSON.parse(board).id;
    const column = yield call(reqWrapper, Board.createColumn, {
      data: { name, project, id: boardId },
    });
    yield put(actions.successAddColumn(column));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnEditSaga({
  payload: { action, project, ...payload },
}: ReturnType<typeof actions.requestEditColumn>): ColumnSagaGenerator {
  try {
    const data = yield call(reqWrapper, Board.updateColumn, { data: payload });
    yield put(actions.successEditColumn(data));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnDeleteSaga({
  payload: { columnId, action },
}: ReturnType<typeof actions.requestDeleteColumn>): ColumnDeletSagaGenerator {
  try {
    const project: number = yield select(selectCurrentProjectId);
    yield call(reqWrapper, Board.deleteColumn, { columnId });
    yield put(actions.successDeleteColumn(columnId));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
