import { createSelector } from 'reselect';
import { AppReduxState, ProjectState } from '@Redux/types';
import { selectProjectState } from './base';

export const selectAllAssetLists = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists?.results;

export const selectAllAssetListsLoading = (state: AppReduxState) =>
  selectProjectState(state).data.assetLists.loading;

export const selectCurrentAssetListId = (state: AppReduxState) => {
  return selectProjectState(state).edit.selectedAssetListId;
};

export const selectAssetsLoading = createSelector(
  selectCurrentAssetListId,
  selectProjectState,
  (assetListId: string | null, state: ProjectState) => {
    if (!assetListId) {
      return false;
    }
    return state.data.assetResults[assetListId]?.loading;
  },
);

export const selectCurrentAssetList = createSelector(
  selectCurrentAssetListId,
  selectProjectState,
  (currentAssetListId: string | null, state: ProjectState) => {
    if (!currentAssetListId) {
      return null;
    }
    return state.data.assetLists[currentAssetListId];
  },
);

export const selectDisplayAssets = ({ project }: AppReduxState) => {
  const currentAssetListId = project.edit.selectedAssetListId;
  if (!currentAssetListId) {
    return null;
  }
  const assetResults = project.data.assetResults[currentAssetListId];
  return assetResults ? assetResults.results : null;
};
/* selectCurrentAssetListId,
  selectProjectState,
  (assetListId: string | null, state: ProjectState) => {
    if (!assetListId) {
      return null;
    }
    const assetResults = state.data.assetResults[assetListId];
    return assetResults ? assetResults.results : null;
  },
); */

export const selectAssetListById = (listId: string | null) => (
  state: AppReduxState,
) => {
  if (!listId) {
    return null;
  }
  return selectProjectState(state).data.assetLists[listId];
};

export const selectAssetByListAndId = (id: string, listId: string) => (
  state: AppReduxState,
) => {
  const assetList = selectProjectState(state).data.assetLists[listId];
  if (!assetList) {
    return null;
  }
  return assetList.results.find((asset) => asset.id === id);
};
