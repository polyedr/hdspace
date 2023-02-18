import { createSelector } from 'reselect';
import { DEFAULT_SCREEN } from '@Constants/defaultParams';
import { Normalized, Screen } from '@Src/types';
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
  (screens, masterScreenId) =>
    Object.values(screens)
      .filter((screen) => screen.id !== masterScreenId)
      .sort((a, b) => a.buoyancy - b.buoyancy),
);

export const selectScreens = (state: AppReduxState) =>
  state.project.data.screens;

export const selectSortedScreens = createSelector(
  selectScreens,
  (unsortedScreens: Normalized<Screen>) =>
    Object.values(unsortedScreens).sort((a, b) => a.buoyancy - b.buoyancy),
);

export const selectFolders = (state: AppReduxState) =>
  state.project.data.screenFolders;

export const selectSortedFolders = createSelector(selectFolders, (folders) => {
  return Object.values(folders).sort((a, b) => a.buoyancy - b.buoyancy);
});

export const selectUncategoriesScreens = createSelector(
  selectSortedFolders,
  selectScreensWithoutMaster,
  (folders, screens) => {
    let categoriesScreensIds = [];

    folders.forEach((folder) => {
      categoriesScreensIds = [
        ...categoriesScreensIds,
        ...folder.ctscreens.map((screen) => screen.id),
      ];
    });

    return screens.filter(
      (screen) => !categoriesScreensIds.includes(screen.id),
    );
  },
);

export const selectScreensLength = createSelector(
  selectScreens,
  (screens: Normalized<Screen>) => Object.keys(screens).length,
);

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
  (currentScreenId: number | null, masterScreenId: number | null) =>
    currentScreenId === masterScreenId,
);

export const selectNewScreenModalOpen = ({ project }: AppReduxState) =>
  project.ui.newScreenModalOpen;

export const selectCanImportSite = ({ project }: AppReduxState) =>
  project.ui.isCanImportSite;

export const selectFreeCanvasMode = createSelector(
  selectCurrentScreen,
  (screen) => screen.screenData.freeCanvas,
);

export const selectInfoUser = (state: AppReduxState) => ({
  idUser: state.user.userData.id,
  firstName: state.user.userData.firstName,
});
