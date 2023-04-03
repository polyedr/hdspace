import { call, put, putResolve } from 'redux-saga/effects';
import { reqWrapper } from '@Redux/project/sagas/shared';
import * as checklistApis from '@Api/pmtools/board/checklist';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as checklistActions from '../actions/checklist';

export function* createChecklistItemSaga({
  task,
  text,
}: ReturnType<typeof checklistActions.requestCreateChecklistItem>) {
  try {
    const { data } = yield call(reqWrapper, checklistApis.createCheckItem, {
      text,
      taskId: task.id,
    });

    yield put(checklistActions.checklistItemCreated(data, task));
  } catch (e) {
    if (e instanceof Error) {
      yield putResolve(
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

export function* updateChecklistItemSaga({
  task,
  item,
}: ReturnType<typeof checklistActions.requestUpdateChecklistItem>) {
  try {
    yield put(checklistActions.checklistItemUpdated(item, task));

    yield call(reqWrapper, checklistApis.updateCheckItem, {
      item,
      checkItemId: item.id,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield putResolve(
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

export function* deleteChecklistItemSaga({
  task,
  itemId,
}: ReturnType<typeof checklistActions.requestDeleteChecklistItem>) {
  try {
    yield put(checklistActions.checklistItemDeleted(itemId, task));

    yield call(reqWrapper, checklistApis.deleteCheckItem, {
      checkItemId: itemId,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield putResolve(
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

export function* deleteChecklistSaga({
  task,
}: ReturnType<typeof checklistActions.requestDeleteChecklist>) {
  try {
    yield put(checklistActions.checklistDeleted(task));

    yield call(reqWrapper, checklistApis.deleteAllCheckItems, {
      taskId: task.id,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield putResolve(
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
