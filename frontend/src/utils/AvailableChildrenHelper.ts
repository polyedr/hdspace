import { AVAILABLE_CHILDREN } from '../domain/core';
import { Entity, LibraryElement, StateElement } from '../types';

const CHILDREN_AVAILABILITY = {
  smartHeader: (element: LibraryElement<Entity>) => !!element.children.length,
  smartFooter: (element: LibraryElement<Entity>) => !!element.children.length,
  smartForm: (element: LibraryElement<Entity>) => !!element.children.length,
  smartWebpage: (element: LibraryElement<Entity>) => !!element.children.length,
};

export const isElementCanBeRemove = (
  itemToRemoveParent: LibraryElement<Entity>,
  removedElementType: Entity,
) => {
  const sameChildrenAmount =
    itemToRemoveParent.children.filter(
      (child) => child.type === removedElementType,
    )?.length || 0;
  const availableChildrenType = AVAILABLE_CHILDREN[itemToRemoveParent.type].all
    ? 'all'
    : removedElementType;
  const availableSameChildren =
    AVAILABLE_CHILDREN[itemToRemoveParent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  return sameChildrenAmount > availableSameChildren.min;
};

export const isElementCanBeAdded = (
  itemToAddParent: LibraryElement<Entity>,
  addedElementType: Entity,
) => {
  const sameChildrenAmount =
    itemToAddParent.children.filter((child) => child.type === addedElementType)
      ?.length || 0;

  const availableChildrenType = AVAILABLE_CHILDREN[itemToAddParent.type].all
    ? 'all'
    : addedElementType;

  const availableSameChildren =
    AVAILABLE_CHILDREN[itemToAddParent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  return sameChildrenAmount < availableSameChildren.max;
};

export const canElementHaveChildren = (
  elementType: Entity | 'none',
): boolean => {
  if (elementType === 'none') return false;
  return !!Object.entries(AVAILABLE_CHILDREN[elementType]).length;
};

export const canElementHaveAllChildren = (
  elementType: Entity | 'none',
): boolean => {
  if (elementType === 'none') return false;
  return 'all' in AVAILABLE_CHILDREN[elementType];
};

export const isAvailableChild = (
  parentElement: StateElement,
  elementType: Entity | 'none',
) => {
  if (
    !parentElement ||
    parentElement.type === 'none' ||
    elementType === 'none'
  ) {
    return false;
  }
  return (
    (!CHILDREN_AVAILABILITY[parentElement.type] ||
      CHILDREN_AVAILABILITY[parentElement.type](parentElement)) &&
    (AVAILABLE_CHILDREN[parentElement.type].all ||
      elementType in AVAILABLE_CHILDREN[parentElement.type])
  );
};
