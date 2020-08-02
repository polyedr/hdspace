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
  return selectFeatureState(state).edit.scenarios;
};

export function selectScenario(state: AppReduxState, id: number) {
  return selectFeatureState(state).edit.scenarios[id];
}

export function selectRootScenario(state: AppReduxState) {
  const scenarios = selectFeatureState(state).edit.scenarios;
  return Object.values(scenarios).find(x => x.parent_id === -1);
};

export function selectScenariosElements(state: AppReduxState) {
  return selectFeatureState(state).edit.scenarioElements;
};

export function selectScenarioElement(state: AppReduxState, id: number) {
  return selectFeatureState(state).edit.scenarioElements[id];
};

export function selectModifyElements(state: AppReduxState) {
  return selectFeatureState(state).edit.modifyElements;
};

export function selectCurrentScreen(state: AppReduxState) {
  return selectFeatureState(state).edit.currentScreen;
};

export function selectScreens(state: AppReduxState) {
  return selectFeatureState(state).edit.screens;
};

export function selectNotification(state: AppReduxState) {
  return selectFeatureState(state).edit.notification;
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
  return selectFeatureState(state).edit.currentProject;
};

export function selectListSortable(state: AppReduxState) {
  return selectFeatureState(state).edit.currentScreen.listSortable;
};

export function selectRootElement(state: AppReduxState) {
  return selectFeatureState(state).edit.rootElement;
};

export function selectRootID(state: AppReduxState) {
  return selectFeatureState(state).edit.rootElement.id;
};

export function selectUploadedImageInfo(state: AppReduxState) {
  return selectFeatureState(state).edit.uploadedImageInfo;
};

export function selectLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.loader;
};

export function selectScenarioLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.scenarioLoader;
};

export function selectProjectLoader(state: AppReduxState) {
  return selectFeatureState(state).edit.listProjectLoader;
};

export function selectActiveItem(state: AppReduxState) {
  return selectFeatureState(state).ui.activeItem;
};

export function selectEditableStyles(state: AppReduxState) {
  return selectFeatureState(state).ui.editableStyles;
};

export function selectCopiedStyles(state: AppReduxState) {
  return selectFeatureState(state).ui.copiedStyles;
};

export function selectSharedStyles(state: AppReduxState, elementType: string) {
  return selectCurrentProject(state).projectData.classes.find(cssClass => cssClass.className === elementType)?.rules || {};
};

export function selectCurrentEditableStyles(state: AppReduxState, ruleName: keyof CssLikeStyles) {
  const activeItemType = selectActiveItem(state).itemType;
  const activeElementStyles = selectActiveItemStyles(state).ownStyles;
  const activeElementClassNames = selectActiveItemStyles(state).classNames;
  const editableStyles = selectEditableStyles(state);
  const activeTagStyles = activeItemType !== 'none' && selectSharedStyles(state, activeItemType) || {};

  const activeSharedStyles = selectSharedStyles(state, activeElementClassNames[1]) || {};

  const getActiveItemStyles = (editableStyles: string) => {
    if (editableStyles === 'ownStyles' || editableStyles === '') {
      return activeElementStyles;
    } else if (editableStyles === activeItemType) {
      return activeTagStyles;
    } else {
      return activeSharedStyles;
    }
  }

  const activeItemStyles = getActiveItemStyles(editableStyles);

  return activeItemStyles[ruleName] || activeSharedStyles[ruleName] || activeTagStyles[ruleName];
}

export function selectShowingBorders(state: AppReduxState) {
  return selectFeatureState(state).ui.showContainersBorders;
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
): <R extends T>(state: AppReduxState) => K extends 'styles' ? R['styles'] : R['parameters'] {
  return (state: AppReduxState) => {
    const activeItem = selectActiveItem(state);
    const elementsTree = selectRootElement(state);
    const element = findChildByID(elementsTree, activeItem.itemId);

    if(!element) {
      throw new Error(`Can not find ${activeItem.itemId} in tree!`);
    }

    return element[prop] as K extends 'styles' ? T['styles'] : T['parameters'];
  };
}

export function selectItemToCopyInfo(state: AppReduxState) {
  return selectFeatureState(state).ui.itemToCopyInfo;
};
