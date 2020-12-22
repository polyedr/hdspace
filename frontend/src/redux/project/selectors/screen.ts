import { createSelector } from 'reselect';
import { DEFAULT_SCREEN } from '@Constants/defaultParams';
import { AppReduxState } from '../../types';

export const selectCurrentScreenId = ({ project }: AppReduxState) =>
  project.edit.currentScreenId;

export const selectCurrentScreen = createSelector(
  (state: AppReduxState) => state.project.data.screens,
  selectCurrentScreenId,
  (screens, id) => screens[id] || DEFAULT_SCREEN,
);

export const selectScreens = createSelector(
  (state: AppReduxState) => state.project.data.screens,
  (screens) => Object.values(screens).sort((a, b) => a.buoyancy - b.buoyancy),
);

export const selectScreensLength = (state: AppReduxState) =>
  selectScreens(state).length;

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id];
