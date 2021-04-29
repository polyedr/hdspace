import { createSelector } from 'reselect';
import { AppReduxState } from '@Redux/types';
import { selectAllElements } from './element';

export const selectVIAModeEnabled = ({ project }: AppReduxState) =>
  project.edit.VIAMode.enabled;

export const selectVIARegions = ({ project }: AppReduxState) =>
  project.edit.VIAMode.regions;

export const selectVIARegionsAsArray = createSelector(
  selectVIARegions,
  (regions) => Object.values(regions),
);

export const selectActiveVIARegionId = ({ project }: AppReduxState) =>
  project.edit.VIAMode.activeRegionId;

export const selectActiveVIARegion = createSelector(
  selectVIARegions,
  selectActiveVIARegionId,
  (regions, activeId) => regions[activeId],
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

export const selectAnnotatedImageURL = ({ project }: AppReduxState) =>
  project.edit.VIAMode.annotatedImageURL;

export const selectCopiedVIARegion = ({ project }: AppReduxState) =>
  project.edit.VIAMode.copiedRegion;

export const selectVIARegionByIdInSaga = (
  { project }: AppReduxState,
  regionId: string,
) => project.edit.VIAMode.regions[regionId];
