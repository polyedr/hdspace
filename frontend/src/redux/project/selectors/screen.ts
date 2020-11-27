import { createSelector } from 'reselect';
import { DEFAULT_SCREEN } from '@Constants/defaultParams';
import { selectProjectState } from './base';
import { AppReduxState } from '../../types';

export const selectCurrentScreenId = (state: AppReduxState) =>
  selectProjectState(state).edit.currentScreenId;

export const selectCurrentScreen = (state: AppReduxState) => {
  const currentScreenId = selectCurrentScreenId(state);
  return (
    selectProjectState(state).data.screens[currentScreenId] || DEFAULT_SCREEN
  );
};

export const selectScreens = createSelector(
  (state: AppReduxState) => state.project.data.screens,
  (screens) => Object.values(screens).sort((a, b) => a.buoyancy - b.buoyancy),
);

export const selectScreensLength = (state: AppReduxState) =>
  selectScreens(state).length;

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id];
