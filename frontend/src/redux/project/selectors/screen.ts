import { createSelector } from 'reselect';
import { DEFAULT_SCREEN } from '@Constants/defaultParams';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import { AppReduxState } from '../../types';
import { selectCurrentProject } from './base';

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

/**
 * use this selector in sagas
 */
export const selectScreenById = ({ project }: AppReduxState, id: number) =>
  project.data.screens[id];

/**
 * use this selector in components with useSelector hook
 */
export const selectScreenByIdWrapper = (id: number) => (state: AppReduxState) =>
  selectScreenById(state, id);

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

export const selectNewScreenModalOpen = ({ project }: AppReduxState) =>
  project.ui.newScreenModalOpen;

export const selectCurrentUIFramework = createSelector(
  selectCurrentProject,
  selectCurrentScreen,
  selectMasterScreenId,
  (project, screen, masterScreenId) => {
    const selectedFramework =
      screen.id !== masterScreenId && screen.screenData?.uiFramework
        ? screen.screenData?.uiFramework
        : project.projectData.uiFramework;
    return selectedFramework || NOT_SELECTED_FRAMEWORK;
  },
);
