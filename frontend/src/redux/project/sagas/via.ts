import { takeEvery, put, select } from 'redux-saga/effects/';
import TYPES from '@Redux/actionTypes';
import { Normalized, VIARegion } from '@Src/types';
import { v4 } from 'uuid';
import {
  addRedoActions,
  addUndoActions,
  createVIARegion,
  createVIARegionSuccess,
  deleteVIARegion,
  deleteVIARegionSuccess,
  restoreVIARegion,
  setActiveVIARegion,
} from '../actions';
import withActionsHistory from '../wrappers/withActionsHistory';
import {
  selectActiveVIARegionId,
  selectVIARegionByIdInSaga,
  selectVIARegions,
} from '../selectors/via';

const deleteVIARegionSaga = withActionsHistory(function* ({
  payload,
  meta,
}: ReturnType<typeof deleteVIARegion>) {
  const useHistory = meta?.useHistory;

  const activeRegionId: string = yield select(selectActiveVIARegionId);
  const idToDelete = payload || activeRegionId;

  const target: VIARegion = yield select(selectVIARegionByIdInSaga, idToDelete);

  if (!useHistory) {
    yield put(
      addUndoActions(
        restoreVIARegion(target, {
          ...meta,
          useHistory: true,
        }),
      ),
    );
  }

  yield put(deleteVIARegionSuccess(idToDelete));
});

const createVIARegionSaga = withActionsHistory(function* (
  action: ReturnType<typeof createVIARegion>,
) {
  const useHistory = action.meta?.useHistory;

  const regions: Normalized<VIARegion> = yield select(selectVIARegions);

  const newRegion: VIARegion = {
    id: v4(),
    layer: Object.keys(regions).length,
    region_attributes: {
      'HTML element': 'container',
    },
    shape_attributes: {
      height: 100,
      width: 100,
      x: 0,
      y: 0,
      name: 'rect',
    },
  };
  if (!useHistory) {
    yield put(
      addUndoActions(deleteVIARegion(newRegion.id, { ...action.meta })),
    );
    yield put(
      addRedoActions(
        restoreVIARegion(newRegion, {
          ...action.meta,
          useHistory: true,
        }),
      ),
    );
  }

  yield put(createVIARegionSuccess(newRegion));
  yield put(setActiveVIARegion(newRegion.id));
});

const restoreVIARegionSaga = withActionsHistory(function* ({
  payload,
  meta,
}: ReturnType<typeof restoreVIARegion>) {
  if (!meta?.useHistory) {
    yield put(addUndoActions(deleteVIARegion(payload.id, { ...meta })));
  }
  yield put(createVIARegionSuccess(payload));
});

export default function* viaSaga() {
  yield takeEvery(TYPES.CREATE_VIA_REGION, createVIARegionSaga);
  yield takeEvery(TYPES.DELETE_VIA_REGION, deleteVIARegionSaga);
  yield takeEvery(TYPES.RESTORE_VIA_REGION, restoreVIARegionSaga);
}
