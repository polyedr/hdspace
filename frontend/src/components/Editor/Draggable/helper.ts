import { XYCoord } from 'react-dnd';

import { DropPosition } from '../../../constants/dragAndDrop';
import { ElementData, StateElement, SyntheticElement } from '../../../types';

export const getBlockDropPosition = (
  dragSourceOffset: XYCoord,
  dropTargetRect: DOMRect,
  isContainer = false,
): DropPosition => {
  if (
    dragSourceOffset.y > dropTargetRect.y &&
    dragSourceOffset.y <
      dropTargetRect.y + (isContainer ? 10 : dropTargetRect.height / 2)
  ) {
    return DropPosition.ABOVE;
  }
  if (
    isContainer &&
    dragSourceOffset.y < dropTargetRect.y + dropTargetRect.height - 10
  ) {
    return DropPosition.INSIDE;
  }
  return DropPosition.BELOW;
};

export const getFlexRowDropPosition = (
  dragSourceOffset: XYCoord,
  dropTargetRect: DOMRect,
  isContainer = false,
): DropPosition => {
  if (
    dragSourceOffset.x > dropTargetRect.x &&
    dragSourceOffset.x <
      dropTargetRect.x + (isContainer ? 10 : dropTargetRect.width / 2)
  ) {
    return DropPosition.BEFORE;
  }
  if (
    isContainer &&
    dragSourceOffset.x < dropTargetRect.x + dropTargetRect.width - 10
  ) {
    return DropPosition.INSIDE;
  }
  return DropPosition.AFTER;
};

export const getDropIndex = (
  dropPosition: DropPosition,
  dragSource: SyntheticElement<StateElement | ElementData>,
  dropTarget: StateElement,
  element: StateElement,
  parent: StateElement | null,
) => {
  switch (dropPosition) {
    case DropPosition.BEFORE:
    case DropPosition.ABOVE:
      return element.buoyancy;
    case DropPosition.AFTER:
    case DropPosition.BELOW:
      if (
        parent &&
        (dragSource.original as StateElement).parent === parent.id &&
        element.buoyancy === parent.children.length - 1
      ) {
        return element.buoyancy;
      }
      return element.buoyancy + 1;
    case DropPosition.INSIDE:
      if (dragSource.parent?.id === dropTarget.id) {
        return dropTarget.children.length - 1;
      }
      return dropTarget.children.length;
    default:
      return dropTarget.buoyancy;
  }
};
