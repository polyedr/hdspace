import { reqWrapper } from '@Redux/project/sagas/shared';
import { call } from 'redux-saga/effects';
import * as commentsApi from '@Api/pmtools/board/commensApi';

export function* createCommentSags({
  comment,
}: {
  comment: any;
  type: string;
}) {
  try {
    const { data } = yield call(reqWrapper, commentsApi.createComment, {
      comment,
    });

    console.log(data);
  } catch (error) {
    console.log('create comment', error);
  }
}
