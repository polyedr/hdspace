import { XYCoord } from 'react-dnd';
import { DropPosition } from '../../../constants/dragAndDrop';

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
