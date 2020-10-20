import { createSelector } from 'reselect';
import * as R from 'ramda';
import { StateElement, BorderedElementsRef } from './types';
import {
  DEFAULT_ACTIVE_ELEMENT,
  DEFAULT_PROJECT,
  DEFAULT_ROOT,
  DEFAULT_SCREEN,
} from '../../constants/defaultParams';
import { Entity, ChildEntity } from '../../domain/core';
import { AppReduxState } from '../../shared/types/app';
import { LibraryElement, PaginatedArray } from '../../api/types';
import { CssLikeStyles } from '../../utils/StyleHelper';
import { makeFeatureStateSelector } from '../../shared/redux';
import {
  buildElementsTree,
  flattenElements,
} from '../../utils/normalizedStateHelpers';
import { getDisplayStyles } from '../../features/applyProperties/views/containers/Controls/Display/Display';

export const selectProjectState = makeFeatureStateSelector('project');

export const selectProjects = ({ project }: AppReduxState) => {
  return project.data.projectsData.results;
};

export const selectProjectsAsArr = createSelector(selectProjects, (projects) =>
  R.values(projects),
);

export const selectProjectsPageSize = ({ project }: AppReduxState) =>
  project.data.projectsData.pageSize;

export const selectProjectsDataNext = ({ project }: AppReduxState) =>
  project.data.projectsData.next;

export const selectProjectById = (projectId: number) => ({
  project,
}: AppReduxState) => project.data.projectsData.results[projectId];

export const selectScreenRootElement = (screenId: number) => ({
  project,
}: AppReduxState) => {
  const rootId = project.data.screens[screenId]?.element;

  return buildElementsTree(project.data.elements, rootId) || DEFAULT_ROOT;
};

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
  (screens) => R.values(screens).sort((a, b) => a.buoyancy - b.buoyancy),
);

export const selectScreensLength = (state: AppReduxState) =>
  selectScreens(state).length;

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id] || DEFAULT_SCREEN; // TODO: should it return default screen?

export function selectNotification(state: AppReduxState) {
  return selectProjectState(state).edit.notification;
}

export const selectIsAddElementsModalOpened = ({ project }: AppReduxState) =>
  project.ui.isAddElementsModalOpened;

export const selectSavedElementsValues = ({ project }: AppReduxState) =>
  project.ui.savedElementsValues;

export const selectCurrentProjectId = ({ project }: AppReduxState) =>
  project.edit.currentProjectId;

export const selectCurrentProject = createSelector(
  selectProjects,
  selectCurrentProjectId,
  (projects, id) => {
    return projects[id] || DEFAULT_PROJECT;
  },
);

export const selectCurrentRootId = (state: AppReduxState) =>
  selectCurrentScreen(state).element || '-1';

export const selectElementById = (id: string) => (state: AppReduxState) =>
  selectProjectState(state).data.elements[id];

export const selectElementAsTree = (id: string) => ({
  project,
}: AppReduxState) => {
  if (!(id in project.data.elements)) return DEFAULT_ROOT;

  return buildElementsTree(project.data.elements, id);
};

export const selectCurrentRootElement = (state: AppReduxState) => {
  const currentRootId = selectCurrentRootId(state);
  return selectElementAsTree(currentRootId)(state);
};

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectProjectState(state).edit.uploadedImageInfo;
}

export function selectLoader(state: AppReduxState) {
  return selectProjectState(state).communication.loader;
}

export const selectElementByChildId = (id: string) => (
  state: AppReduxState,
) => {
  const element = selectElementById(id)(state);
  return element && element.parent
    ? selectElementById(element.parent)(state)
    : null;
};

export function selectScenarioLoader(state: AppReduxState) {
  return selectProjectState(state).communication.scenarioLoader;
}

export const selectAreProjectsLoading = ({ project }: AppReduxState) =>
  project.data.projectsData.loading;

export const selectActiveElementId = ({ project }: AppReduxState) =>
  project.edit.activeElementId;

export const selectAllElements = ({ project }: AppReduxState) =>
  project.data.elements;

export const selectActiveElement = (state: AppReduxState) =>
  state.project.data.elements[selectActiveElementId(state)] ||
  DEFAULT_ACTIVE_ELEMENT;

export function selectEditableStyles(state: AppReduxState) {
  return selectProjectState(state).ui.editableStyles;
}

export function selectSharedStyles(state: AppReduxState, elementType: string) {
  return selectCurrentProject(state).projectData.classes.find(
    (cssClass) => cssClass.className === elementType,
  )?.rules;
}

function makeActiveElementInfoSelector<
  T extends StateElement,
  K extends 'styles' | 'parameters'
>(
  prop: K,
): <R extends T>(
  state: AppReduxState,
) => K extends 'styles' ? R['styles'] : R['parameters'] {
  return (state: AppReduxState) => {
    const activeElement = selectActiveElement(state);

    return activeElement[prop] as K extends 'styles'
      ? T['styles']
      : T['parameters'];
  };
}

export const selectActiveElementStyles = makeActiveElementInfoSelector(
  'styles',
);

export function selectCurrentEditableStyles<
  T extends keyof Required<CssLikeStyles>
