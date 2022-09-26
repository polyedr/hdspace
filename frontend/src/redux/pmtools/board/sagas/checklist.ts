import { reqWrapper } from '@Redux/project/sagas/shared';
import { call, putResolve } from 'redux-saga/effects';
import * as checklistApis from '@Api/pmtools/board/checklist';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as checklistActions from '../actions/checklist';

export function* createChecklistItem({
  task,
  text,
}: ReturnType<typeof checklistActions.requestCreateChecklistItem>) {
  try {
    const { data } = yield call(reqWrapper, checklistApis.createCheckItem, {
      text,
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
