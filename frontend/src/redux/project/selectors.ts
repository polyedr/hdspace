import { makeFeatureStateSelector } from "$shared/redux";
import { AppReduxState } from '$shared/types/app';
import { ChildEntity, Entity } from "$domain/core";
import { findChildByID } from "$utils/ElementsTreeHelper";
import { LibraryElement } from "$api/types";
import { CssLikeStyles } from "$utils/StyleHelper";

export const selectProjectState = makeFeatureStateSelector('project');

export function selectProjects(state: AppReduxState) {
  return selectProjectState(state).data.listProject;
}

export function selectScenarios(state: AppReduxState) {
  return selectProjectState(state).edit.scenarios;
}

export function selectScenario(state: AppReduxState, id: number) {
  return selectProjectState(state).edit.scenarios[id];
}

export function selectRootScenario(state: AppReduxState) {
  const scenarios = selectProjectState(state).edit.scenarios;
  return Object.values(scenarios).find(x => x.parent_id === -1);
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

export function selectListSortable(state: AppReduxState) {
  return selectProjectState(state).edit.currentScreen.listSortable;
}

export function selectRootElement(state: AppReduxState) {
  return selectProjectState(state).control.present.rootElement;
}

export function selectRootID(state: AppReduxState) {
  return selectProjectState(state).control.present.rootElement.id;
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

export function selectActiveItemChildren(state: AppReduxState, childType: ChildEntity) {
  const activeItem = selectActiveItem(state);
  const elementsTree = selectRootElement(state);
  const element = findChildByID(elementsTree, activeItem.itemId);

  if (!element) {
    return [];
  }
 
  const children = element.children.filter(child => child.type === childType);
  return children;
}

export const selectElementStyles = (id: string) => (state: AppReduxState) => findChildByID(state.project.control.present.rootElement, id)?.styles;

export const selectElementParameters = (id: string) => (state: AppReduxState) => findChildByID(state.project.control.present.rootElement, id)?.parameters;

export const selectUndoActions = (state: AppReduxState) => selectProjectState(state).control.present.undoActions;

export const selectRedoActions = (state: AppReduxState) => selectProjectState(state).control.present.redoActions;

export const selectHistoryLength = (state: AppReduxState) => selectProjectState(state).control.past.length;

export const selectAdd = (state: AppReduxState) => selectProjectState(state).control.present.add;

export const selectActiveItemStyles = makeActiveItemInfoSelector('styles');
export const selectActiveItemChildrenStyles = makeActiveItemInfoSelector('styles');
export const selectActiveItemParams = makeActiveItemInfoSelector('parameters');

function makeActiveItemInfoSelector<T extends LibraryElement<Entity>, K extends 'styles' | 'parameters'>(
  prop: K
): <R extends T>(state: AppReduxState) => K extends 'styles' ? Required<CssLikeStyles> : R['parameters'] {
  return (state: AppReduxState) => {
    const activeItem = selectActiveItem(state);
    const elementsTree = selectRootElement(state);
    const element = findChildByID(elementsTree, activeItem.itemId);

    if(!element) {
      throw new Error(`Can not find ${activeItem.itemId} in tree!`);
    }

    return element[prop] as K extends 'styles' ? Required<CssLikeStyles> : T['parameters'];
  };
}

export function selectItemToCopyInfo(state: AppReduxState) {
  return selectProjectState(state).ui.itemToCopyInfo;
}

export function selectScreenLoader (state: AppReduxState): boolean {
  return selectProjectState(state).communication.screenLoader
}

export function selectProjectLoader (state: AppReduxState): boolean {
  return selectProjectState(state).communication.projectLoader
}