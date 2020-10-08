import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { setCurrentDropTargetParams } from '../../../redux/project/actions';
import useElementProps from '../hooks/useElementProps';
import useDropElement from './hooks/useDropElement';
import { RENDERERS } from '../../UI/RenderElements';
import {
  selectCurrentDropTargetParams,
  selectCurrentRootId,
  selectElementByChildId,
  selectElementById,
} from '../../../redux/project/selectors';
import { DropPosition } from '../../../constants/dragAndDrop';
import { SyntheticElement, ElementType } from './types';
import { CONTAINER_GROUPS } from '../../../constants/defaultParams';
import { getFlexRowDropPosition, getBlockDropPosition } from './helper';
import useElementBorders from './hooks/useElementBorders';

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
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

  const handleDrop = useDropElement(elementId);

  const [
    dropDomStyles,
    setDropDomStyles,
  ] = useState<CSSStyleDeclaration | null>(null);

  const isContainer = useMemo(
    () =>
      elementId === rootID ||
      CONTAINER_GROUPS.includes(element.parameters.group),
    [elementId, element, rootID],
  );

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
      if (monitor.didDrop() || dragSource.original.id === elementId) {
        return;
      }
      handleDrop(dragSource, dropTarget);
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

  useElementBorders(elementId, ref);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    drag(ref);
    drop(ref);
  }, [ref.current]);

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
