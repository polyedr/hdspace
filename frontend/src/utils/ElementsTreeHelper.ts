import * as R from 'ramda';

import { Entity } from '$domain/core';
import { LibraryElement } from '$api/types';
import { getDefaultStyles } from '$domain/defaultStyles/defaultStyles';
import { LIBRARY_ELEMENTS } from '$domain/libraryElements/libraryElements';

import { CssLikeStyles } from './StyleHelper';

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
  newStyles: Partial<LibraryElement<T, LibraryElement<K>[]>['styles']['ownStyles']>,
  root: LibraryElement<P, LibraryElement<R>[]>
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? {
            ...root.styles,
            ownStyles: { ...root.styles.ownStyles, ...newStyles },
          }
        : root.styles,
    children: root.children.map((child) => updateElementStyles(elementID, newStyles, child)),
  };
};

export const addElementClassName = <T extends Entity, K extends Entity>(
  elementID: string,
  newClassName: string,
  root: LibraryElement<T, LibraryElement<K>[]>
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? {
            ...root.styles,
            // Allow only one additional class
            classNames: R.head(root.styles.classNames)
              ? [R.head(root.styles.classNames)!, newClassName]
              : [newClassName],
          }
        : root.styles,
    children: root.children.map((child) =>
      addElementClassName(elementID, newClassName, child)
    ),
  };
};

export const removeElementClassName = <T extends Entity, K extends Entity>(
  elementID: string,
  removedClassName: string,
  root: LibraryElement<T, LibraryElement<K>[]>
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? {
            ...root.styles,
            classNames: root.styles.classNames.filter(className => className !== removedClassName),
          }
        : root.styles,
    children: root.children.map((child) => removeElementClassName(elementID, removedClassName, child)),
  };
};

export const removeElementStyles = <T extends Entity, K extends Entity>(
  elementID: string,
  removedRuleNames: string[],
  root: LibraryElement<T, LibraryElement<K>[]>
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? {
            ...root.styles,
            ownStyles: (R.toPairs(root.styles.ownStyles) as [string, string])
            .filter(([ruleName]) => removedRuleNames.every(name => name !== ruleName))
            .reduce(
              (acc, [ruleName, rule]) => ({ ...acc, [ruleName]: rule }),
              {} as CssLikeStyles
            ),
          }
        : root.styles,
    children: root.children.map((child) => removeElementStyles(elementID, removedRuleNames, child)),
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

export const updateElementName = <P extends Entity, R extends Entity>(
  elementID: string,
  name: string,
  root: LibraryElement<P, LibraryElement<R>[]>
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    name: root.id === elementID ? name : root.name,
    children: root.children.map((child) => updateElementName(elementID, name, child)),
  };
};

export const getTreeWithDefaultStylesAndParams = <T extends Entity>(root: LibraryElement<T>): LibraryElement<T> => {
  const rootWithDefaultStylesAndParams = getElementsArray(root).reduce((acc, element) => {
    const styles = getDefaultStyles(element.type);
    const params = LIBRARY_ELEMENTS[element.type].parameters;
    const rootWithUpdatedParameters = updateElementParameters(element.id, { ...params, ...element.parameters }, acc);
    const rootWithUpdatedStyles = updateElementStyles(element.id, { ...styles, ...element.styles }, rootWithUpdatedParameters);
    return rootWithUpdatedStyles;
  }, root);

  return rootWithDefaultStylesAndParams;
};
