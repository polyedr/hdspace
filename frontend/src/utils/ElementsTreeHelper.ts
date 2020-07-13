import * as R from 'ramda';

import { Entity, getConfigurablePropsOf } from '$domain/core';
import { LibraryElement } from '$api/types';

export const moveElement = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  parentID: string,
  element: LibraryElement<T, LibraryElement<K>[]>,
  root: LibraryElement<P, LibraryElement<R>[]>,
  elementBuoyancy: number
) => {
  const oldParentID = findParentByChildID(root, element.id)?.id;

  if (!oldParentID) {
    const rootWithNewChild = addChildToElement(parentID, element, root, elementBuoyancy);
    return rootWithNewChild;
  } else {
    const rootWithoutOldChild = removeChildrenFromElement(oldParentID, [element], root);
    const rootWithNewChild = addChildToElement(parentID, element, rootWithoutOldChild, elementBuoyancy);
  
    return rootWithNewChild;
  }
};

export const addChildToElement = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  elementID: string,
  newChild: LibraryElement<T, LibraryElement<K>[]>,
  root: LibraryElement<P, LibraryElement<T | R>[]>,
  childBuoyancy: number
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const sortedChildren: LibraryElement<P, LibraryElement<T | R>[]>['children'] =
    root.id === elementID
      ? R.insert(
          childBuoyancy,
          newChild,
          root.children
        ).map((child, index) => ({ ...child, buoyancy: index }))
      : root.children.map((child) =>
          addChildToElement(elementID, newChild, child, childBuoyancy)
        );

  return {
    ...root,
    children: sortedChildren,
  };
};

export const addChildrenToElement = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  elementID: string,
  newChildren: LibraryElement<T, LibraryElement<K>[]>[],
  root: LibraryElement<P, LibraryElement<T | R>[]>
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const addedChildren =
    root.id === elementID
      ? [...root.children, ...newChildren].map((child, index) => ({
          ...child,
          buoyancy: index,
        }))
      : root.children.map((child) =>
          addChildrenToElement(elementID, newChildren, child)
        );

  return {
    ...root,
    children: addedChildren,
  };
};

export const removeChildrenFromElement = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  elementID: string,
  childrenToRemove: LibraryElement<T, LibraryElement<K>[]>[],
  root: LibraryElement<P, LibraryElement<T | R>[]>
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const newChildren =
    root.id === elementID
      ? [
          ...root.children
            .filter((child) => childrenToRemove.every((childToRemove) => childToRemove.id !== child.id))
            .map((child, index) => ({ ...child, buoyancy: index })),
        ]
      : root.children.map((child) =>
          removeChildrenFromElement(elementID, childrenToRemove, child)
        );

  return {
    ...root,
    children: newChildren,
  };
};

export const findChildByID = (
  element: LibraryElement<Entity, LibraryElement<Entity>[]>, targetID: string
): LibraryElement<Entity, LibraryElement<Entity>[]> | undefined => {
  if (element.id === targetID) {
    return element;
  }
  
  for (const child of element.children) {
    const targetChild = findChildByID(child, targetID);
    
    if (targetChild) {
      return targetChild;
    }
  }
};

export const getElementsArray = (
  root: LibraryElement<Entity, LibraryElement<Entity>[]>
): LibraryElement<Entity, LibraryElement<Entity>[]>[] => {
  const array = root.children.map((child) => getElementsArray(child));
  return R.flatten([root, array]) as LibraryElement<Entity, LibraryElement<Entity>[]>[];
};

export const findParentByChildID = (
  element: LibraryElement<Entity, LibraryElement<Entity>[]>,
  targetID: string
): LibraryElement<Entity, LibraryElement<Entity>[]> | undefined => {
  if (element.children.some((child) => child.id === targetID)) {
    return element;
  }

  for (const child of element.children) {
    const targetParent = findParentByChildID(child, targetID);

    if (targetParent) {
      return targetParent;
    }
  }
};

export const updateElementStyles = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  elementID: string,
  styles: Partial<LibraryElement<T, LibraryElement<K>[]>['styles']>,
  root: LibraryElement<P, LibraryElement<R>[]>
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    styles: root.id === elementID ? { ...root.styles, ...styles } : root.styles,
    children: root.children.map((child) => updateElementStyles(elementID, styles, child)),
  };
};

export const updateElementParameters = <T extends Entity, K extends Entity, P extends Entity, R extends Entity>(
  elementID: string,
  parameters: Partial<LibraryElement<T, LibraryElement<K>[]>['parameters']>,
  root: LibraryElement<P, LibraryElement<R>[]>
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    parameters: root.id === elementID ? { ...root.parameters, ...parameters } : root.parameters,
    children: root.children.map((child) => updateElementParameters(elementID, parameters, child)),
  };
};

export const getTreeWithDefaultStylesAndParams = <T extends Entity>(root: LibraryElement<T>): LibraryElement<T> => {
  const rootWithDefaultStylesAndParams = getElementsArray(root).reduce((acc, element) => {
    const { styles, params } = getConfigurablePropsOf('root')(element.type);
    const rootWithUpdatedParameters = updateElementParameters(element.id, { ...params, ...element.parameters }, acc);
    const rootWithUpdatedStyles = updateElementStyles(element.id, { ...styles, ...element.styles }, rootWithUpdatedParameters);
    return rootWithUpdatedStyles;
  }, root);

  return rootWithDefaultStylesAndParams;
};
