import { reqWrapper } from '@Redux/project/sagas/shared';
import { call, put } from 'redux-saga/effects';
import * as commentsApi from '@Api/pmtools/board/commensApi';
import { BoardTask } from '@Redux/pmtools/types';
import { addComment } from '../actions/comments';

export function* createCommentSaga({
  text,
  task,
}: {
  text: string;
  task: BoardTask;
  type: string;
}) {
  try {
    const { data } = yield call(reqWrapper, commentsApi.createComment, {
      data: {
        text,
        columntask: task.id,
      },
    });

    yield put(addComment(data, task));
  } catch (error) {
    console.log('create comment', error);
  }
}
