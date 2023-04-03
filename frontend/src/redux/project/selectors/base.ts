import { createSelector } from 'reselect';
import { DEFAULT_PROJECT } from '@Constants/defaultParams';
import {
  FreeCanvasOffset,
  UIFramework,
  importData,
  ParsedImagePalette,
} from '@Src/types';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';
import { makeFeatureStateSelector } from '../../../shared/redux';
import { AppReduxState } from '../../types';
import { selectCurrentScreen, selectMasterScreenId } from './screen';

export const selectProjectState = makeFeatureStateSelector('project');

export const selectProjects = ({ project }: AppReduxState) =>
  project.data.projectsData.results;

export const selectProjectsAsArr = createSelector(selectProjects, (projects) =>
  Object.values(projects),
);

export const selectProjectsPageSize = ({ project }: AppReduxState) =>
  project.data.projectsData.pageSize;

export const selectProjectsDataNext = ({ project }: AppReduxState) =>
  project.data.projectsData.next;

export const selectProjectsSearchParameter = ({ project }: AppReduxState) =>
  project.data.projectsData.parameter;

/**
 * use this selector in sagas
 */
export const selectProjectById = (
  { project }: AppReduxState,
  projectId: number,
) => project.data.projectsData.results[projectId];

/**
 * use this selector in components with useSelector hook
 */
export const selectProjectByIdWrapper =
  (projectId: number) => (state: AppReduxState) =>
    selectProjectById(state, projectId);

export const selectCurrentProjectId = ({ project }: AppReduxState) =>
  project.edit.currentProjectId;

export const selectCurrentProject = createSelector(
  selectProjects,
  selectCurrentProjectId,
  (projects, id) => projects[id] || DEFAULT_PROJECT,
);

export const selectCurrentProjectClasses = createSelector(
  selectCurrentProject,
  (currentProject) => currentProject.projectData.classes,
);

export const selectCurrentProjectDefaultStyles = createSelector(
  selectCurrentProject,
  (currentProject) => currentProject.projectData.defaultStyles,
);

export const selectCurrentProjectDataJson = createSelector(
  selectCurrentProject,
  (currentProject) => currentProject.projectData,
);

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectProjectState(state).edit.uploadedImageInfo;
}

export function selectUpdateScreenImageLoader(state: AppReduxState) {
  return selectProjectState(state).communication.updateImageLoader;
}

export function selectProjectCreateLoader(state: AppReduxState) {
  return selectProjectState(state).communication.projectCreateLoader;
}

export const selectAreProjectsLoading = ({ project }: AppReduxState) =>
  project.data.projectsData.loading;

export function selectEditableStyles(state: AppReduxState) {
  return selectProjectState(state).ui.editableStyles;
}

export function selectShowingBorders(state: AppReduxState) {
  return selectProjectState(state).ui.showContainersBorders;
}

export function selectShowingGrid(state: AppReduxState) {
  return selectProjectState(state).ui.showGrid;
}

export function selectExportScreenFlag(state: AppReduxState) {
  return selectProjectState(state).ui.exportScreenFlag;
}

export const selectBordersEnabled = (state: AppReduxState) =>
  selectProjectState(state).ui.bordersEnabled;

export function selectScreenLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.screenLoader;
}

export function selectProjectLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.projectLoader;
}

export function selectAnalyzerLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.analyzerLoader;
}

export const selectCurrentDropTargetId = (state: AppReduxState) => {
  const dropTargetParams = selectProjectState(state).ui.currentDropTargetParams;
  return dropTargetParams ? dropTargetParams.id : null;
};

export const selectCurrentDropTargetParams = (state: AppReduxState) =>
  selectProjectState(state).ui.currentDropTargetParams;

export const selectProjectClasses = createSelector(
  selectProjects,
  selectCurrentProjectId,
  (projects, id) => projects[id].projectData.classes,
);

export const selectElementFileInput = (id: string) => (state: AppReduxState) =>
  selectProjectState(state).data.elementInputs[id];

// think over how can we fix this one in a different way
export const selectFreeCanvasOffset =
  (id: string) => (state: AppReduxState) => {
    const { elements } = state.project.data;
    const parent = state.project.edit.freeCanvas.lastElements[id];
    if (!parent) return 0;

    const needOffset =
      elements[id].children.includes(
        parent.elements[parent.elements.length - 1],
      ) &&
      elements[parent.elements[parent.elements.length - 1]].parameters
        .freeCanvas.left === parent.offset &&
      elements[parent.elements[parent.elements.length - 1]].parameters
        .freeCanvas.top === parent.offset;

    if (needOffset) return parent.offset + 20;
    return 0;
  };

export const selectFreeCanvasOffsetList =
  (ids: string[]) =>
  (state: AppReduxState): FreeCanvasOffset =>
    ids.reduce(
      (ids, id) =>
        ({
          ...ids,
          [id]: selectFreeCanvasOffset(id)(state),
        } as FreeCanvasOffset),
      {},
    );

export const selectLayout = ({ project }: AppReduxState) =>
  project.ui.layout.value;

export const selectScreenRotated = ({ project }: AppReduxState) =>
  project.ui.layout.rotated;

export const selectScreenCreateLoader = ({ project }: AppReduxState) =>
  project.communication.screenCreateLoader;

export const selectEditorDocument = ({ project }: AppReduxState) =>
  project.ui.editorDocument;

export const selectAssetsListsLoader = ({ project }: AppReduxState) =>
  project.communication.assetsListsLoader;

export const selectSidebarOpen = ({ project }: AppReduxState) =>
  project.ui.sidebar.open;

export const selectSidebarIframe = ({ project }: AppReduxState) =>
  project.ui.sidebar.iframe;

export const selectSidebarHost = ({ project }: AppReduxState) =>
  project.ui.sidebar.host;

export function selectImportLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.importLoader;
}
export function selectImagePalette(
  state: AppReduxState,
): ParsedImagePalette | null {
  return selectProjectState(state).data.imagePalette;
}

export function selectImportValue(state: AppReduxState): importData {
  return selectProjectState(state).communication.importValue;
}

export const selectCurrentUIFramework = createSelector(
  selectCurrentProject,
  selectCurrentScreen,
  selectMasterScreenId,
  (project, screen, masterScreenId) => {
    const projectUIFramework = project.projectData.uiFramework;
    const screenUIFramework = screen.screenData?.uiFramework;
    const selectedFramework = {
      ...NOT_SELECTED_FRAMEWORK,
      ...(projectUIFramework || {}),
      ...(screenUIFramework?.name !== projectUIFramework?.name &&
      screen.id !== masterScreenId
        ? screenUIFramework
        : {}),
    } as UIFramework;
    return selectedFramework || NOT_SELECTED_FRAMEWORK;
  },
);
