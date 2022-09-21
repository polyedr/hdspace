import { reqWrapper } from '@Redux/project/sagas/shared';
import { call, put, select } from 'redux-saga/effects';
import * as labelsApi from '@Api/pmtools/board/labelsApi';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { BoardLabel, BoardTask } from '@Redux/pmtools/types';
import { addProjectLabel, storeTaskLabels } from '../actions/labels';

export function* createProjectLabelSaga({
  text,
  colour,
}: {
  text: string;
  colour: string;
  type: string;
}) {
  try {
    const projectId = yield select(selectCurrentProjectId);

    console.log(colour);

    const { data } = yield call(reqWrapper, labelsApi.createProjectLabel, {
      text,
      colour,
      projectId,
    });

    yield put(addProjectLabel(data));
  } catch (error) {
    console.log('create label error', error);
  }
}

export function* updateTaskLabelsSaga({
  labels,
  task,
}: {
  labels: BoardLabel[];
  task: BoardTask;
  type: string;
}) {
  try {
    yield put(storeTaskLabels(labels, task));

    // const {} = yield call();
  } catch (error) {
    console.log('update task labels error', error);
  }
}
