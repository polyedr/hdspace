// @ts-nocheck
import { put, select, call } from 'redux-saga/effects';
import {
  apiCreateAsset,
  apiDeleteAsset,
  apiGenerateImagePalette,
  apiGetAssets,
  apiUpdateAsset,
} from '@Api/asset';
import {
  apiCreateAssetList,
  apiDeleteAssetList,
  apiGetAssetLists,
} from '@Api/assetList';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  Asset,
  AssetsList,
  PaginatedArray,
  Result,
  UserProjectPermission,
} from '@Src/types';
import { convertToServerAsset } from '@Api/converters/asset/fromResponse';
import { HistoryMeta, UploadAssetData } from '@Redux/types';
import { compose } from 'redux';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import logger from 'loglevel';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
  selectAssetListById,
  selectCurrentAssetList,
  selectCurrentAssetsResults,
} from '../selectors/asset';
import { selectScreenByIdWrapper } from '../selectors/screen';
import { selectCurrentProjectId } from '../selectors/base';
import { reqWrapper } from './shared';
import * as Actions from '../actions';
import { selectElementById } from '../selectors/element';
import withActionsHistory from '../wrappers/withActionsHistory';

// eslint-disable-next-line consistent-return
export function* uploadAssetHelper(
  { assetFile, fileName, listId, imageURL }: UploadAssetData,
  meta?: HistoryMeta,
) {
  const assetFormData = new FormData();
  if (imageURL) {
    assetFormData.append('fileurl', imageURL);
  } else if (assetFile) {
    assetFormData.append('image', assetFile);
  }

  assetFormData.append('name', fileName);
  assetFormData.append('illustration_set', listId);
  try {
    const { result: asset, error }: Result<Asset> = yield call(
      reqWrapper,
      apiCreateAsset,
      {
        assetFormData,
      },
    );

    if (error) throw new Error(error);

    if (asset) {
      if (!meta?.useHistory) {
        yield put(
          Actions.addUndoActions([
            Actions.removeAsset(asset.id, asset.listId, meta),
          ]),
        );
      }
      yield put(Actions.addAssetToState(listId, asset, meta));
      return asset;
    }
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
}

export function* generateImagePaletteSaga(
  action: ReturnType<typeof Actions.generateImagePalette>,
) {
  const imageUrl = action.payload;

  try {
    const imagePalette = yield call(reqWrapper, apiGenerateImagePalette, {
      imageUrl,
    });
    yield put(Actions.setImagePalette(imagePalette));
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
}

export function* loadAssetsSaga(action: ReturnType<typeof Actions.loadAssets>) {
  const { selectedListId } = action.payload;
  if (selectedListId) {
    try {
      const loadedAssetResults = yield select(selectCurrentAssetsResults);
      const assets: PaginatedArray<Asset> = yield call(
        reqWrapper,
        apiGetAssets,
        {
          projectId: action.payload,
          assetListId: selectedListId,
          ...(loadedAssetResults?.next
            ? { next: loadedAssetResults.next }
            : {}),
        },
      );
      yield put(Actions.setAssets(selectedListId, assets));
    } catch (error) {
      yield put(
        enqueueSnackbar(
          {
            message: error.message,
            options: { variant: 'error' },
          },
          error,
        ),
      );
    }
  }
}

export function* loadAssetListsSaga(
  action: ReturnType<typeof Actions.loadAssetLists>,
) {
  try {
    const assetLists: PaginatedArray<AssetsList> = yield call(
      reqWrapper,
      apiGetAssetLists,
      {
        projectId: action.payload,
      },
    );

    if (assetLists.results.length > 0) {
      yield put(Actions.setSelectedAssetListId(assetLists.results[0].id));
    }
    yield put(Actions.setAssetLists(assetLists));
    yield put(Actions.setAssetsListsLoader(false));
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
}

export const addNewAssetListSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.addAssetList>) {
  const { name } = action.payload;
  const projectId = yield select(selectCurrentProjectId);
  const useHistory = !!action.meta && action.meta.useHistory;
  try {
    const currentAssetListId = yield select(selectCurrentAssetListId);

    const assetList: AssetsList = yield call(reqWrapper, apiCreateAssetList, {
      projectId,
      name,
    });
    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.setSelectedAssetListId(currentAssetListId),
          Actions.removeAssetList(assetList.id, { ...action.meta }),
        ]),
      );
    }
    yield put(Actions.addAssetListToState(assetList));
    yield put(Actions.setSelectedAssetListId(assetList.id));
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
});

export const removeAssetListSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeAssetList>) {
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
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
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
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
});

export const removeAssetSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeAsset>) {
  const {
    meta,
    payload: { id, listId },
  } = action;
  try {
    const asset = yield select(selectAssetListById);
    if (!meta?.useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.restoreAsset(asset, listId, action.meta),
        ]),
      );
    }
    yield put(Actions.removeAssetRedux(id, listId));
    yield call(reqWrapper, apiDeleteAsset, { id });
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
});

export const uploadAssetSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.uploadAsset>) {
  const { listId, assetFile } = action.payload;

  let assetListId = listId;
  if (!assetListId) {
    assetListId = yield select(selectCurrentAssetListId);
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
    yield call(
      uploadAssetHelper,
      { assetFile, fileName, listId: assetListId },
      action.meta,
    );
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
});

export const uploadElementAssetSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof Actions.uploadElementAsset>) {
  if (!action.meta) {
    logger.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { listId, elementId, asset } = action.payload;
  const { screenId } = action.meta;

  const element = yield select(selectElementById, elementId);
  console.log(element);
  try {
    const { imageURL, file, useInBackground } = asset;
    let finalImageUrl = imageURL;
    if (imageURL) {
      yield call(
        uploadAssetHelper,
        {
          assetFile: null,
          fileName: `smart header image ${elementId}`,
          listId,
          imageURL: asset.imageURL,
        },
        action.meta,
      );
    } else if (file) {
      const assetInstance = yield call(
        uploadAssetHelper,
        {
          assetFile: file,
          fileName: file.name,
          listId,
        },
        action.meta,
      );

      finalImageUrl = assetInstance.image;
    }
    if (useInBackground) {
      yield put(
        Actions.updateElementStyles(
          elementId,
          { backgroundImage: `url(${finalImageUrl})` },
          { screenId },
        ),
      );
    } else {
      yield put(
        Actions.updateElementParameters(
          elementId,
          {
            ...element.parameters,
            imageURL: finalImageUrl,
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
    }
  } catch (error) {
    yield put(
      enqueueSnackbar(
        {
          message: error.message,
          options: { variant: 'error' },
        },
        error,
      ),
    );
  }
});

export const editIcoScreenSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* ({ payload }) {
  try {
    const { file, project, id } = payload;
    const assetLists = yield select(selectAllAssetLists);
    const selectedAssetList = yield select(selectCurrentAssetList);
    const listId = selectedAssetList?.id || assetLists[0].id;
    const screenInfo = yield select(selectScreenByIdWrapper(id));

    if (file === null) {
      yield put(
        Actions.editScreenNameAndData(project, id, {
          name: screenInfo.name,
          data: {
            meta: {
              ...screenInfo.screenData.meta,
              faviconUrl: undefined,
            },
          },
        }),
      );
    } else {
      const assetInstance = yield call(uploadAssetHelper, {
        assetFile: file,
        fileName: file.name,
        listId,
      });

      yield put(
        Actions.editScreenNameAndData(project, id, {
          name: screenInfo.name,
          data: {
            meta: {
              ...screenInfo.screenData.meta,
              faviconUrl: assetInstance.image,
            },
          },
        }),
      );
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to edit favicon screen',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});
