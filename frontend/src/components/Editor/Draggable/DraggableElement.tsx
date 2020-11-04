import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  addBorderedElementRef,
  createElements,
  moveElement,
  removeBorderedElementRef,
  setCurrentDropTargetParams,
} from '../../../redux/project/actions';
import useElementProps from '../hooks/useElementProps';
import { RENDERERS } from '../../UI/RenderElements';
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
import { DropPosition, ElementType } from '../../../constants/dragAndDrop';
import { SyntheticElement } from './types';
import { CONTAINER_GROUPS } from '../../../constants/defaultParams';
import {
  getFlexRowDropPosition,
  getBlockDropPosition,
  getDropIndex,
} from './helper';
import useElementBorders from './hooks/useElementBorders';
import { ElementData, StateElement } from '../../../redux/project/types';

type DraggableElementProps = {
  elementId: string;
  parentDomStyles?: CSSStyleDeclaration | null;
  parentIds?: Array<string>;
};

const DraggableElement: React.FC<DraggableElementProps> = ({
  elementId,
  parentDomStyles,
  parentIds = [],
}) => {
  const element = useSelector(selectElementById(elementId));
  const parent = useSelector(selectElementByChildId(elementId));
  const activeElementId = useSelector(selectActiveElementId);
  const rootID = useSelector(selectCurrentRootId);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const screenId = useSelector(selectCurrentScreenId);
  const showBorders = useSelector(selectShowingBorders);
  const borderedRef = useSelector(selectBorderedRef(elementId));

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

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

  const [, drag, preview] = useDrag({
    item: {
      original: element,
      parent,
      type: ElementType.ELEMENT,
    } as SyntheticElement<StateElement>,
    canDrag: () => element.id !== rootID,
    end: () => {
      dispatch(setCurrentDropTargetParams(null));
    },
  });

  const [{ isOver, isOverArea }, drop] = useDrop({
    accept: [ElementType.ELEMENT, ElementType.CONSTRUCTOR],
    drop: (
      dragSource: SyntheticElement<StateElement | ElementData>,
      monitor: DropTargetMonitor,
    ) => {
      if (
        monitor.didDrop() ||
        (dragSource.type === ElementType.ELEMENT &&
          dragSource.original.id === elementId)
      ) {
        return;
      }

      const index =
        dropTargetParams && dropTargetParams.position
          ? getDropIndex(
              dropTargetParams.position,
              dragSource,
              dropTarget,
              element,
              parent,
            )
          : 0;

      if (dragSource.type === ElementType.ELEMENT) {
        const dragSourceEl = dragSource.original as StateElement;
        dispatch(
          moveElement(
            dragSourceEl.id,
            {
              oldIndex: dragSourceEl.buoyancy,
              newIndex: index,
            },
            {
              oldParentId: dragSource.parent?.id || '',
              newParentId: dropTarget.id,
            },
            { screenId },
          ),
        );
      } else {
        const elementData = dragSource.original as ElementData;
        const { id, type, name, custom } = elementData;
        dispatch(
          createElements(
            [{ id, type, name, custom }],
            { screenId },
            dropTarget.id,
            index,
          ),
        );
      }
    },
    canDrop: (
      dragSource: SyntheticElement<StateElement | ElementData>,
      monitor: DropTargetMonitor,
    ) => {
      const isOverCurrent = monitor.isOver({ shallow: true });
      const allowDropElement =
        dragSource.type === ElementType.ELEMENT &&
        dragSource.original.id &&
        !parentIds.includes(dragSource.original.id);
      const allowDropConstructor = dragSource.type === ElementType.CONSTRUCTOR;
      return isOverCurrent && (allowDropElement || allowDropConstructor);
    },
    collect: (monitor: DropTargetMonitor) => {
      return {
        isOver: monitor.isOver({ shallow: true }),
        isOverArea: monitor.isOver(),
      };
    },
    hover: (
      dragSource: SyntheticElement<StateElement | ElementData>,
      monitor: DropTargetMonitor,
    ) => {
      if (
        isOver &&
        monitor.canDrop() &&
        dragSource.original.id !== element.id
      ) {
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
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

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
      <ElementRenderer
        {...elementProps}
        ref={ref}
        onMouseEnter={() => {
          if (borderedRef.current !== ref.current && ref.current) {
            dispatch(addBorderedElementRef(elementId, ref));
          }
        }}
        onMouseLeave={() => {
          if (!showBorders && [rootID, activeElementId]) {
            dispatch(removeBorderedElementRef(elementId));
          }
        }}
      >
        {element.children.map((childId: string) => (
          <DraggableElement
            key={`element-${childId}`}
            elementId={childId}
            parentDomStyles={dropDomStyles}
            parentIds={[...parentIds, elementId]}
          />
        ))}
      </ElementRenderer>
    )
  );
};

export default DraggableElement;
