import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd';
import {
  addBorderedElementRef,
  moveElement,
  setCurrentDropTargetParams,
} from '../../../redux/project/actions';
import useElementProps from '../hooks/useElementProps';
import { RENDERERS } from '../../UI/RenderElements';
import ElementType from './ElementTypes';
import {
  selectActiveElementId,
  selectBorderedRef,
  selectCurrentDropTargetParams,
  selectCurrentRootId,
  selectCurrentScreenId,
  selectElementByChildId,
  selectElementById,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import { CONTAINER_GROUPS } from '../../../constants/defaultParams';
import { StateElement } from '../../../redux/project/types';
import { DropPosition } from '../../../constants/dragAndDrop';

const getBlockDropPosition = (
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

const getFlexRowDropPosition = (
  dragSourceOffset: XYCoord,
  dropTargetRect: DOMRect,
  isContainer = false,
) => {
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

type SyntheticElement = {
  original: StateElement;
  parent?: StateElement;
  type: ElementType;
};

type DraggableElementProps = {
  elementId: string;
  parentDomStyles?: CSSStyleDeclaration | null;
};

const DraggableElement: React.FC<DraggableElementProps> = ({
  elementId,
  parentDomStyles,
}) => {
  const element = useSelector(selectElementById(elementId));
  const parent = useSelector(selectElementByChildId(elementId));
  const rootID = useSelector(selectCurrentRootId);
  const screenId = useSelector(selectCurrentScreenId);
  const activeElementId = useSelector(selectActiveElementId);
  const showBorders = useSelector(selectShowingBorders);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const rootRef = useSelector(selectBorderedRef(rootID));

  const [
    dropDomStyles,
    setDropDomStyles,
  ] = useState<CSSStyleDeclaration | null>(null);

  const elementProps = useElementProps(elementId);

  const dispatch = useDispatch();

  const dropTarget = useMemo(() => {
    if (
      !!parent &&
      dropTargetParams &&
      dropTargetParams.position !== DropPosition.INSIDE
    ) {
      return parent;
    }
    return element;
  }, [element, parent, dropTargetParams]);

  const isContainer = useMemo(
    () =>
      elementId === rootID ||
      CONTAINER_GROUPS.includes(element.parameters.group),
    [dropTarget],
  );

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

  const [, drag] = useDrag({
    item: {
      original: element,
      parent,
      type: ElementType.ELEMENT,
    } as SyntheticElement,
    canDrag: () => element.id !== rootID,
    end: () => {
      dispatch(setCurrentDropTargetParams(null));
    },
  });

  const [{ isOver, isOverArea }, drop] = useDrop({
    accept: [ElementType.ELEMENT, ElementType.CONSTRUCTOR],
    drop: (dragSource: SyntheticElement, monitor: DropTargetMonitor) => {
      if (monitor.didDrop()) {
        return;
      }
      const oldIndex = dragSource.original.buoyancy;
      // drop into same parent
      if (dragSource.original.id === element.id) {
        return; // drop into same position
      }

      let newIndex = 0;
      if (dropTargetParams && dropTargetParams.position) {
        switch (dropTargetParams.position) {
          case DropPosition.BEFORE:
          case DropPosition.ABOVE:
            newIndex = element.buoyancy;
            break;
          case DropPosition.AFTER:
          case DropPosition.BELOW:
            newIndex = element.buoyancy + 1;
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
    canDrop: (dragSource: SyntheticElement, monitor: DropTargetMonitor) => {
      return monitor.isOver({ shallow: true });
    },
    collect: (monitor: DropTargetMonitor) => {
      return {
        isOver: monitor.isOver({ shallow: true }),
        isOverArea: monitor.isOver(),
      };
    },
    hover: (dragSource: SyntheticElement, monitor: DropTargetMonitor) => {
      if (isOver) {
        let dropPosition = DropPosition.INSIDE;
        const clientOffset = monitor.getClientOffset();
        const rect = ref.current.getBoundingClientRect();
        if (parentDomStyles && clientOffset && elementId !== rootID) {
          if (
            parentDomStyles.display === 'flex' &&
            parentDomStyles.flexDirection === 'row'
          ) {
            dropPosition = getFlexRowDropPosition(
              clientOffset,
              rect,
              isContainer,
            );
          } else {
            dropPosition = getBlockDropPosition(
              clientOffset,
              rect,
              isContainer,
            );
          }
        }
        if (
          dropTargetParams?.id !== elementId ||
          dropTargetParams.position !== dropPosition
        ) {
          dispatch(setCurrentDropTargetParams(elementId, dropPosition));
        }
      }
    },
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    drag(ref);
    drop(ref);
  }, [ref.current]);

  useEffect(() => {
    if (ref.current && elementId === rootID && !rootRef) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  });

  useEffect(() => {
    if (
      ref.current &&
      [dropTargetParams?.id, activeElementId, rootID].includes(elementId)
    ) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [activeElementId, dropTargetParams]);

  useEffect(() => {
    if (showBorders && element.parent === rootID) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [showBorders]);

  useEffect(() => {
    if (!dropDomStyles && isOverArea) {
      setDropDomStyles(window.getComputedStyle(ref.current));
    } else if (dropDomStyles && !isOverArea) {
      setDropDomStyles(null);
    }
  }, [isOverArea]);

  useEffect(() => {
    if (!isOverArea && dropTargetParams && elementId === rootID) {
      dispatch(setCurrentDropTargetParams(null));
    }
  }, [isOverArea, rootID, dropTargetParams]);

  useEffect(() => {
    if (ref.current && elementId === rootID) {
      dispatch(addBorderedElementRef(elementId, ref));
    }
  }, [ref]);

  if (!element) {
    return null;
  }

  const ElementRenderer = RENDERERS[element.type];

  return (
    elementProps && (
      <ElementRenderer {...elementProps} ref={ref}>
        {element.children.map((childId: string) => (
          <DraggableElement
            key={`element-${childId}`}
            elementId={childId}
            parentDomStyles={dropDomStyles}
          />
        ))}
      </ElementRenderer>
    )
  );
};

export default DraggableElement;
