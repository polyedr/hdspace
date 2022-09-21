import { reqWrapper } from '@Redux/project/sagas/shared';
import { call, put, select } from 'redux-saga/effects';
import * as labelsApi from '@Api/pmtools/board/labelsApi';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  addProjectLabel,
  storeTaskLabels,
  updateTaskLabels,
  createProjectLabel,
  requestDeleteProjectLabel,
  projectLabelDeleted,
} from '../actions/labels';

export function* createProjectLabelSaga({
  text,
  colour,
}: ReturnType<typeof createProjectLabel>) {
  try {
    const projectId = yield select(selectCurrentProjectId);

    const { data } = yield call(reqWrapper, labelsApi.createProjectLabel, {
      text,
      colour,
      projectId,
    });

    yield put(addProjectLabel(data));
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

export function* updateTaskLabelsSaga({
  labels,
  task,
}: ReturnType<typeof updateTaskLabels>) {
  try {
    yield put(storeTaskLabels(labels, task));

    // const {} = yield call();
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

export function* deleteProjectLabelsSaga({
  id,
}: ReturnType<typeof requestDeleteProjectLabel>) {
  try {
    yield put(projectLabelDeleted(id));

    yield call(reqWrapper, labelsApi.deleteLabel, { labelId: id });
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