>(state: AppReduxState, ruleName: T) {
  const activeElementType = selectActiveElement(state).type;

  const activeElementStyles = selectActiveElementStyles<StateElement>(state)
    .ownStyles;

  const activeElementClassNames = selectActiveElementStyles(state).classNames;

  const editableStyles = selectEditableStyles(state);

  const activeEntityStyles =
    (activeElementType !== 'none' &&
      selectSharedStyles(state, activeElementType)) ||
    ({} as Required<CssLikeStyles>);

  const activeSharedStyles =
    selectSharedStyles(state, activeElementClassNames[1]) ||
    ({} as Required<CssLikeStyles>);

  const getActiveItemStyles = (
    activeStyles: string,
  ): Required<CssLikeStyles> => {
    if (activeStyles === 'ownStyles' || activeStyles === '') {
      return activeElementStyles as Required<CssLikeStyles>;
    }
    if (activeStyles === activeElementType) {
      return activeEntityStyles;
    }
    return activeSharedStyles;
  };

  const activeItemStyles = getActiveItemStyles(editableStyles);

  return (
    activeItemStyles[ruleName] ||
    activeSharedStyles[ruleName] ||
    activeEntityStyles[ruleName]
  );
}

export function selectShowingBorders(state: AppReduxState) {
  return selectProjectState(state).ui.showContainersBorders;
}

export function selectActiveItemChildren(
  state: AppReduxState,
  childType: ChildEntity,
) {
  const activeElement = selectActiveElement(state);
  return activeElement.children
    .map((childId) => selectElementById(childId)(state))
    .filter((child) => child.type === childType);
}

export const selectElementStyles = (elementId: string) => ({
  project,
}: AppReduxState) => project.data.elements[elementId]?.styles.ownStyles;

export const selectElementParameters = (elementId: string) => ({
  project,
}: AppReduxState) => project.data.elements[elementId]?.parameters;

export const selectUndoActions = ({ project }: AppReduxState) =>
  project.control.undoActions;

export const selectRedoActions = ({ project }: AppReduxState) =>
  project.control.redoActions;

export const selectHistory = ({ project }: AppReduxState) =>
  project.control.history;

export const selectActiveItemChildrenStyles = makeActiveElementInfoSelector(
  'styles',
);

export const selectActiveElementParams = (state: AppReduxState) => {
  const activeElement = selectActiveElement(state);
  return activeElement.parameters;
};

export function selectItemToCopyInfo(state: AppReduxState) {
  return selectProjectState(state).ui.itemToCopyInfo;
}

export function selectScreenLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.screenLoader;
}

export function selectProjectLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.projectLoader;
}

export function selectAnalyzerLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.analyzerLoader;
}

export function selectCustomElementsPagination(
  state: AppReduxState,
): PaginatedArray<LibraryElement<Entity>> {
  return selectProjectState(state).data.customElementsData;
}

export const selectCustomLibraryElements = (
  state: AppReduxState,
): LibraryElement<Entity>[] => {
  return selectProjectState(state).data.customElementsData.results;
};

export const selectElementsForScreenById = (state, screenId) => {
  const screen = selectScreenById(screenId)(state);
  const rootId = screen.element;
  const tree = buildElementsTree(state.project.data.elements, rootId);
  return flattenElements([tree]);
};

export const selectElementsForScreen = (screenId: number) => (
  state: AppReduxState,
) => selectElementsForScreenById(state, screenId);

export const selectElementsForCurrentScreen = createSelector(
  selectAllElements,
  selectCurrentScreenId,
  selectScreens,
  (elements, id, screens) => {
    const screen = screens.find((screen) => screen.id === id);
    if (!screen) return {};

    const elementId = screen.element;

    const tree = buildElementsTree(elements, elementId);
    return flattenElements([tree]);
  },
);

export const selectBorderedElementsRef = (
  state: AppReduxState,
): BorderedElementsRef => {
  return selectProjectState(state).ui.borderedElementsRef;
};

export const selectBorderedRef = (id: string) => (state: AppReduxState) => {
  return selectProjectState(state).ui.borderedElementsRef[id];
};

export const selectCurrentDropTargetId = (state: AppReduxState) => {
  const dropTargetParams = selectProjectState(state).ui.currentDropTargetParams;
  return dropTargetParams ? dropTargetParams.id : null;
};

export const selectCurrentDropTargetParams = (state: AppReduxState) => {
  return selectProjectState(state).ui.currentDropTargetParams;
};

export const selectCustomElementsHasNext = (state: AppReduxState) => {
  return !!selectProjectState(state).data.customElementsData.next;
};

export const selectDisplayStyles = (state: AppReduxState) => {
  const activeElementStyles = {
    display: selectCurrentEditableStyles(state, 'display'),
    'justify-content': selectCurrentEditableStyles(state, 'justify-content'),
    'align-items': selectCurrentEditableStyles(state, 'align-items'),
    'flex-direction': selectCurrentEditableStyles(state, 'flex-direction'),
  };

  return getDisplayStyles(activeElementStyles);
};

export const selectElementFileInput = (id: string) => (
  state: AppReduxState,
) => {
  return selectProjectState(state).data.elementInputs[id];
};
