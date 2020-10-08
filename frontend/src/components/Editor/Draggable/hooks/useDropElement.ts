import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SyntheticElement } from '../types';
import { DropPosition } from '../../../../constants/dragAndDrop';
import { StateElement } from '../../../../redux/project/types';
import { moveElement } from '../../../../redux/project/actions';
import {
  selectElementById,
  selectCurrentDropTargetParams,
  selectElementByChildId,
  selectCurrentScreenId,
} from '../../../../redux/project/selectors';

const useMoveElement = (elementId: string) => {
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const element = useSelector(selectElementById(elementId));
  const parent = useSelector(selectElementByChildId(elementId));
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);

  const moveElementCallback = useCallback(
    (dragSource: SyntheticElement, dropTarget: StateElement) => {
      const oldIndex = dragSource.original.buoyancy;

      let newIndex = 0;
      if (dropTargetParams && dropTargetParams.position) {
        switch (dropTargetParams.position) {
          case DropPosition.BEFORE:
          case DropPosition.ABOVE:
            newIndex = element.buoyancy;
            break;
          case DropPosition.AFTER:
          case DropPosition.BELOW:
            if (
              parent &&
              dragSource.original.parent === element.parent &&
              element.buoyancy === parent.children.length - 1
            ) {
              newIndex = element.buoyancy;
            } else {
              newIndex = element.buoyancy + 1;
            }
            break;
          case DropPosition.INSIDE:
            newIndex = dropTarget.children.length;
            if (dragSource.parent?.id === dropTarget.id) {
              newIndex -= 1;
            }
            break;
          default:
            newIndex = dropTarget.buoyancy;
        }
      }
      dispatch(
        moveElement(
          dragSource.original.id,
          {
            oldIndex,
            newIndex,
          },
          {
            oldParentId: dragSource.parent?.id || '',
            newParentId: dropTarget.id,
          },
          { screenId },
        ),
      );
    },
    [dropTargetParams],
  );

  return moveElementCallback;
};

export default useMoveElement;
