import { createSelector } from 'reselect';
import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { AppReduxState, ProjectState } from '@Redux/types';
import { selectProjectState } from './base';

export const selectAllAssetLists = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists.results;

export const selectAllAssetListsLoading = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists.loading;

export const selectSelectedAssetListId = (state: AppReduxState) => {
  return selectProjectState(state).edit.selectedAssetListId;
};

export const selectDisplayAssets = createSelector(
  selectSelectedAssetListId,
  selectProjectState,
  (assetListId: string | null, state: ProjectState) => {
    return (
      state.data.assetResults[assetListId || DEFAULT_ASSETS_LIST_ID]?.results ||
      []
    );
  },
);

export const selectAssetListById = (listId: string) => (
  state: AppReduxState,
) => {
  return selectProjectState(state).data.assetLists[listId];
};
