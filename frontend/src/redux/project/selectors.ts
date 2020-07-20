import { makeFeatureStateSelector } from "$shared/redux";
import { AppReduxState } from '$shared/types/app';
import { ChildEntity, Entity } from "$domain/core";
import { findChildByID } from "$utils/ElementsTreeHelper";
import { LibraryElement } from "$api/types";
import { CssLikeStyles } from "$utils/StyleHelper";

export const selectFeatureState = makeFeatureStateSelector('project');

export function selectProjects(state: AppReduxState) {
  return selectFeatureState(state).data.listProject;
};

export function selectScenarios(state: AppReduxState) {
  return selectFeatureState(state).edit.present.scenarios;
};

export function selectScenario(state: AppReduxState, id: number) {
  return selectFeatureState(state).edit.present.scenarios[id];
}

export function selectRootScenario(state: AppReduxState) {
  const scenarios = selectFeatureState(state).edit.present.scenarios;
  return Object.values(scenarios).find(x => x.parent_id === -1);
};

export function selectScenariosElements(state: AppReduxState) {
  return selectFeatureState(state).edit.present.scenarioElements;
};

export function selectScenarioElement(state: AppReduxState, id: number) {
  return selectFeatureState(state).edit.present.scenarioElements[id];
};

export function selectModifyElements(state: AppReduxState) {
  return selectFeatureState(state).edit.present.modifyElements;
};

export function selectCurrentScreen(state: AppReduxState) {
  return selectFeatureState(state).edit.present.currentScreen;
};

export function selectScreens(state: AppReduxState) {
  return selectFeatureState(state).edit.present.screens;
};

export function selectNotification(state: AppReduxState) {
  return selectFeatureState(state).edit.present.notification;
};

export function selectIsAddElementsModalOpened(state: AppReduxState) {
  return selectFeatureState(state).ui.isAddElementsModalOpened;
};

export function selectSavedElementsValues(state: AppReduxState) {
  return selectFeatureState(state).ui.savedElementsValues;
};

export function selectLibraryElements(state: AppReduxState) {
  return selectFeatureState(state).data.libraryElements;
};

export function selectCurrentProject(state: AppReduxState) {
  return selectFeatureState(state).edit.present.currentProject;
};

export function selectListSortable(state: AppReduxState) {
  return selectFeatureState(state).edit.present.currentScreen.listSortable;
};

export function selectRootElement(state: AppReduxState) {
  return selectFeatureState(state).edit.present.rootElement;
};

export function selectRootID(state: AppReduxState) {
  return selectFeatureState(state).edit.present.rootElement.id;
};

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectFeatureState(state).edit.present.uploadedImageInfo;
};

export function selectLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.present.loader;
};

export function selectScenarioLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.present.scenarioLoader;
};

export function selectProjectLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.present.listProjectLoader;
};

export function selectActiveItem(state: AppReduxState) {
  return selectFeatureState(state).ui.activeItem;
};

export function selectActiveItemChildren(state: AppReduxState, childType: ChildEntity) {
  const activeItem = selectActiveItem(state);
  const elementsTree = selectRootElement(state);
  const element = findChildByID(elementsTree, activeItem.itemId);

  if (!element) {
    return [];
  }
 
  const children = element.children.filter(child => child.type === childType);
  return children;
};

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
  return selectFeatureState(state).ui.itemToCopyInfo;
};
