import * as R from 'ramda';

import { CssLikeStyles } from './StyleHelper';
import { Entity } from '../domain/core';
import { LibraryElement } from '../api/types';
import { LIBRARY_ELEMENTS } from '../domain/libraryElements/libraryElements';

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

export const removeChildrenFromElement = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  elementID: string,
  childrenToRemove: LibraryElement<T, LibraryElement<K>[]>[],
  root: LibraryElement<P, LibraryElement<T | R>[]>,
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const newChildren =
    root.id === elementID
      ? [
          ...root.children
            .filter((child) =>
              childrenToRemove.every(
                (childToRemove) => childToRemove.id !== child.id,
              ),
            )
            .map((child, index) => ({ ...child, buoyancy: index })),
        ]
      : root.children.map((child) =>
          removeChildrenFromElement(elementID, childrenToRemove, child),
        );

  return {
    ...root,
    children: newChildren,
  };
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

export const moveElement = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  parentID: string,
  element: LibraryElement<T, LibraryElement<K>[]>,
  root: LibraryElement<P, LibraryElement<R>[]>,
  elementBuoyancy: number,
) => {
  const oldParentID = findParentByChildID(root, element.id)?.id;

  if (!oldParentID) {
    return addChildToElement(parentID, element, root, elementBuoyancy);
  }
  const rootWithoutOldChild = removeChildrenFromElement(
    oldParentID,
    [element],
    root,
  );
  return addChildToElement(
    parentID,
    element,
    rootWithoutOldChild,
    elementBuoyancy,
  );
};

export const addChildrenToElement = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  elementID: string,
  newChildren: LibraryElement<T, LibraryElement<K>[]>[],
  root: LibraryElement<P, LibraryElement<T | R>[]>,
): LibraryElement<P, LibraryElement<T | R>[]> => {
  const addedChildren =
    root.id === elementID
      ? [...root.children, ...newChildren].map((child, index) => ({
          ...child,
          buoyancy: index,
        }))
      : root.children.map((child) =>
          addChildrenToElement(elementID, newChildren, child),
        );

  return {
    ...root,
    children: addedChildren,
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

export const replaceElementStyles = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  elementID: string,
  newStyles: Partial<
    LibraryElement<T, LibraryElement<K>[]>['styles']['ownStyles']
  >,
  root: LibraryElement<P, LibraryElement<R>[]>,
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? { ...root.styles, ownStyles: newStyles }
        : root.styles,
    children: root.children.map((child) =>
      replaceElementStyles(elementID, newStyles, child),
    ),
  };
};

export const updateElementStyles = <
  T extends Entity,
  K extends Entity,
  P extends Entity,
  R extends Entity
>(
  elementID: string,
  newStyles: Partial<
    LibraryElement<T, LibraryElement<K>[]>['styles']['ownStyles']
  >,
  root: LibraryElement<P, LibraryElement<R>[]>,
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
    children: root.children.map((child) =>
      updateElementStyles(elementID, newStyles, child),
    ),
  };
};

export const addElementClassName = <T extends Entity, K extends Entity>(
  elementID: string,
  newClassName: string,
  root: LibraryElement<T, LibraryElement<K>[]>,
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? ({
            ...root.styles,
            // Allow only one additional class
            classNames: [R.head(root.styles.classNames), newClassName],
          } as LibraryElement<T, LibraryElement<K>[]>['styles'])
        : root.styles,
    children: root.children.map((child) =>
      addElementClassName(elementID, newClassName, child),
    ),
  };
};

export const removeElementClassName = <T extends Entity, K extends Entity>(
  elementID: string,
  removedClassName: string,
  root: LibraryElement<T, LibraryElement<K>[]>,
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? ({
            ...root.styles,
            classNames: root.styles.classNames.filter(
              (className) => className !== removedClassName,
            ),
          } as LibraryElement<T, LibraryElement<K>[]>['styles'])
        : root.styles,
    children: root.children.map((child) =>
      removeElementClassName(elementID, removedClassName, child),
    ),
  };
};

export const removeElementStyles = <T extends Entity, K extends Entity>(
  elementID: string,
  removedCssPropertiesNames: string[],
  root: LibraryElement<T, LibraryElement<K>[]>,
): LibraryElement<T, LibraryElement<K>[]> => {
  return {
    ...root,
    styles:
      root.id === elementID
        ? {
            ...root.styles,
            ownStyles: R.toPairs(root.styles.ownStyles)
              .filter(([ruleName]) =>
                removedCssPropertiesNames.every((name) => name !== ruleName),
              )
              .reduce(
                (acc, [ruleName, rule]) => ({ ...acc, [ruleName]: rule }),
                {} as CssLikeStyles,
              ),
          }
        : root.styles,
    children: root.children.map((child) =>
      removeElementStyles(elementID, removedCssPropertiesNames, child),
    ),
  };
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

export const updateElementName = <P extends Entity, R extends Entity>(
  elementID: string,
  name: string,
  root: LibraryElement<P, LibraryElement<R>[]>,
): LibraryElement<P, LibraryElement<R>[]> => {
  return {
    ...root,
    name: root.id === elementID ? name : root.name,
    children: root.children.map((child) =>
      updateElementName(elementID, name, child),
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

export const focusOnElement = (id: string) =>
  document.querySelector<HTMLElement>(`[data-ls-id='${id}']`)?.focus();
