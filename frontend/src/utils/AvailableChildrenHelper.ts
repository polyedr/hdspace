import { AVAILABLE_CHILDREN } from '$domain/core';
import { LibraryElement } from '$api/types';

export const isElementCanBeRemove = (itemToRemoveParent: LibraryElement, removedElement: LibraryElement) => {
  const sameChildrenAmount = itemToRemoveParent.children.filter(child => child.type === removedElement.type)?.length || 0;
  const availableChildrenType = AVAILABLE_CHILDREN[itemToRemoveParent.type]['all'] ? 'all' : removedElement.type;
  const isElementCanBeRemove = sameChildrenAmount > AVAILABLE_CHILDREN[itemToRemoveParent.type][availableChildrenType].min;

  return isElementCanBeRemove;
};
