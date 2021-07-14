import { flatten } from 'ramda';
import { Entity, LibraryElement } from '../types';

export const findParentByChildID = (
  element: LibraryElement<Entity, LibraryElement<Entity>[]>,
  targetID: string,
  // eslint-disable-next-line consistent-return
): LibraryElement<Entity, LibraryElement<Entity>[]> | undefined => {
  if (element.children.some((child) => child.id === targetID)) {
    return element;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const child of element.children) {
    const targetParent = findParentByChildID(child, targetID);

    if (targetParent) {
      return targetParent;
    }
  }
};

export const getElementsArray = (
  root: LibraryElement<Entity, LibraryElement<Entity>[]>,
): LibraryElement<Entity, LibraryElement<Entity>[]>[] => {
  const array = root.children.map((child) => getElementsArray(child));
  return flatten([root, array]) as LibraryElement<
    Entity,
    LibraryElement<Entity>[]
  >[];
};

export const updateElementParameters = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity,
>(
  elementID: string,
  parameters: Partial<LibraryElement<T, LibraryElement<K>[]>['parameters']>,
  root: LibraryElement<P, LibraryElement<R>[]>,
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    parameters:
      root.id === elementID
        ? { ...root.parameters, ...parameters }
        : root.parameters,
    children: root.children.map((child) =>
      updateElementParameters(elementID, parameters, child),
    ),
  };
};

export const replaceChild = (
  elementID: string,
  newChild: LibraryElement<Entity>,
  root: LibraryElement<Entity>,
): LibraryElement<Entity> => {
  return elementID === root.id
    ? newChild
    : {
        ...root,
        children: root.children.map((child) =>
          replaceChild(elementID, newChild, child),
        ),
      };
};
