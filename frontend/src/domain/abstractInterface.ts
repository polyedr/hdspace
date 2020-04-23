import * as R from 'ramda';

import { ILSItem } from '$redux/project/types';
import { T as ProjectT } from '$redux/project';
import { DEFAULT_LS } from '$constants/defaultParams';
import { scenarioItemToLS, elementToLS } from '$utils/parseScenario';

function normalizeID(id: string | number) {
  // omits postfix 's' | 'e' from id
  return typeof id === 'number' ? id : parseInt(id);
}

export function isContainer(x: ProjectT.IScenarioElement | ProjectT.IScenarioItem): x is ProjectT.IScenarioItem;
export function isContainer(x: string): boolean;
export function isContainer(x: ProjectT.IScenarioElement | ProjectT.IScenarioItem | string) {
  if (typeof x === 'string') {
    return x.slice(-1) === 's';
  } else {
    return x.struct_type === 'container';
  }
}

function allChildrenTheSameInvariant(children: string[], newChildren: string[]) {
  return R.symmetricDifference(children, newChildren).length === 0;
}

export function rearrangeSameChildren(containers: ProjectT.IScenarios, parentID: string | number, children: string[]) {
  const parentLens = makeContainerLens(normalizeID(parentID));
  if (!allChildrenTheSameInvariant(children, R.view(parentLens.children, containers))) {
    throw new Error('Invariant violated in rearrangeChildren');
  }
  return R.set(parentLens.children, children, containers);
}

export function removeChildFromParent(containers: ProjectT.IScenarios, parentID: string | number, childID: string) {
  const childIsContainer = childID.slice(-1) === 's';
  const parentLens = makeContainerLens(normalizeID(parentID));

  if (childIsContainer) {
    return R.over(parentLens.children, (children: string[]) => R.without([childID], children), containers);
  } else {
    return R.pipe(
      R.over(parentLens.elements, (elements: number[]) => R.without([normalizeID(childID)], elements)),
      R.over(parentLens.children, (children: string[]) => R.without([childID], children)),
    )(containers);
  }
}

export function addChildToParent(
  containers: ProjectT.IScenarios,
  elements: ProjectT.IScenarioElements,
  parentID: string | number,
  childID: string,
  at?: number, // TODO: add public helper to help client to calculate item position
): { scenarios: ProjectT.IScenarios; elements: ProjectT.IScenarioElements, affectedItemsIDs: AffectedItemsIDs } {
  const childIsContainer = childID.slice(-1) === 's';
  const normalizedParentID = normalizeID(parentID);
  const normalizedChildID = normalizeID(childID);
  const parentLens = makeContainerLens(normalizedParentID);

  if (childIsContainer) {
    const childLens = makeContainerLens(normalizedChildID);
    const newContainers = R.pipe(
      R.over(parentLens.children, (children: string[]) => R.insert(
        at !== undefined ? at : children.length,
        childID,
        children
      )),
      R.set(childLens.parent, normalizeID(parentID)),
    )(containers);
    return {
      scenarios: newContainers, elements, affectedItemsIDs: { s: [normalizedParentID, normalizedChildID], e: [] },
    };
  } else {
    const childLens = makeElementLens(normalizedChildID);
    const newContainers = R.pipe(
      R.over(parentLens.children, (children: string[]) => R.insert(
        at !== undefined ? at : children.length,
        childID,
        children
      )),
      R.over(parentLens.elements, (elements: number[]) => elements.concat(normalizeID(childID))),
    )(containers);

    const newElements = R.pipe(
      R.set(childLens.parent, normalizedParentID),
      R.set(childLens.scenario, normalizedParentID),
    )(elements);

    return {
      scenarios: newContainers, elements: newElements, affectedItemsIDs: { s: [normalizedParentID], e: [normalizedChildID] }
    };
  }
}

export function getItemParentID(containers: ProjectT.IScenarios, elements: ProjectT.IScenarioElements, itemID: string) {
  if (isContainer(itemID)) {
    return containers[normalizeID(itemID)].parent_id;
  } else {
    return elements[normalizeID(itemID)].parameters.parent_id;
  }
}

