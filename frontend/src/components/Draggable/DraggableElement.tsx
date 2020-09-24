import React, { useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import {
  addBorderedElementRect,
  moveElement,
  setCurrentDropTarget,
} from '../../redux/project/actions';
import useElementProps from '../Editor/hooks/useElementProps';
import { RENDERERS } from '../UI/RenderElements';
import ElementType from './ElementTypes';
import {
  selectActiveElementId,
  selectCurrentDropTargetId,
  selectCurrentRootId,
  selectCurrentScreenId,
  selectElementByChildId,
  selectElementById,
  selectScreenLoader,
  selectShowingBorders,
} from '../../redux/project/selectors';
import { CONTAINER_GROUPS } from '../../constants/defaultParams';
import { StateElement } from '../../redux/project/types';
import { AppReduxState } from '../../shared/types/app';

// const styles = require('./DraggableItem.scss');

type SyntheticElement = {
  original: StateElement;
  parent?: StateElement;
  type: ElementType;
};

type DraggableElementProps = {
  elementId: string;
};
const DraggableElement: React.FC<DraggableElementProps> = ({ elementId }) => {
  const {
    element,
    parent,
    rootID,
    screenId,
    activeElementId,
    showBorders,
    currentDropTargetId,
    screenLoader,
  } = useSelector((state: AppReduxState) => ({
    element: selectElementById(elementId)(state),
    parent: selectElementByChildId(elementId)(state),
    rootID: selectCurrentRootId(state),
    screenId: selectCurrentScreenId(state),
    activeElementId: selectActiveElementId(state),
    showBorders: selectShowingBorders(state),
    currentDropTargetId: selectCurrentDropTargetId(state),
    screenLoader: selectScreenLoader(state),
  }));
  const elementProps = useElementProps(elementId);

  const dispatch = useDispatch();
  const ref = useRef<HTMLElement>(null);

  const dropTarget = useMemo(() => {
    if (
      !!parent &&
      (!element.parameters.group ||
        !CONTAINER_GROUPS.includes(element.parameters.group))
    ) {
      return parent;
    }
    return element;
  }, [element]);

  const [, drag] = useDrag({
    item: {
      original: element,
      parent,
      type: ElementType.ELEMENT,
    } as SyntheticElement,
    canDrag: () => element.id !== rootID,
    end: () => {
      dispatch(setCurrentDropTarget(null));
    },
  });

  const [{ isOver, isOverArea }, drop] = useDrop({
    accept: [ElementType.ELEMENT, ElementType.CONSTRUCTOR],
    drop: (draggedElement: SyntheticElement, monitor: DropTargetMonitor) => {
      if (monitor.didDrop()) {
        return;
      }
      const oldIndex = draggedElement.original.buoyancy;
      // drop into same parent
      if (draggedElement.original.id === element.id) {
        return; // drop into same position
      }

      const newIndex =
        dropTarget.id === element.id
          ? dropTarget.children.length
          : element.buoyancy;
      dispatch(
        moveElement(
          draggedElement.original.id,
          {
            oldIndex,
            newIndex,
          },
          {
            oldParentId: draggedElement.parent?.id || '',
            newParentId: dropTarget.id,
          },
          { screenId },
        ),
      );
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      isOverArea: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    drag(ref);
    drop(ref);
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current || screenLoader === true || !rootID) {
      return;
    }
    if (
      elementId === activeElementId ||
      elementId === currentDropTargetId ||
      (showBorders && (elementId === rootID || element.parent === rootID))
    ) {
      dispatch(
        addBorderedElementRect(elementId, ref.current.getBoundingClientRect()),
      );
    }
  }, [
    ref.current,
    rootID,
    activeElementId,
    element,
    showBorders,
    currentDropTargetId,
  ]);

  useEffect(() => {
    if (isOver) {
      dispatch(setCurrentDropTarget(elementId));
    } else if (!isOverArea && elementId === rootID) {
      dispatch(setCurrentDropTarget(null));
    }
  }, [isOver]);

  if (!element) {
    return null;
  }

  const ElementRenderer = RENDERERS[element.type];

  return (
    elementProps && (
      <ElementRenderer {...elementProps} elementRef={ref}>
        {element.children.map((childId: string) => (
          <DraggableElement key={`element-${childId}`} elementId={childId} />
        ))}
      </ElementRenderer>
    )
  );
};

export default DraggableElement;
