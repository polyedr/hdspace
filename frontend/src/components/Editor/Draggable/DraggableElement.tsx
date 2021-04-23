import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDebouncedCallback } from 'use-debounce';
import {
  createElements,
  moveElement,
  setActiveElement,
  setCurrentDropTargetParams,
  setHoveredElementId,
  setMasterSourceElementId,
  toggleSelectedElement,
} from '@Redux/project/actions';
import {
  DropTargetParams,
  ElementData,
  Normalized,
  StateElement,
  SyntheticElement,
} from '@Src/types';

import { DropPosition, ElementType } from '@Constants/dragAndDrop';
import {
  CONTAINER_GROUPS,
  // EDITABLE_COMPONENTS_LIST,
  NOT_DRAGGABLE_COMPONENTS,
} from '@Constants/defaultParams';
import useLayout from '@Components/Editor/hooks/useLayout';
import Scrollbars from 'react-custom-scrollbars';
import { DOMHandler } from '../Workspace/DOMHandler';
import {
  getFlexRowDropPosition,
  getBlockDropPosition,
  getDropIndex,
} from './helper';
import RENDERERS from '../../UI/RenderElements';

type DraggableElementProps = {
  screenId: number;
  elementId: string;
  allElements: Normalized<StateElement>;
  isDisabled: boolean;
  dropTargetParams: DropTargetParams | null;
  preSelectedElementId: string | null;
  masterSourceElementId: string | null;
  canDragAndDrop: boolean;
  frameWindow: Window | null;

  parentDomStyles?: CSSStyleDeclaration | null;
  parentIds?: Array<string>;
  scrollRef: React.RefObject<Scrollbars>;
};

const DraggableElement: React.FC<DraggableElementProps> = ({
  screenId,
  elementId,
  allElements,
  isDisabled,
  dropTargetParams,
  preSelectedElementId,
  masterSourceElementId,
  canDragAndDrop,
  frameWindow,

  parentDomStyles,
  parentIds = [],
  scrollRef,
}) => {
  const dispatch = useDispatch();

  const element = allElements[elementId];
  const parent = useMemo(
    () => (element?.parent ? allElements[element.parent] : null),
    [allElements, element?.parent],
  );

  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;

  const [
    dropDomStyles,
    setDropDomStyles,
  ] = useState<CSSStyleDeclaration | null>(null);

  const isContainer = useMemo(
    () => !parent || CONTAINER_GROUPS.includes(element?.parameters.group),
    [parent, element?.parameters.group],
  );

  const isDisplayed = useLayout(element?.parameters.layouts);

  const dropTarget = useMemo(() => {
    if (
      !!parent &&
      dropTargetParams &&
      dropTargetParams.position !== DropPosition.INSIDE
    ) {
      return parent;
    }
    return element;
  }, [parent, dropTargetParams, element]);

  const [, drag, preview] = useDrag({
    item: {
      original: element,
      parent,
      type: ElementType.ELEMENT,
    } as SyntheticElement<StateElement>,
    canDrag: () =>
      !NOT_DRAGGABLE_COMPONENTS.includes(element.type) &&
      !!parent &&
      !element.parameters.sourceElementId &&
      canDragAndDrop,
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
        const { id, type, name, custom, parameters } = elementData;
        dispatch(
          createElements(
            {
              createdElements: [{ id, type, name, custom, parameters }],
              parentId: dropTarget.id,
              index,
            },
            { screenId },
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
      return (
        isOverCurrent &&
        (allowDropElement || allowDropConstructor) &&
        canDragAndDrop
      );
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
        if (parentDomStyles && clientOffset && !!parent) {
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

  useEffect(() => {
    if (!dropDomStyles && isOverArea && frameWindow) {
      setDropDomStyles(frameWindow.getComputedStyle(ref.current));
    } else if (dropDomStyles && !isOverArea) {
      setDropDomStyles(null);
    }
  }, [isOverArea, frameWindow, dropDomStyles]);

  useEffect(() => {
    if (!isOverArea && dropTargetParams && !parent) {
      dispatch(setCurrentDropTargetParams(null));
    }
  }, [isOverArea, dropTargetParams, parent, dispatch]);

  useEffect(() => {
    return () => {
      DOMHandler.INSTANCE.removeElementDom(elementId);
    };
  }, [elementId]);

  const clickHandler = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (event.ctrlKey || event.metaKey) {
        dispatch(toggleSelectedElement(element.id));
      } else {
        dispatch(setActiveElement(element.id));
      }
    },
    [dispatch, element],
  );

  const mouseEnterHandler = useCallback(() => {
    dispatch(setHoveredElementId(elementId));
  }, [dispatch, elementId]);
  const mouseLeaveHandler = useCallback(() => {
    dispatch(setHoveredElementId(element?.parent || null));
  }, [dispatch, element?.parent]);

  const handleScrollIntoView = useDebouncedCallback((dom: HTMLElement) => {
    if ([preSelectedElementId, masterSourceElementId].includes(elementId)) {
      dom.scrollIntoView();
      if (masterSourceElementId === elementId) {
        dispatch(setMasterSourceElementId(null));
        dispatch(setActiveElement(elementId));
      }
    }
  }, 0); // delay to allow all elements to render correctly first

  if (!element || !isDisplayed) {
    return null;
  }

  const ElementRenderer = RENDERERS[element.type];

  return (
    <ElementRenderer
      element={element}
      isDisabled={isDisabled}
      ref={(dom: HTMLElement) => {
        if (dom && !ref.current) {
          handleScrollIntoView.callback(dom); // need to call inside a timeout to wait for elements to be rendered correctly
        }
        ref.current = dom;
        DOMHandler.INSTANCE.addElementDom(elementId, dom);
        if (!NOT_DRAGGABLE_COMPONENTS.includes(element.type)) {
          drag(ref);
          drop(ref);
        }
      }}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onClick={clickHandler}
    >
      {element.children.map((childId: string) => (
        <DraggableElement
          key={`element-${childId}`}
          elementId={childId}
          parentDomStyles={dropDomStyles}
          parentIds={[...parentIds, elementId]}
          scrollRef={scrollRef}
          isDisabled={isDisabled}
          screenId={screenId}
          allElements={allElements}
          dropTargetParams={dropTargetParams}
          preSelectedElementId={preSelectedElementId}
          masterSourceElementId={masterSourceElementId}
          canDragAndDrop={canDragAndDrop}
          frameWindow={frameWindow}
        />
      ))}
    </ElementRenderer>
  );
};

export default DraggableElement;