type AffectedItemsIDs = { s: number[], e: number[] };

export function wrapIntoContainer(
  containers: ProjectT.IScenarios,
  elements: ProjectT.IScenarioElements,
  containerWrapper: ProjectT.IScenarioItem,
  itemToWrapID: string,
): { scenarios: ProjectT.IScenarios; elements: ProjectT.IScenarioElements, affectedItemsIDs: AffectedItemsIDs } {
  const itemIsContainer = isContainer(itemToWrapID);
  const itemParentID = getItemParentID(containers, elements, itemToWrapID);

  const parentLens = makeContainerLens(itemParentID);
  const containerWrapperLens = makeContainerLens(containerWrapper.id);

  if (itemIsContainer) {
  const itemLens = makeContainerLens(normalizeID(itemToWrapID));

  const newContainers = R.pipe(
    R.set(itemLens.parent, containerWrapper.id),
    R.set(containerWrapperLens.children, [itemToWrapID]),
    R.set(containerWrapperLens.parent, itemParentID),
    R.over(parentLens.children, R.map((x: string) => x === itemToWrapID ? `${containerWrapper.id}s` : x)),
  )({
    ...containers,
    [containerWrapper.id]: containerWrapper,
  });

  return {
    scenarios: newContainers, elements,
    affectedItemsIDs: { s: [normalizeID(itemToWrapID), itemParentID, containerWrapper.id], e: [] }
  };
 } else {
  const itemLens = makeElementLens(normalizeID(itemToWrapID));

  const newContainers = R.pipe(
    R.set(containerWrapperLens.parent, itemParentID),
    R.set(containerWrapperLens.elements, [normalizeID(itemToWrapID)]),
    R.set(containerWrapperLens.children, [itemToWrapID]),
    R.over(parentLens.children, R.map((x: string) => x === itemToWrapID ? `${containerWrapper.id}s` : x)),
    R.over(parentLens.elements, R.without([normalizeID(itemToWrapID)])),
  )({
    ...containers,
    [containerWrapper.id]: containerWrapper,
  });

  const newElements = R.pipe(
    R.set(itemLens.parent, containerWrapper.id),
    R.set(itemLens.scenario, containerWrapper.id),
  )(elements);

  return {
    scenarios: newContainers, elements: newElements,
    affectedItemsIDs: { s: [itemParentID, containerWrapper.id], e: [normalizeID(itemToWrapID)] }
  };
 }
}

/* list sortable start */

export const constructAIMap = (
  containers: ProjectT.IScenarios,
  elements: ProjectT.IScenarioElements,
): ProjectT.IListSortable => {
  const root = R.values(containers).find(x => x.parent_id === -1);
  if (root) {
    const rootScenario: ILSItem = {
      id: root.id,
      type: 'root',
      children: root.parameters.children,
    };

    const childrenToLS = (rawChildrenIDs: string[]): ProjectT.IListSortable => rawChildrenIDs.reduce((acc: ProjectT.IListSortable, rawChildID) => {
      const isScenario = isContainer(rawChildID);
      const childID = parseInt(rawChildID);
      if (isScenario) {
        const scenario = containers[childID];
        return { ...acc, [rawChildID]: scenarioItemToLS(scenario), ...childrenToLS(scenario.parameters.children) };
      }
      const element = elements[childID];
      return { ...acc, [rawChildID]: elementToLS(element) };
    }, { root: rootScenario });
  
    const listSortable = childrenToLS(rootScenario.children);
    return listSortable;
  } else {
    return DEFAULT_LS;
  }
};

