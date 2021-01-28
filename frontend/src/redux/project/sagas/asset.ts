import { call } from 'ramda';
import { put, select } from 'redux-saga/effects';
import { apiGetAssets } from '@Api/asset';
import { apiGetAssetLists } from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { Asset, AssetsList, PaginatedArray } from '@Src/types';
import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';

import { selectCurrentProjectId } from '../selectors/base';
import { reqWrapper } from './shared';
import * as Actions from '../actions';

export function* loadAssetsSaga(action: ReturnType<typeof Actions.loadAssets>) {
  const projectId = yield select(selectCurrentProjectId);
  const { selectedListId } = action.payload;
  const listId = selectedListId || DEFAULT_ASSETS_LIST_ID;
  try {
    const assets: PaginatedArray<Asset> = yield call(reqWrapper, apiGetAssets, {
      projectId,
      ...(selectedListId ? { assetListId: selectedListId } : {}),
    });
    yield put(Actions.setAssets(listId, assets));
    yield put(Actions.setAssetsLoader(false));
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* loadAssetListsSaga() {
  const projectId = yield select(selectCurrentProjectId);
  try {
    yield put(Actions.setAssetsLoader(true));
    const assetLists: PaginatedArray<AssetsList> = yield call(
      reqWrapper,
      apiGetAssetLists,
      {
        projectId,
      },
    );
    // console.log('ASSET LISTS!!', assetLists);
    yield put(Actions.setAssetLists(assetLists));
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}
