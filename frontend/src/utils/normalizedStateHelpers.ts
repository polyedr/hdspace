import produce from 'immer';
import {
  Indices,
  Normalized,
  ParentIds,
  StateElement,
} from '../redux/project/types';
import { LibraryElement } from '../api/types';
import { AVAILABLE_CHILDREN, Entity } from '../domain/core';

export const arrayToMap = <T extends { id: any }>(arr: T[]): Normalized<T> => {
  const res = {};
  arr.forEach((item) => {
    res[item.id] = item;
  });
  return res;
};

export const mapToArr = <T>(map: Normalized<T>): T[] => Object.values(map);

export const flattenElements = (
  elements: LibraryElement<any>[],
  parent?: string,
): Normalized<StateElement> =>
  elements.reduce(
    (acc, element) => ({
      ...acc,
      [element.id]: {
        ...element,
        children: element.children.map((child) => child.id),
        parent,
      },
      ...flattenElements(element.children, element.id),
    }),
    {},
  );

export const buildElementsTree = (
  elements: Normalized<StateElement>,
  rootElementId: string,
): LibraryElement<any> => {
  const rootElement = elements[rootElementId];

  return {
    ...rootElement,
    children: rootElement?.children?.map((childId) =>
      buildElementsTree(elements, childId),
    ),
  };
};

export const removeMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> => {
  const newState = { ...state };
  const target = newState[elementId];

  if (target.parent) {
    const parent = newState[target.parent];
    parent.children = parent.children.filter((id) => id !== elementId);
    parent.children.forEach((id, i) => {
      newState[id] = {
        ...newState[id],
        buoyancy: i,
      };
    });
  }

  return newState;
};

export const addMapElements = (
  state: Normalized<StateElement>,
  elements: LibraryElement<any>[],
  parentId: string,
): Normalized<StateElement> => {
  const result = {
    ...state,
    ...flattenElements(elements, parentId),
    [parentId]: {
      ...state[parentId],
      children: [...state[parentId].children, ...elements.map((el) => el.id)],
    },
  };
  result[parentId].children.forEach((child, i) => {
    result[child].buoyancy = i;
  });
  return result;
};

export const updateMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
  data: Partial<StateElement>,
): Normalized<StateElement> => ({
  ...state,
  [elementId]: {
    ...state[elementId],
    ...data,
  },
});

export const moveMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
  indices: Indices,
  parents: ParentIds,
): Normalized<StateElement> => {
  const { newIndex, oldIndex } = indices;
  const { oldParentId, newParentId } = parents;
  const newState = { ...state };

  newState[oldParentId].children.splice(oldIndex, 1);

  newState[oldParentId].children.forEach((id, i) => {
    newState[id] = {
      ...newState[id],
      buoyancy: i,
    };
  });

  newState[newParentId].children.splice(newIndex, 0, elementId);
  newState[newParentId].children.forEach((id, i) => {
    newState[id] = {
      ...newState[id],
      buoyancy: i,
    };
  });
  newState[elementId].parent = newParentId;
  return newState;
};

export const insertMapElement = (
  state: Normalized<StateElement>,
  element: LibraryElement<any>,
  parentId: string,
  childId: string,
): Normalized<StateElement> => {
  const newState = { ...state, ...flattenElements([element], parentId) };
  const el = newState[element.id];
  const child = newState[childId];
  const parent = newState[parentId];

  parent.children.splice(child.buoyancy, 1, el.id);

  el.children = [childId];
  el.buoyancy = child.buoyancy;

  child.parent = el.id;
  child.buoyancy = 0;

  return newState;
};

export const extractMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> => {
  const newState = { ...state };
  const element = newState[elementId];
  if (!element.parent) return newState;

  const parent = newState[element.parent];
  parent.children.splice(element.buoyancy, 1, ...element.children);
  parent.children.forEach((id, i) => {
    newState[id].buoyancy = i;
  });

  element.children.forEach((id) => {
    newState[id].parent = parent.id;
  });

  element.children = [];
  return newState;
};

export const restoreMapElement = (
  state: Normalized<StateElement>,
  elementId: string,
): Normalized<StateElement> =>
  // eslint-disable-next-line consistent-return
  produce(state, (draft) => {
    const element = draft[elementId];
    if (!element.parent) return draft;
    const parent = draft[element.parent];
    parent.children.splice(element.buoyancy, 0, element.id);

    parent.children.forEach((id, i) => {
      draft[id] = {
        ...draft[id],
        buoyancy: i,
      };
    });
  });

export const restoreMapElementChildren = (
  state: Normalized<StateElement>,
  elementId: string,
  childrenIds: string[],
): Normalized<StateElement> =>
  produce(state, (draft) => {
    const element = draft[elementId];

    element.children = childrenIds;
    element.children.forEach((id, i) => {
      draft[id].buoyancy = i;
      draft[id].parent = elementId;
    });
  });

export const canElementBeAdded = (
  elements: Normalized<StateElement>,
  parentId: string,
  childType: Entity,
): boolean => {
  const parent = elements[parentId];

  const sameTypeChildrenAmount =
    parent.children
      .map((id) => elements[id])
      .filter((child) => child.type === childType).length || 0;

  const availableChildrenType = AVAILABLE_CHILDREN[parent.type].all
    ? 'all'
    : childType;

  const availableSameChildren =
    AVAILABLE_CHILDREN[parent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  return sameTypeChildrenAmount < availableSameChildren.max;
};
