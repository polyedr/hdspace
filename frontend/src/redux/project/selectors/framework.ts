import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import { createSelector } from 'reselect';
import { selectCurrentProject } from './base';
import { selectCurrentScreen, selectMasterScreenId } from './screen';

// eslint-disable-next-line import/prefer-default-export
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
