import { Map } from '../redux/project/types';
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
  parentId?: string,
): Map<LibraryElement<any>> =>
  elements.reduce(
    (acc, element) => ({
      ...acc,
      [element.id]: {
        ...element,
        children: element.children.map((child) => child.id),
        parentId,
      },
      ...flattenElements(element.children, element.id),
    }),
    {},
  );
