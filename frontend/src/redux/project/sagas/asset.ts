/* eslint-disable no-console */
import { put, select, call } from 'redux-saga/effects';
import {
  apiCreateAsset,
  apiDeleteAsset,
  apiGetAssets,
  apiUpdateAsset,
} from '@Api/asset';
import {
  apiCreateAssetList,
  apiDeleteAssetList,
  apiGetAssetLists,
} from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { Asset, AssetsList, PaginatedArray } from '@Src/types';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { convertToServerAsset } from '@Api/converters/asset/fromResponse';
import { HistoryMeta } from '@Redux/types';
import { selectCurrentProjectId } from '../selectors/base';
import { reqWrapper } from './shared';
import * as Actions from '../actions';
import { selectElementById } from '../selectors/element';
import {
  selectAssetListById,
  selectSelectedAssetListId,
} from '../selectors/asset';
import withActionsHistory from '../wrappers/withActionsHistory';

// eslint-disable-next-line consistent-return
export function* uploadAsset(
  assetFile: any | null,
  fileName: string,
  listId: string,
  meta?: HistoryMeta,
) {
  const assetFormData = new FormData();
  assetFormData.append('image', assetFile);
  assetFormData.append('name', fileName);
  assetFormData.append('illustration_set', listId);
  try {
    const asset = yield call(reqWrapper, apiCreateAsset, {
      assetFormData,
    });
    if (!meta?.useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.removeAsset(asset.id, asset.listId, meta),
        ]),
      );
    }
    yield put(Actions.addAssetToState(listId, asset, meta));
    return asset;
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
}

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

export const addNewAssetListSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.addAssetList>,
) {
  const { name } = action.payload;
  const projectId = yield select(selectCurrentProjectId);
  const useHistory = !!action.meta && action.meta.useHistory;
  try {
    const selectedAssetId = yield select(selectSelectedAssetListId);

    const assetList: AssetsList = yield call(reqWrapper, apiCreateAssetList, {
      projectId,
      name,
    });
    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.setSelectedAssetListId(selectedAssetId || ALL_ASSETS_LIST_ID),
          Actions.removeAssetList(assetList.id, { ...action.meta }),
        ]),
      );
    }
    yield put(Actions.addAssetListToState(assetList));
    yield put(Actions.setSelectedAssetListId(assetList.id));
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const removeAssetListSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.removeAssetList>,
) {
  try {
    const assetList = yield select(selectAssetListById);
    const useHistory = !!action.meta && action.meta.useHistory;
    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.addAssetList(assetList.name, action.meta),
        ]),
      );
    }
    yield put(Actions.removeAssetListRedux(action.payload));
    yield call(reqWrapper, apiDeleteAssetList, {
      id: action.payload,
    });
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const restoreAssetSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.restoreAsset>,
) {
  const {
    payload: { asset, listId },
    meta,
  } = action;
  try {
    if (!meta?.useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.removeAsset(asset.id, listId, action.meta),
        ]),
      );
    }
    yield put(Actions.addAssetToState(listId, asset));
    yield call(reqWrapper, apiUpdateAsset, {
      id: asset.id,
      asset: convertToServerAsset(asset),
    });
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const removeAssetSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.removeAsset>,
) {
  const {
    meta,
    payload: { id, listId },
  } = action;
  try {
    const asset = yield select(selectAssetListById);
    if (!meta?.useHistory) {
      yield put(Actions.addUndoActions([Actions.restoreAsset(asset, listId)]));
    }
    yield put(Actions.removeAssetRedux(id, listId));
    yield call(reqWrapper, apiDeleteAsset, { id });
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const uploadAssetSaga = withActionsHistory(function* (
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
  const fileName: string = assetFile.name;
  try {
    yield call(uploadAsset, assetFile, fileName, assetListId, action.meta);
  } catch (error) {
    yield put(
      enqueueSnackbar({
        message: error.message,
        options: { variant: 'error' },
      }),
    );
  }
});

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
  try {
    const assetInstance = yield call(
      uploadAsset,
      asset,
      asset.name,
      listId,
      action.meta,
    );

    yield put(
      Actions.updateElementParameters(
        elementId,
        {
          ...element.parameters,
          imageURL: assetInstance.image,
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
