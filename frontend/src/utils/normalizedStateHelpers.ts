import { Map, StateElement } from '../redux/project/types';
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

export const removeStateElement = (
  state: Map<StateElement>,
  elementId: string,
): Map<StateElement> => {
  const newState = { ...state };
  const target = newState[elementId];
  if (!target) return newState;

  if (target.parent) {
    const parent = newState[target.parent];
    parent.children = parent.children.filter((id) => id !== elementId);
  }
  const removeChild = (id: string) => {
    newState[id].children.forEach((childId) => removeChild(childId));
    delete newState[id];
  };

  removeChild(elementId);

  return newState;
};

export const addStateElements = (
  state: Map<StateElement>,
  elements: LibraryElement<any>[],
  parent?: string,
): Map<StateElement> => {
  const newPart = flattenElements(elements, parent);
  return {
    ...state,
    ...newPart,
  };
};
