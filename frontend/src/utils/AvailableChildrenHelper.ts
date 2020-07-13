import { AVAILABLE_CHILDREN, Entity } from '$domain/core';
import { LibraryElement } from '$api/types';

export const isElementCanBeRemove = (itemToRemoveParent: LibraryElement, removedElementType: Entity) => {
  const sameChildrenAmount = itemToRemoveParent.children.filter(child => child.type === removedElementType)?.length || 0;
  const availableChildrenType = AVAILABLE_CHILDREN[itemToRemoveParent.type]['all'] ? 'all' : removedElementType;
  const availableSameChildren = AVAILABLE_CHILDREN[itemToRemoveParent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  const isElementCanBeRemove = sameChildrenAmount > availableSameChildren.min;

  return isElementCanBeRemove;
};

export const isElementCanBeAdded = (itemToAddParent: LibraryElement, addedElementType: Entity) => {
  const sameChildrenAmount = itemToAddParent.children.filter(child => child.type === addedElementType)?.length || 0;
  const availableChildrenType = AVAILABLE_CHILDREN[itemToAddParent.type]['all'] ? 'all' : addedElementType;
  const availableSameChildren = AVAILABLE_CHILDREN[itemToAddParent.type]?.[availableChildrenType];

  if (!availableSameChildren) {
    return false;
  }

  const isElementCanBeRemove = sameChildrenAmount < availableSameChildren.max;

  return isElementCanBeRemove;
};
