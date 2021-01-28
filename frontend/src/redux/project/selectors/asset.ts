import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { AppReduxState } from '@Redux/types';
import { selectProjectState } from './base';

export const selectAllAssetLists = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists.results;

export const selectAllAssetListsLoading = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists.loading;

export const selectDisplayAssets = (assetListId: string | null) => (
  state: AppReduxState,
) => {
  const selectedAssetResults = selectProjectState(state).data.assetResults[
    assetListId || DEFAULT_ASSETS_LIST_ID
  ];
  return selectedAssetResults?.results || [];
};
