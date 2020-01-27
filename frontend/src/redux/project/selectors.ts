import { makeFeatureStateSelector } from "$shared/redux";
import { AppReduxState } from '$shared/types/app';

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

export function selectIsAddElementsModalOpened(state: AppReduxState) {
  return selectFeatureState(state).ui.isAddElementsModalOpened;
};

export function selectLibraryElements(state: AppReduxState) {
  return selectFeatureState(state).data.libraryElements;
};

export function selectCurrentProject(state: AppReduxState) {
  return selectFeatureState(state).edit.currentProject;
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

export const selectActiveItemStyles = makeActiveItemInfoSelector('styles');
export const selectActiveItemParams = makeActiveItemInfoSelector('parameters');

function makeActiveItemInfoSelector(prop: 'styles' | 'parameters') {
  return (state: AppReduxState) => {
    const activeItem = selectActiveItem(state);
    const scenarios = selectScenarios(state);
    const scenarioElements = selectScenariosElements(state);
  
    const activeItemIsRoot = activeItem.itemType === 'root';
  
    if (activeItemIsRoot) {
      const rootID = selectRootScenario(state)?.id;
      return rootID ? scenarios[rootID][prop] : {};
    }
  
    if (activeItem.itemId === 'none') {
      return {};
    }
  
    const itemID = parseInt(activeItem.itemId, 10);
    return activeItem.itemId.slice(-1) === 's' ? scenarios[itemID][prop] : scenarioElements[itemID][prop];
  };
}

export function selectItemToCopyID(state: AppReduxState) {
  return selectFeatureState(state).ui.itemToCopyID;
};

export function selectClosestContainerID(state: AppReduxState, itemID: string): string | null {
  if (itemID.slice(-1) === 's') {
    return itemID;
  } else if (itemID !== 'none' && itemID.slice(-1) === 'e') {
    const element = selectScenarioElement(state, parseInt(itemID));
    return `${element.parameters.parent_id}s`;
  } else {
    return null;
  }
}
