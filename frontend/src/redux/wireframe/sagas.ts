import { compose } from 'redux';
import { put, select, takeLatest } from 'redux-saga/effects';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { UserProjectPermission } from '@Src/types';
import withActionsHistory from '@Redux/project/wrappers/withActionsHistory';
import { addUndoActions, editScreenNameAndData } from '@Redux/project/actions';
import TYPES from '@Redux/actionTypes';
import { selectScreen } from '@Redux/project/selectors/element';
import { HistoryMeta } from '@Redux/types';
import * as Actions from './actions';

const updateScreenPositionSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (
  action: ReturnType<typeof Actions.updateScreenPosition> & {
    meta: HistoryMeta;
  },
) {
  const { screenId, position, projectId } = action.payload;
  const screen = yield select(selectScreen(screenId));

  const { useHistory } = action.meta;

  if (!useHistory) {
    yield put(
      addUndoActions([
        Actions.updateScreenPosition(
          screenId,
          screen.wireframePosition,
          projectId,
          { ...action.meta },
        ),
      ]),
    );
  }

  try {
    yield put(
      editScreenNameAndData(projectId, screenId, {
        data: {
          wireframePosition: position,
        },
      }),
    );
  } catch (error) {}
});

export default function* wireframeScreen() {
  yield takeLatest(
    TYPES.WIREFRAME_UPDATE_SCREEN_POSITION,
    updateScreenPositionSaga,
  );
}
