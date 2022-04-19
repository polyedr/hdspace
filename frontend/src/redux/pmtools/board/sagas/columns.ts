import { apiGetBoard } from '@Api/pmtools/board/boardApi';
import * as Board from '@Api/pmtools/board/columnApi';
import { apiGetMembersOfBoard, fetchTasks } from '@Api/pmtools/board/tasksApi';
import { panelErrorMsg } from '@Redux/actions';
import { requestAddHistory } from '@Redux/pmtools/activity/actions';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import {
  ColumnDeletSagaGenerator,
  ColumnSagaGenerator,
  MoveCardGenerator,
} from '@Src/types/pmtools/generators';
import { ServerProject } from '@Src/types';
import { call, put, select } from 'redux-saga/effects';
import {
  requestAddColumn,
  requestDeleteColumn,
  requestEditColumn,
  successAddColumn,
  successDeleteColumn,
  successEditColumn,
  successFetchColumn,
  requestUpdateColumnIndex,
  successUpdateColumnIndex,
} from '../actions/columns';
import { successFetchMembers, successFetchTask } from '../actions/tasks';
import { selectBoardData, selectColumnList } from '../selectors';

export function* columnsFetchSaga() {
  try {
    const { id: boardId } = yield select(selectBoardData);
    const columns = yield call(Board.fetchColumns, boardId);
    const tasks = yield call(fetchTasks, boardId);
    const members = yield call(apiGetMembersOfBoard, boardId);
    yield put(successFetchMembers(members));
    yield put(successFetchTask(tasks));
    yield put(successFetchColumn(columns));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnAddSaga({
  payload: { project, name, action },
}: ReturnType<typeof requestAddColumn>): ColumnSagaGenerator {
  try {
    const board = yield call(reqWrapper, apiGetBoard, { project });
    const boardId = JSON.parse(board).id;
    const column = yield call(reqWrapper, Board.createColumn, {
      data: { name, project, id: boardId },
    });
    yield put(successAddColumn(column));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnEditSaga({
  payload: { action, project, ...payload },
}: ReturnType<typeof requestEditColumn>): ColumnSagaGenerator {
  try {
    const data = yield call(reqWrapper, Board.updateColumn, { data: payload });
    yield put(successEditColumn(data));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* columnDeleteSaga({
  payload: { columnId, action },
}: ReturnType<typeof requestDeleteColumn>): ColumnDeletSagaGenerator {
  try {
    const project: ServerProject['id'] = yield select(selectCurrentProjectId);
    yield call(reqWrapper, Board.deleteColumn, { columnId });
    yield put(successDeleteColumn(columnId));
    yield put(requestAddHistory({ project, ...action }));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}

export function* moveColumnToList({
  payload: { destination, source },
}: ReturnType<typeof requestUpdateColumnIndex>): MoveCardGenerator {
  const columns = yield select(selectColumnList);
  const removed = columns[source.index];
  try {
    yield put(
      successUpdateColumnIndex({
        dest: destination.index,
        source: source.index,
      }),
    );
    const upIndex =
      source.index > destination.index
        ? destination.index - 1
        : destination.index;
    const up = columns[upIndex];
    const down = columns[upIndex + 1];
    const start = columns[0];
    const end = columns[columns.length - 1];
    const pos = up && down && (up.pos + down.pos) / 2;
    const count =
      destination.index === columns.length - 1 ? end.pos * 2 : start.pos / 2;
    yield call(Board.apiUpdateColumnPos, {
      listId: removed.id,
      newPos: pos || count,
    });
    const res = yield call(Board.fetchColumns, removed.idBoard);
    yield put(successFetchColumn(res));
  } catch (e) {
    yield put(panelErrorMsg(e));
  }
}
