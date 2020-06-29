import * as R from 'ramda';

import { LibraryElement } from '$api/types';

export const moveElement = (parentID: string, element: LibraryElement, root: LibraryElement, elementBuoyancy: number) => {
  const oldParentID = findParentByChildID(root, element.id)?.id;

  if (!oldParentID) {
    const rootWithNewChild = addChildToElement(parentID, element, root, elementBuoyancy);
    return rootWithNewChild;
  } else {
    const rootWithoutOldChild = removeChildrenFromElement(oldParentID, [element], root);
    const rootWithNewChild = addChildToElement(parentID, element, rootWithoutOldChild, elementBuoyancy);
  
    return rootWithNewChild;
  }
}

export const addChildToElement = (elementID: string, newChild: LibraryElement, root: LibraryElement, childBuoyancy: number): LibraryElement => {
  const sortedChildren = root.id === elementID
  ? R.insert(childBuoyancy, newChild, root.children as LibraryElement[]).map((child, index) => ({ ...child, buoyancy: index }))
  : (root.children as LibraryElement[]).map((child) => addChildToElement(elementID, newChild, child, childBuoyancy));

  return {
    ...root,
    children: sortedChildren,
  } as LibraryElement
};

export const addChildrenToElement = (elementID: string, newChildren: LibraryElement[], root: LibraryElement): LibraryElement => {
  const addedChildren = root.id === elementID
  ? [...root.children, ...newChildren].map((child, index) => ({ ...child, buoyancy: index }))
  : (root.children as LibraryElement[]).map((child) => addChildrenToElement(elementID, newChildren, child));
 
  return {
    ...root,
    children: addedChildren,
  } as LibraryElement
};

export const removeChildrenFromElement = (elementID: string, childrenToRemove: LibraryElement[], root: LibraryElement): LibraryElement => {
  const newChildren =
    root.id === elementID
      ? [
          ...(root.children as LibraryElement[]) 
            .filter((child) => childrenToRemove.every((childToRemove) => childToRemove.id !== child.id))
            .map((child, index) => ({ ...child, buoyancy: index })),
        ]
      : (root.children as LibraryElement[]).map((child) =>
          removeChildrenFromElement(elementID, childrenToRemove, child)
        );
  
  return {
    ...root,
    children: newChildren,
  } as LibraryElement;
};

export const findChildByID = (element: LibraryElement, targetID: string): LibraryElement | undefined => {
  if (element.id === targetID) {
    return element;
  }
  
  for (const child of element.children as LibraryElement[]) {
    const targetChild = findChildByID(child, targetID);
    
    if (targetChild) {
      return targetChild;
    }
  }
};

export const getElementsArray = (root: LibraryElement): LibraryElement[] => {
  const array = (root.children as LibraryElement[]).map((child) => getElementsArray(child));
  return R.flatten([root, array]) as LibraryElement[];
};

export const findParentByChildID = (element: LibraryElement, targetID: string): LibraryElement | undefined => {
  if ((element.children as LibraryElement[]).some(child => child.id === targetID)) {
    return element;
  }

  for (const child of element.children as LibraryElement[]) {
    const targetParent = findParentByChildID(child, targetID);
    
    if (targetParent) {
      return targetParent;
    }
  }
};

export const updateElementStyles = (elementID: string, styles: Partial<LibraryElement['styles']>, root: LibraryElement): LibraryElement => {
  return {
    ...root,
    styles: root.id === elementID ? { ...root.styles, ...styles } : root.styles,
    children: (root.children as LibraryElement[]).map((child) => updateElementStyles(elementID, styles, child)),
  } as LibraryElement;
};

export const updateElementParameters = (elementID: string, parameters: Partial<LibraryElement['parameters']>, root: LibraryElement): LibraryElement => {
  return {
    ...root,
    parameters: root.id === elementID ? { ...root.parameters, ...parameters } : root.parameters,
    children: (root.children as LibraryElement[]).map((child) => updateElementParameters(elementID, parameters, child)),
  } as LibraryElement;
};
