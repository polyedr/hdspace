// @ts-nocheck
import { takeEvery, put, select } from 'redux-saga/effects';
import { v4 } from 'uuid';
import TYPES from '@Redux/actionTypes';
import { Normalized, VIARegion } from '@Src/types';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  addRedoActions,
  addUndoActions,
  createVIARegion,
  createVIARegionSuccess,
  deleteVIARegion,
  deleteVIARegionSuccess,
  pasteVIARegion,
  restoreVIARegion,
  setActiveVIARegion,
  updateVIARegion,
  updateVIARegionLayer,
  updateVIARegionLayerSuccess,
  updateVIARegionSuccess,
} from '../actions';
import withActionsHistory from '../wrappers/withActionsHistory';
import {
  selectActiveVIARegionId,
  selectCopiedVIARegion,
  selectVIARegionByIdInSaga,
  selectVIARegions,
} from '../selectors/via';

const deleteVIARegionSaga = withActionsHistory(function* ({
  payload,
  meta,
}: ReturnType<typeof deleteVIARegion>) {
  try {
    const useHistory = meta?.useHistory;

    const activeRegionId: string = yield select(selectActiveVIARegionId);
    const idToDelete = payload || activeRegionId;

    const target: VIARegion = yield select(
      selectVIARegionByIdInSaga,
      idToDelete,
    );

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
  } catch (e) {
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
});

const createVIARegionSaga = withActionsHistory(function* (
  action: ReturnType<typeof createVIARegion>,
) {
  try {
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
    yield put(setActiveVIARegion(newRegion.id, false));
  } catch (e) {
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
});

const restoreVIARegionSaga = withActionsHistory(function* ({
  payload,
  meta,
}: ReturnType<typeof restoreVIARegion>) {
  try {
    if (!meta?.useHistory) {
      yield put(addUndoActions(deleteVIARegion(payload.id, { ...meta })));
    }
    yield put(createVIARegionSuccess(payload));
  } catch (e) {
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
});

const pasteVIARegionSaga = withActionsHistory(function* ({
  meta,
}: ReturnType<typeof pasteVIARegion>) {
  try {
    const useHistory = meta?.useHistory;

    const copied: VIARegion | null = yield select(selectCopiedVIARegion);
    if (!copied) return;

    const regions: Normalized<VIARegion> = yield select(selectVIARegions);

    const newRegion: VIARegion = {
      id: v4(),
      layer: Object.keys(regions).length,
      region_attributes: {
        ...copied?.region_attributes,
      },
      shape_attributes: {
        ...copied?.shape_attributes,
      },
    };

    if (!useHistory) {
      yield put(addUndoActions(deleteVIARegion(newRegion.id, { ...meta })));
      yield put(
        addRedoActions(
          restoreVIARegion(newRegion, {
            ...meta,
            useHistory: true,
          }),
        ),
      );
    }

    yield put(createVIARegionSuccess(newRegion));
    yield put(setActiveVIARegion(newRegion.id, false));
  } catch (e) {
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
});

const updateVIARegionSaga = withActionsHistory(function* ({
  payload: { id, data },
  meta,
}: ReturnType<typeof updateVIARegion>) {
  try {
    if (!meta?.useHistory) {
      const oldRegion: VIARegion = yield select(selectVIARegionByIdInSaga, id);
      yield put(addUndoActions(updateVIARegion(id, oldRegion, { ...meta })));
    }

    yield put(updateVIARegionSuccess(id, data));
  } catch (e) {
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
});

const updateVIARegionLayerSaga = withActionsHistory(function* ({
  payload: { id, layer },
  meta,
}: ReturnType<typeof updateVIARegionLayer>) {
  try {
    if (!meta?.useHistory) {
      const oldRegion: VIARegion = yield select(selectVIARegionByIdInSaga, id);
      yield put(
        addUndoActions(updateVIARegionLayer(id, oldRegion.layer, { ...meta })),
      );
    }

    yield put(updateVIARegionLayerSuccess(id, layer));
  } catch (e) {
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
});

export default function* viaSaga() {
  yield takeEvery(TYPES.CREATE_VIA_REGION, createVIARegionSaga);
  yield takeEvery(TYPES.DELETE_VIA_REGION, deleteVIARegionSaga);
  yield takeEvery(TYPES.RESTORE_VIA_REGION, restoreVIARegionSaga);
  yield takeEvery(TYPES.PASTE_VIA_REGION, pasteVIARegionSaga);
  yield takeEvery(TYPES.UPDATE_VIA_REGION, updateVIARegionSaga);
  yield takeEvery(TYPES.UPDATE_VIA_REGION_LAYER, updateVIARegionLayerSaga);
}
