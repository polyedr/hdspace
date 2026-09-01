import { createSelector } from 'reselect';
import { AppReduxState } from '@Redux/types';
import { selectAllElements, selectActiveNNModel } from './element';

export const selectVIAModeEnabled = ({ project }: AppReduxState) =>
  project.edit.VIAMode.enabled;

export const selectVIARegions = ({ project }: AppReduxState) =>
  project.edit.VIAMode.regions;

export const selectVIARegionsAsArray = createSelector(
  selectVIARegions,
  selectActiveNNModel,
  (regions, activeNNModel) => Object.values(regions[activeNNModel]),
);

export const selectActiveVIARegionId = ({ project }: AppReduxState) =>
  project.edit.VIAMode.activeRegionId;

export const selectProjectError = ({ project }: AppReduxState) =>
  project.data.createProjectError;

export const selectActiveVIARegion = createSelector(
  selectVIARegions,
  selectActiveNNModel,
  selectActiveVIARegionId,
  (regions, activeNNModel, activeId) => regions[activeNNModel][activeId],
);

export const selectIsRegionActive = (regionId: string) =>
  createSelector(selectActiveVIARegionId, (activeId) => activeId === regionId);

export const selectAnnotatedElementId = ({ project }: AppReduxState) =>
  project.edit.VIAMode.annotatedElementId;

export const selectAnnotatedElement = createSelector(
  selectAllElements,
  selectAnnotatedElementId,
  (elements, id) => elements[id],
);

export const selectAnnotatedImageFile = ({ project }: AppReduxState) =>
  project.edit.VIAMode.annotatedImageFile;

export const selectCopiedVIARegion = ({ project }: AppReduxState) =>
  project.edit.VIAMode.copiedRegion;

export const selectVIARegionByIdInSaga = (
  { project }: AppReduxState,
  regionId: string,
) => project.edit.VIAMode.regions[regionId];

export const selectVIAResultId = ({ project }: AppReduxState) =>
  project.edit.VIAMode.resultId;

export const selectBlockType = ({ project }: AppReduxState) =>
  project.edit.VIAMode.blockType;

export const selectVIAData = ({ project }: AppReduxState) =>
  project.edit.VIAMode.viaData[project.edit.activeNNModel];
