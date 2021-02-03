/* eslint-disable no-console */
import { call } from 'ramda';
import { put, select } from 'redux-saga/effects';
import { apiCreateAsset, apiGetAssets } from '@Api/asset';
import {
  apiCreateAssetList,
  apiDeleteAssetList,
  apiGetAssetLists,
} from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { Asset, AssetsList, PaginatedArray } from '@Src/types';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';

import { selectCurrentProjectId } from '../selectors/base';
import { reqWrapper } from './shared';
import * as Actions from '../actions';
import { selectElementById } from '../selectors/element';
import {
  selectAssetListById,
  selectSelectedAssetListId,
} from '../selectors/asset';

export function* loadAssetsSaga(action: ReturnType<typeof Actions.loadAssets>) {
  const { selectedListId } = action.payload;
  if (selectedListId !== ALL_ASSETS_LIST_ID) {
    try {
      const assets: PaginatedArray<Asset> = yield call(
        reqWrapper,
        apiGetAssets,
        {
          projectId: action.payload,
          ...(selectedListId ? { assetListId: selectedListId } : {}),
        },
      );
      yield put(Actions.setAssets(selectedListId, assets));
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
    // compute all lists from returned response, should be removed in the future
    const allImages = assetLists.results.reduce(
      (acc: Array<Asset>, assetList: AssetsList) => {
        return [...acc, ...assetList.images];
      },
      [],
    );
    yield put(
      Actions.setAssets(ALL_ASSETS_LIST_ID, {
        next: null,
        previous: null,
        pageSize: 0,
        loading: false,
        results: allImages,
      }),
    );
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

export function* addNewAssetListSaga(
  action: ReturnType<typeof Actions.addAssetList>,
) {
  const { name } = action.payload;
  const projectId = yield select(selectCurrentProjectId);
  const undo = !!action.meta && action.meta.undo;
  try {
    const selectedAssetId = yield select(selectSelectedAssetListId);
    const assetList: AssetsList = yield call(reqWrapper, apiCreateAssetList, {
      projectId,
      name,
    });
    yield put(Actions.addAssetListToState(assetList));
    yield put(Actions.setSelectedAssetListId(assetList.id));
    if (!undo) {
      yield put(
        Actions.setUndoActions([
          Actions.setSelectedAssetListId(selectedAssetId || ALL_ASSETS_LIST_ID),
          Actions.removeAssetList(assetList.id, action.meta),
        ]),
      );
    }
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* removeAssetListSaga(
  action: ReturnType<typeof Actions.removeAssetList>,
) {
  try {
    const assetList = yield select(selectAssetListById);
    const undo = !!action.meta && action.meta.undo;
    if (!undo) {
      yield put(
        Actions.setUndoActions([
          Actions.addAssetList(assetList.name, action.meta),
        ]),
      );
    }
    yield call(reqWrapper, apiDeleteAssetList, {
      id: action.payload,
    });
    yield put(Actions.removeAssetListRedux(action.payload));
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
  let assetListId = listId;
  if (!assetListId) {
    assetListId = yield select(selectSelectedAssetListId);
  }
  if (!assetListId) {
    yield put(
      enqueueSnackbar({
        message: 'List ID is not provided',
        options: { variant: 'error' },
      }),
    );
    return;
  }
  const assetFormData = new FormData();
  assetFormData.append('image', assetFile);
  assetFormData.append('name', assetFile.name);
  assetFormData.append('illustration_set', assetListId);
  try {
    const asset = yield call(reqWrapper, apiCreateAsset, {
      assetFormData,
    });
    yield put(Actions.addAssetToState(assetListId, asset));
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
