import { createSelector } from 'reselect';
import { DEFAULT_PROJECT } from '@Constants/defaultParams';
import { makeFeatureStateSelector } from '../../../shared/redux';
import { AppReduxState } from '../../types';

export const selectProjectState = makeFeatureStateSelector('project');

export const selectProjects = ({ project }: AppReduxState) => {
  return project.data.projectsData.results;
};

export const selectProjectsAsArr = createSelector(selectProjects, (projects) =>
  Object.values(projects),
);

export const selectProjectsPageSize = ({ project }: AppReduxState) =>
  project.data.projectsData.pageSize;

export const selectProjectsDataNext = ({ project }: AppReduxState) =>
  project.data.projectsData.next;

export const selectProjectsSearchParameter = ({ project }: AppReduxState) =>
  project.data.projectsData.parameter;

export const selectProjectById = (projectId: number) => ({
  project,
}: AppReduxState) => project.data.projectsData.results[projectId];

export const selectCurrentProjectId = ({ project }: AppReduxState) =>
  project.edit.currentProjectId;

export const selectCurrentProject = createSelector(
  selectProjects,
  selectCurrentProjectId,
  (projects, id) => {
    return projects[id] || DEFAULT_PROJECT;
  },
);

export const selectCurrentProjectClasses = createSelector(
  selectCurrentProject,
  (currentProject) => currentProject.projectData.classes,
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

export const selectBordersEnabled = (state: AppReduxState) => {
  return selectProjectState(state).ui.bordersEnabled;
};

export const selectUndoActions = ({ project }: AppReduxState) =>
  project.control.undoActions;

export const selectRedoActions = ({ project }: AppReduxState) =>
  project.control.redoActions;

export const selectHistory = ({ project }: AppReduxState) =>
  project.control.history;

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

export const selectCurrentDropTargetParams = (state: AppReduxState) => {
  return selectProjectState(state).ui.currentDropTargetParams;
};

export const selectIsDropTarget = (id: string) => (state: AppReduxState) => {
  const dropTargetId = selectCurrentDropTargetId(state);
  return id === dropTargetId;
};

export const selectProjectClasses = createSelector(
  selectProjects,
  selectCurrentProjectId,
  (projects, id) => projects[id].projectData.classes,
);

export const selectElementFileInput = (id: string) => (
  state: AppReduxState,
) => {
  return selectProjectState(state).data.elementInputs[id];
};

export const selectFreeCanvasMode = ({ project }: AppReduxState) =>
  project.edit.freeCanvas.enabled;

export const selectFreeCanvasOffset = (id: string) => (
  state: AppReduxState,
) => {
  const { elements } = state.project.data;
  const parent = state.project.edit.freeCanvas.lastElements[id];
  if (!parent) return 0;

  const needOffset =
    elements[id].children.includes(
      parent.elements[parent.elements.length - 1],
    ) &&
    elements[parent.elements[parent.elements.length - 1]].parameters.left ===
      parent.offset &&
    elements[parent.elements[parent.elements.length - 1]].parameters.top ===
      parent.offset;

  if (needOffset) return parent.offset + 20;
  return 0;
};

export const selectScreenFormat = ({ project }: AppReduxState) =>
  project.ui.screenFormat.format;

export const selectScreenRotated = ({ project }: AppReduxState) =>
  project.ui.screenFormat.rotated;

export const selectScreenCreateLoader = ({ project }: AppReduxState) =>
  project.communication.screenCreateLoader;

export const selectEditorDocument = ({ project }: AppReduxState) =>
  project.ui.editorDocument;

export const selectAssetsLoader = ({ project }: AppReduxState) =>
  project.communication.assetsLoader;
