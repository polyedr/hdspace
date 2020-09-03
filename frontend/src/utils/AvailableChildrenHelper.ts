import { AVAILABLE_CHILDREN, Entity } from '$domain/core';
import { LibraryElement } from '$api/types';

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
