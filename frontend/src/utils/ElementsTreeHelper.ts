import * as R from 'ramda';
import { LIBRARY_ELEMENTS } from '../domain/libraryElements/libraryElements';
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

export const addChildToElement = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  elementID: string,
  newChild: LibraryElement<T, LibraryElement<K>[]>,
  root: LibraryElement<P, LibraryElement<T | R>[]>,
  childBuoyancy: number,
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const sortedChildren: LibraryElement<P, LibraryElement<T | R>[]>['children'] =
    root.id === elementID
      ? R.insert(
          childBuoyancy,
          newChild,
          root.children,
        ).map((child, index) => ({ ...child, buoyancy: index }))
      : root.children.map((child) =>
          addChildToElement(elementID, newChild, child, childBuoyancy),
        );

  return {
    ...root,
    children: sortedChildren,
  };
};

export const findChildByID = (
  element: LibraryElement<Entity, LibraryElement<Entity>[]>,
  targetID: string,
  // eslint-disable-next-line consistent-return
): LibraryElement<Entity, LibraryElement<Entity>[]> | undefined => {
  if (element.id === targetID) {
    return element;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const child of element.children) {
    const targetChild = findChildByID(child, targetID);

    if (targetChild) {
      return targetChild;
    }
  }
};

export const getElementsArray = (
  root: LibraryElement<Entity, LibraryElement<Entity>[]>,
): LibraryElement<Entity, LibraryElement<Entity>[]>[] => {
  const array = root.children.map((child) => getElementsArray(child));
  return R.flatten([root, array]) as LibraryElement<
    Entity,
    LibraryElement<Entity>[]
  >[];
};

export const updateElementParameters = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
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

export const getTreeWithDefaultStylesAndParams = <T extends Entity>(
  root: LibraryElement<T>,
): LibraryElement<T> => {
  return getElementsArray(root).reduce((acc, element) => {
    const params = LIBRARY_ELEMENTS[element.type].parameters;

    const newElement: LibraryElement<Entity> = {
      ...element,
      name: element.name || element.type,
      parameters: {
        ...params,
        ...element.parameters,
      },
      styles: {
        classNames: [element.type],
        ownStyles: element.styles,
      },
    };

    return replaceChild(element.id, newElement, acc) as LibraryElement<T>;
  }, root);
};