export function removeItem(
  containers: ProjectT.IScenarios,
  elements: ProjectT.IScenarioElements,
  currentAiMap: ProjectT.IListSortable,
  itemID: string,
): { scenarios: ProjectT.IScenarios, elements: ProjectT.IScenarioElements, removedItems: { s: number[], e: number[] } } {
  const itemParentID = getItemParentID(containers, elements, itemID);
  const containerParentLens = makeContainerLens(normalizeID(itemParentID));

  const collectAllItemsIDsToRemove = (acc: string[], aiMap: ProjectT.IListSortable, id: string): string[] => {
    if (aiMap[id].children.length === 0) {
      return [id];
    }

    return aiMap[id].children.reduce(
      (innerAcc, x) => innerAcc.concat(collectAllItemsIDsToRemove(acc, currentAiMap, x)), [id]
    );
  };

  const allItemsToRemove = collectAllItemsIDsToRemove([], currentAiMap, itemID);

  const [rawContainersToRemove, rawElementsToRemove] = allItemsToRemove.reduce((acc: [string[], string[]], x) => {
    return isContainer(x) ? [[...acc[0], x], acc[1]] : [acc[0], [...acc[1], x]]
  }, [[], []]);

  const containersToRemove = rawContainersToRemove.map(x => parseInt(x));
  const elementsToRemove = rawElementsToRemove.map(x => parseInt(x));
  const childrenToRemove = R.flatten(Object.values(elements).map(element => element.children.map(child => child.id))) as unknown as number[];

  const newContainers = R.pipe(
    R.over(containerParentLens.children, (children: string[]) => R.without([itemID], children)),
    isContainer(itemID)
      ? R.identity
      : R.over(containerParentLens.elements, (elements: number[]) => R.without([parseInt(itemID), ...childrenToRemove], elements))
  )(containers);

  return {
    scenarios: R.omit(R.map(R.toString, containersToRemove), newContainers),
    elements: R.omit(R.map(R.toString, [...elementsToRemove, ...childrenToRemove]), elements),
    removedItems: { s: containersToRemove, e: [...elementsToRemove, ...childrenToRemove] },
  };
}

export function isRoot(aiMap: ProjectT.IListSortable, itemToTest?: string): boolean;
export function isRoot(parentID: number): boolean;
export function isRoot(x: ProjectT.IListSortable | number, itemToTest?: string) {
  if (typeof x === 'number') {
    return x === -1;
  } else {
    return itemToTest ? x.root.id === parseInt(itemToTest) : false;
  }
}

/* list sortable end */

type CollectChildrenAcc = { scenariosIDs: string[], elementsIDs: string[] };

export const collectChildren = (containers: ProjectT.IScenarioItem[], children: string[]) => children
  .reduce((acc: CollectChildrenAcc, x): CollectChildrenAcc => {
    const container = isContainer(x) ? containers.find(s => s.id === parseInt(x)) : null;
    const { elementsIDs, scenariosIDs } = container
      ? collectChildren(containers, container.parameters.children)
      : { elementsIDs: [], scenariosIDs: [] };
    return { elementsIDs: acc.elementsIDs.concat(elementsIDs), scenariosIDs: acc.scenariosIDs.concat(scenariosIDs)};
  },
  { scenariosIDs: children.filter(isContainer), elementsIDs: children.filter(x => !isContainer(x))}
);

export function makeContainerLens(scenarioID?: number) {
  const specifiedEntity = scenarioID ? [scenarioID.toString()] : [];
  return {
    children: R.lensPath(specifiedEntity.concat(['parameters', 'children'])),
    parent: R.lensPath(specifiedEntity.concat(['parent_id'])),
    elements: R.lensPath(specifiedEntity.concat(['elements'])),
    id: R.lensPath(specifiedEntity.concat(['id'])),
    screen: R.lensPath(specifiedEntity.concat(['screen'])),
  };
};

export function makeElementLens(elementID?: number) {
  const specifiedEntity = elementID ? [elementID.toString()] : [];
  return {
    parent: R.lensPath(specifiedEntity.concat(['parameters', 'parent_id'])),
    scenario: R.lensPath(specifiedEntity.concat(['scenario'])),
    id: R.lensPath(specifiedEntity.concat(['id'])),
  };
};
