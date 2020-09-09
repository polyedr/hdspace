import {
  DEFAULT_PROJECT,
  DEFAULT_ROOT,
  DEFAULT_SCREEN,
} from '../../constants/defaultParams';
import { ChildEntity, Entity } from '../../domain/core';
import { findChildByID } from '../../utils/ElementsTreeHelper';
import { AppReduxState } from '../../shared/types/app';
import { LibraryElement, Project } from '../../api/types';
import { CssLikeStyles } from '../../utils/StyleHelper';
import { makeFeatureStateSelector } from '../../shared/redux';
import { mapToArr } from '../../utils/mappings';
import { Screen } from './types';

export const selectProjectState = makeFeatureStateSelector('project');

export function selectProjects(state: AppReduxState) {
  return mapToArr<Project>(selectProjectState(state).data.projects);
}

export const selectProjectById = (projectId: number) => (
  state: AppReduxState,
) => selectProjectState(state).data.projects[projectId];

export const selectElementByScreenId = (screenId: number) => ({
  project: {
    data: { screens, elements },
  },
}: AppReduxState): LibraryElement<'root'> => {
  const { elementId } = screens[screenId];
  return elements[elementId] || DEFAULT_ROOT;
};

export const selectCurrentScreenId = (state: AppReduxState) =>
  selectProjectState(state).edit.currentScreenId;

export const selectCurrentScreen = (state: AppReduxState) =>
  state.project.data.screens[selectCurrentScreenId(state)] || DEFAULT_SCREEN;

export function selectScreens({ project }: AppReduxState) {
  return mapToArr<Screen>(project.data.screens);
}

export const selectScreenById = (id: number) => ({ project }: AppReduxState) =>
  project.data.screens[id] || DEFAULT_SCREEN;

export function selectNotification(state: AppReduxState) {
  return selectProjectState(state).edit.notification;
}

export function selectIsAddElementsModalOpened(state: AppReduxState) {
  return selectProjectState(state).ui.isAddElementsModalOpened;
}

export function selectSavedElementsValues(state: AppReduxState) {
  return selectProjectState(state).ui.savedElementsValues;
}

export const selectCurrentProjectId = ({ project }: AppReduxState) =>
  project.edit.currentProjectId;

export const selectCurrentProject = (state: AppReduxState) =>
  state.project.data.projects[selectCurrentProjectId(state)] || DEFAULT_PROJECT;

export const selectRootId = (state: AppReduxState) =>
  selectCurrentScreen(state).elementId || '-1';

export const selectElementById = (id: string) => (
  state: AppReduxState,
): LibraryElement<any> => state.project.data.elements[id];

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

export const selectElementsTree = (state) => {
  const rootId = selectRootId(state);
  if (rootId === '-1') return DEFAULT_ROOT;
  return buildElementsTree(rootId)(state);
};

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

export function selectActiveItem(state: AppReduxState) {
  return selectProjectState(state).ui.activeItem;
}

export function selectEditableStyles(state: AppReduxState) {
  return selectProjectState(state).ui.editableStyles;
}

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
    const activeItem = selectActiveItem(state);
    // const elementsTree = selectRootElement(state);
    const elementsTree = selectElementsTree(state);
    const element = findChildByID(elementsTree, activeItem.itemId);

    if (!element) {
      throw new Error(`Can not find ${activeItem.itemId} in tree!`);
    }

    return element[prop] as K extends 'styles' ? T['styles'] : T['parameters'];
  };
}

export const selectActiveItemStyles = makeActiveItemInfoSelector('styles');

export function selectCurrentEditableStyles<
  T extends keyof Required<CssLikeStyles>
>(state: AppReduxState, ruleName: T) {
  const activeItemType = selectActiveItem(state).itemType;
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
  const activeItem = selectActiveItem(state);
  const elementsTree = selectElementsTree(state);
  // const elementsTree = selectRootElement(state);
  const element = findChildByID(elementsTree, activeItem.itemId);

  if (!element) {
    return [];
  }

  return element.children.filter((child) => child.type === childType);
}

export const selectElementStyles = (screenId: number, elementId: string) => (
  state: AppReduxState,
) =>
  findChildByID(selectElementByScreenId(screenId)(state), elementId)?.styles
    .ownStyles;

export const selectElementParameters = (
  screenId: number,
  elementId: string,
) => (state: AppReduxState) =>
  findChildByID(selectElementByScreenId(screenId)(state), elementId)
    ?.parameters;

export const selectUndoActions = (state: AppReduxState) =>
  selectProjectState(state).control.undoActions;

export const selectRedoActions = (state: AppReduxState) =>
  selectProjectState(state).control.redoActions;

export const selectHistory = (state: AppReduxState) =>
  selectProjectState(state).control.history;

export const selectRemoteMove = (state: AppReduxState) =>
  selectProjectState(state).control.remoteMove;

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
