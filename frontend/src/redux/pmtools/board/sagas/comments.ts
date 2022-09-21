import { reqWrapper } from '@Redux/project/sagas/shared';
import { call, put } from 'redux-saga/effects';
import * as commentsApi from '@Api/pmtools/board/commensApi';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as commentActions from '../actions/comments';
import { addComment, removeComment } from '../actions/comments';

export function* createCommentSaga({
  text,
  task,
}: ReturnType<typeof commentActions.createComment>) {
  try {
    const { data } = yield call(reqWrapper, commentsApi.createComment, {
      data: {
        text,
        columntask: task.id,
      },
    });

    yield put(addComment(data, task));
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

export function* updateCommentSaga({
  commentId,
  task,
  text,
}: ReturnType<typeof commentActions.requestUpdateComment>) {
  try {
    yield put(
      commentActions.commentUpdated(
        {
          id: commentId,
          text,
        },
        task,
      ),
    );

    const { data: comment } = yield call(
      reqWrapper,
      commentsApi.updateComment,
      {
        text,
        commentId,
      },
    );

    yield put(commentActions.commentUpdated(comment, task));
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

export function* deleteCommentSaga({
  commentId,
  task,
}: ReturnType<typeof commentActions.deleteComment>) {
  try {
    yield put(removeComment(commentId, task));
    yield call(reqWrapper, commentsApi.deleteComment, { commentId });
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
