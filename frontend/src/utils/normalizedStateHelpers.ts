import { Indices, Map, ParentIds, StateElement } from '../redux/project/types';
import { LibraryElement } from '../api/types';

export const arrayToMap = <T extends { id: any }>(arr: T[]): Map<T> => {
  const res = {};
  arr.forEach((item) => {
    res[item.id] = item;
  });
  return res;
};

export const mapToArr = <T>(map: Map<T>): T[] => Object.values(map);

export const flattenElements = (
  elements: LibraryElement<any>[],
  parent?: string,
): Map<StateElement> =>
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
  elements: Map<StateElement>,
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
  state: Map<StateElement>,
  elementId: string,
): Map<StateElement> => {
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
  state: Map<StateElement>,
  elements: LibraryElement<any>[],
  parentId: string,
): Map<StateElement> => {
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
  state: Map<StateElement>,
  elementId: string,
  data: Partial<StateElement>,
): Map<StateElement> => ({
  ...state,
  [elementId]: {
    ...state[elementId],
    ...data,
  },
});

export const moveMapElement = (
  state: Map<StateElement>,
  elementId: string,
  indices: Indices,
  parents: ParentIds,
): Map<StateElement> => {
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
  state: Map<StateElement>,
  element: LibraryElement<any>,
  parentId: string,
  childId: string,
): Map<StateElement> => {
  const newState = { ...state, ...flattenElements([element], parentId) };

  newState[parentId].children = [
    ...newState[parentId].children.filter((id) => id !== childId),
    element.id,
  ];
  newState[childId].parent = element.id;
  newState[element.id].children = [...newState[element.id].children, childId];
  return newState;
};

export const restoreMapElement = (
  state: Map<StateElement>,
  elementId: string,
): Map<StateElement> => {
  const newState = { ...state };
  const element = newState[elementId];
  if (!element.parent) return newState;

  const parent = newState[element.parent];
  parent.children.splice(element.buoyancy, 0, element.id);
  parent.children.forEach((id, i) => {
    newState[id] = {
      ...newState[id],
      buoyancy: i,
    };
  });

  return newState;
};

export const restoreMapElementChildren = (
  state: Map<StateElement>,
  elementId: string,
  childrenIds: string[],
): Map<StateElement> => {
  const newState = { ...state };
  const element = newState[elementId];
  const startIndex = newState[childrenIds[0]].buoyancy;
  element.children.splice(startIndex, 0, ...childrenIds);
  element.children.forEach((id, i) => {
    newState[id] = {
      ...newState[id],
      buoyancy: i,
    };
  });
  return newState;
};
