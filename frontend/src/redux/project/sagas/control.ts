import { put, select } from 'redux-saga/effects';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { HistoryRecord } from '@Redux/types';
import * as Actions from '../actions';
import {
  selectCanUndo,
  selectCurrentHistoryRecord,
} from '../selectors/control';

export function* executeUndoActionsSaga() {
  try {
    const canUndo = yield select(selectCanUndo);
    if (!canUndo) {
      throw new Error('Can not undo');
    }
    const currentHistoryRecord: HistoryRecord = yield select(
      selectCurrentHistoryRecord,
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const undoAction of currentHistoryRecord.undo.reverse()) {
      yield put({
        ...undoAction,
        meta: {
          ...(undoAction.meta || {}),
          useHistory: true,
        },
      });
    }
    yield put(Actions.moveHistoryBackward());
    if (
      currentHistoryRecord.action.type.valueOf() === 'via/ASSEMBLE_VIA_REGIONS'
    ) {
      yield put(Actions.setVIAMode(true));
    }
    yield put(
      enqueueSnackbar({
        message: 'Sucessfully undo.',
        options: {
          variant: 'success',
        },
      }),
    );
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

export function* executeRedoActionsSaga() {
  try {
    yield put(Actions.moveHistoryForward());
    const currentHistoryRecord: HistoryRecord = yield select(
      selectCurrentHistoryRecord,
    );
    if (currentHistoryRecord.redo.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const redoAction of currentHistoryRecord.redo.reverse()) {
        yield put({
          ...redoAction,
          meta: {
            ...(redoAction.meta || {}),
            useHistory: true,
          },
        });
      }
    } else {
      const { action: redoAction } = currentHistoryRecord;
      yield put({
        ...redoAction,
        meta: {
          ...(redoAction.meta || {}),
          useHistory: true,
        },
      });
    }
    yield put(
      enqueueSnackbar({
        message: 'Sucessfully redo.',
        options: {
          variant: 'success',
        },
      }),
    );
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

export function* addHistoryActionsSaga(
  action: ReturnType<typeof Actions.addHistoryActions>,
) {
  const { undo, redo } = action.payload;
  yield put(Actions.addUndoActions(undo));
  if (redo?.length) {
    yield put(Actions.addRedoActions(redo));
  }
}
