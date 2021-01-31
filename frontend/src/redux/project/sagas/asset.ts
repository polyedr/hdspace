/* eslint-disable no-console */
import { call } from 'ramda';
import { put, select } from 'redux-saga/effects';
import { apiCreateAsset, apiGetAssets } from '@Api/asset';
import { apiCreateAssetList, apiGetAssetLists } from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { Asset, AssetsList, PaginatedArray } from '@Src/types';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';

import { selectCurrentProjectId } from '../selectors/base';
import { reqWrapper } from './shared';
import * as Actions from '../actions';
import { selectElementById } from '../selectors/element';

export function* loadAssetsSaga(action: ReturnType<typeof Actions.loadAssets>) {
  const projectId = yield select(selectCurrentProjectId);
  const { selectedListId } = action.payload;
  const listId = selectedListId || ALL_ASSETS_LIST_ID;
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

export function* addNewAssetListSaga(
  action: ReturnType<typeof Actions.addAssetList>,
) {
  const projectId = yield select(selectCurrentProjectId);
  try {
    const assetList = yield call(reqWrapper, apiCreateAssetList, {
      projectId,
      name: action.payload,
    });
    yield put(Actions.addAssetListToState(assetList));
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* uploadAssetSaga(
  action: ReturnType<typeof Actions.uploadAsset>,
) {
  const { listId, assetFile } = action.payload;
  const assetFormData = new FormData();
  assetFormData.append('image', assetFile);
  assetFormData.append('name', assetFile.name);
  assetFormData.append('illustration_set', listId);
  try {
    const asset = yield call(reqWrapper, apiCreateAsset, {
      assetFormData,
    });
    yield put(Actions.addAssetToState(listId, asset));
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* uploadElementAssetSaga(
  action: ReturnType<typeof Actions.uploadElementAsset>,
) {
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { listId, elementId, asset } = action.payload;
  const { screenId } = action.meta;

  const element = yield select(selectElementById(elementId));
  const assetFormData = new FormData();
  assetFormData.append('image', asset);
  assetFormData.append('name', asset.name);
  assetFormData.append('illustration_set', listId);
  try {
    const asset: Asset = yield call(reqWrapper, apiCreateAsset, {
      assetFormData,
    });
    yield put(Actions.addAssetToState(listId, asset));

    yield put(
      Actions.updateElementParameters(
        elementId,
        {
          ...element.parameters,
          imageURL: asset.image,
          imageSize: {
            width: 0,
            height: 0,
          },
          width: 'auto',
          height: 'auto',
        },
        { screenId },
      ),
    );
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}
