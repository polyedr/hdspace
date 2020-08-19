import { makeFeatureStateSelector } from '$shared/redux';
import { AppReduxState } from '$shared/types/app';
import { ChildEntity, Entity } from '$domain/core';
import { findChildByID } from '$utils/ElementsTreeHelper';
import { LibraryElement } from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';

export const selectProjectState = makeFeatureStateSelector('project');

export function selectProjects(state: AppReduxState) {
  return selectProjectState(state).data.listProject;
}

export function selectScenarios(state: AppReduxState) {
  return selectProjectState(state).edit.scenarios;
}

export const selectScreenElement = (screenId: number) => (
  state: AppReduxState,
): LibraryElement<'root'> | undefined => {
  const targetScreen = selectProjectState(state).edit.screens.find(
    ({ id }) => id === screenId,
  );
  return targetScreen ? targetScreen.element : undefined;
};

export function selectScenario(state: AppReduxState, id: number) {
  return selectProjectState(state).edit.scenarios[id];
}

export function selectRootScenario(state: AppReduxState) {
  const { scenarios } = selectProjectState(state).edit;
  return Object.values(scenarios).find((x) => x.parent_id === -1);
}

export function selectScenariosElements(state: AppReduxState) {
  return selectProjectState(state).edit.scenarioElements;
}

export function selectScenarioElement(state: AppReduxState, id: number) {
  return selectProjectState(state).edit.scenarioElements[id];
}

export function selectModifyElements(state: AppReduxState) {
  return selectProjectState(state).edit.modifyElements;
}

export function selectCurrentScreen(state: AppReduxState) {
  return selectProjectState(state).edit.currentScreen;
}

export function selectScreens(state: AppReduxState) {
  return selectProjectState(state).edit.screens;
}

export const selectScreenById = (id: number) => (state: AppReduxState) =>
  selectProjectState(state).edit.screens.find((screen) => screen.id === id);

export function selectNotification(state: AppReduxState) {
  return selectProjectState(state).edit.notification;
}

export function selectIsAddElementsModalOpened(state: AppReduxState) {
  return selectProjectState(state).ui.isAddElementsModalOpened;
}

export function selectSavedElementsValues(state: AppReduxState) {
  return selectProjectState(state).ui.savedElementsValues;
}

export function selectLibraryElements(state: AppReduxState) {
  return selectProjectState(state).data.libraryElements;
}

export function selectCurrentProject(state: AppReduxState) {
  return selectProjectState(state).edit.currentProject;
}

export function selectRootElement(state: AppReduxState) {
  return selectProjectState(state).control.rootElement;
}

export function selectRootID(state: AppReduxState) {
  return selectProjectState(state).control.rootElement.id;
}

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectProjectState(state).edit.uploadedImageInfo;
}

export function selectLoader(state: AppReduxState) {
  return selectProjectState(state).communication.loader;
}

export function selectScenarioLoader(state: AppReduxState) {
  return selectProjectState(state).communication.scenarioLoader;
}

export function selectListProjectLoader(state: AppReduxState) {
  return selectProjectState(state).communication.listProjectLoader;
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
    const elementsTree = selectRootElement(state);
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
  const elementsTree = selectRootElement(state);
  const element = findChildByID(elementsTree, activeItem.itemId);

  if (!element) {
    return [];
  }

  return element.children.filter((child) => child.type === childType);
}

export const selectElementStyles = (id: string) => (state: AppReduxState) =>
  findChildByID(state.project.control.rootElement, id)?.styles.ownStyles;

export const selectElementParameters = (id: string) => (state: AppReduxState) =>
  findChildByID(state.project.control.rootElement, id)?.parameters;

export const selectUndoActions = (state: AppReduxState) =>
  selectProjectState(state).control.undoActions;

export const selectRedoActions = (state: AppReduxState) =>
  selectProjectState(state).control.redoActions;

export const selectHistory = (state: AppReduxState) =>
  selectProjectState(state).control.history;

export const selectRemoteMove = (state: AppReduxState) =>
  selectProjectState(state).control.remoteMove;

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
