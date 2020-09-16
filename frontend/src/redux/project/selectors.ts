import { NamedServerElements } from './types';
import {
  DEFAULT_ACTIVE_ELEMENT,
  DEFAULT_PROJECT,
  DEFAULT_ROOT,
  DEFAULT_SCREEN,
} from '../../constants/defaultParams';
import { ChildEntity, Entity } from '../../domain/core';
import { AppReduxState } from '../../shared/types/app';
import { LibraryElement, Project } from '../../api/types';
import { CssLikeStyles } from '../../utils/StyleHelper';
import { makeFeatureStateSelector } from '../../shared/redux';
import { mapToArr } from '../../utils/mappings';
import { Screen } from './types';

export const selectProjectState = makeFeatureStateSelector('project');

export const selectProjects = ({ project }: AppReduxState) =>
  mapToArr<Project>(project.data.projects);

export const selectProjectById = (projectId: number) => ({
  project,
}: AppReduxState) => project.data.projects[projectId];

export const selectScreenRootElement = (screenId: number) => ({
  project,
}: AppReduxState) => project.data.screens[screenId]?.element || DEFAULT_ROOT;

export const selectCurrentScreenId = ({ project }: AppReduxState) =>
  project.edit.currentScreenId;

export const selectCurrentScreen = (state: AppReduxState) =>
  state.project.data.screens[selectCurrentScreenId(state)] || DEFAULT_SCREEN;

export const selectScreens = ({ project }: AppReduxState) =>
  mapToArr<Screen>(project.data.screens);

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id] || DEFAULT_SCREEN;

export function selectNotification(state: AppReduxState) {
  return selectProjectState(state).edit.notification;
}

export const selectIsAddElementsModalOpened = ({ project }: AppReduxState) =>
  project.ui.isAddElementsModalOpened;

export const selectSavedElementsValues = ({ project }: AppReduxState) =>
  project.ui.savedElementsValues;

export const selectCurrentProjectId = ({ project }: AppReduxState) =>
  project.edit.currentProjectId;

export const selectCurrentProject = (state: AppReduxState) =>
  state.project.data.projects[selectCurrentProjectId(state)] || DEFAULT_PROJECT;

export const selectCurrentRootElement = (state: AppReduxState) =>
  selectCurrentScreen(state).element;

export const selectRootId = (state: AppReduxState) =>
  selectCurrentScreen(state).element?.id || '-1';

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectProjectState(state).edit.uploadedImageInfo;
}

export function selectLoader(state: AppReduxState) {
  return selectProjectState(state).communication.loader;
}

export function selectScenarioLoader(state: AppReduxState) {
  return selectProjectState(state).communication.scenarioLoader;
}

export function selectProjectListLoader(state: AppReduxState) {
  return selectProjectState(state).communication.projectListLoader;
}

export const selectActiveElementId = ({ project }: AppReduxState) =>
  project.edit.activeElementId;

export const selectActiveElement = (state: AppReduxState) =>
  state.project.data.elements[selectActiveElementId(state)] ||
  DEFAULT_ACTIVE_ELEMENT;

export function selectEditableStyles(state: AppReduxState) {
  return selectProjectState(state).ui.editableStyles;
}

export const selectElementById = (id: string) => ({ project }: AppReduxState) =>
  project.data.elements[id];

export const buildElementsTree = (elementId: string) => (
  state: AppReduxState,
): LibraryElement<any> => {
  const rootElement = selectElementById(elementId)(state);

  return {
    ...rootElement,
    children: rootElement?.children?.map((childId) =>
      buildElementsTree(childId)(state),
    ),
  };
};

export function selectSharedStyles(state: AppReduxState, elementType: string) {
  return selectCurrentProject(state).projectData.classes.find(
    (cssClass) => cssClass.className === elementType,
  )?.rules;
}

function makeActiveItemInfoSelector<
  T extends LibraryElement<Entity>,
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

export const selectActiveItemStyles = makeActiveItemInfoSelector('styles');

export function selectCurrentEditableStyles<
  T extends keyof Required<CssLikeStyles>
>(state: AppReduxState, ruleName: T) {
  const activeItemType = selectActiveElement(state).type;
  const activeElementStyles = selectActiveItemStyles<
    LibraryElement<Entity, [], {}, Required<CssLikeStyles>>
  >(state).ownStyles;
  const activeElementClassNames = selectActiveItemStyles(state).classNames;
  const editableStyles = selectEditableStyles(state);
  const activeEntityStyles =
    (activeItemType !== 'none' && selectSharedStyles(state, activeItemType)) ||
    ({} as Required<CssLikeStyles>);
  const activeSharedStyles =
    selectSharedStyles(state, activeElementClassNames[1]) ||
    ({} as Required<CssLikeStyles>);

  const getActiveItemStyles = (activeStyles: string) => {
    if (activeStyles === 'ownStyles' || activeStyles === '') {
      return activeElementStyles;
    }
    if (activeStyles === activeItemType) {
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

export const selectRemoteMove = ({ project }: AppReduxState) =>
  project.control.remoteMove;

export const selectActiveItemChildrenStyles = makeActiveItemInfoSelector(
  'styles',
);
export const selectActiveItemParams = makeActiveItemInfoSelector('parameters');

export function selectItemToCopyInfo(state: AppReduxState) {
  return selectProjectState(state).ui.itemToCopyInfo;
}

export function selectScreenLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.screenLoader;
}

export function selectProjectLoader(state: AppReduxState): boolean {
  return selectProjectState(state).communication.projectLoader;
}

export const selectInitialProjectLoad = (state: AppReduxState): boolean =>
  selectProjectState(state).communication.initialProjectLoadDone;

export const selectActiveItemElement = (
  state: AppReduxState,
): LibraryElement<Entity, LibraryElement<Entity>[]> => {
  const activeItem = selectActiveItem(state);
  const elementsTree = selectRootElement(state);
  const element = findChildByID(elementsTree, activeItem.itemId);

  if (!element) {
    throw new Error(`Can not find ${activeItem.itemId} in tree!`);
  }

  return element;
};

export function selectCustomLibraryElements(
  state: AppReduxState,
): NamedServerElements {
  return selectProjectState(state).ui.customLibraryElements;
}
