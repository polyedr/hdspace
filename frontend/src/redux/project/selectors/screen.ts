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

export const selectScreensWithoutMaster = createSelector(
  (state: AppReduxState) => state.project.data.screens,
  (state: AppReduxState) => state.project.edit.masterScreenId,
  (screens, masterScreenId) => {
    return Object.values(screens)
      .filter((screen) => screen.id !== masterScreenId)
      .sort((a, b) => a.buoyancy - b.buoyancy);
  },
);

export const selectScreens = (state: AppReduxState) =>
  Object.values(state.project.data.screens).sort(
    (a, b) => a.buoyancy - b.buoyancy,
  );

export const selectScreensLength = (state: AppReduxState) =>
  selectScreens(state).length;

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id];

export const selectMasterScreenId = ({ project }: AppReduxState) =>
  project.edit.masterScreenId;

export const selectMasterScreen = (state: AppReduxState) => {
  const masterScreenId = selectMasterScreenId(state);
  if (!masterScreenId) {
    return null;
  }
  return state.project.data.screens[masterScreenId];
};

export const selectMasterScreenEnabled = createSelector(
  selectCurrentScreenId,
  selectMasterScreenId,
  (currentScreenId: number | null, masterScreenId: number | null) => {
    return currentScreenId === masterScreenId;
  },
);
