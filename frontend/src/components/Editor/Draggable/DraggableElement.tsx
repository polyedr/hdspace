import React, { useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import logger from 'loglevel';
import { useDebouncedCallback } from 'use-debounce';
import {
  processDropElement,
  processDropTargetParams,
  setActiveElement,
  setCurrentDropTargetParams,
  setHoveredElementId,
  setMasterSourceElementId,
  toggleSelectedElement,
} from '@Redux/project/actions';
import {
  ElementData,
  Normalized,
  ProjectClass,
  StateElement,
  SyntheticElement,
} from '@Src/types';

import { ElementType } from '@Constants/dragAndDrop';
import { NOT_DRAGGABLE_COMPONENTS } from '@Constants/defaultParams';
import useLayout from '@Components/Editor/hooks/useLayout';
import Scrollbars from 'react-custom-scrollbars';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { DOMHandler } from '../Workspace/DOMHandler';
import RENDERERS from '../../UI/RenderElements';

interface DraggableElementProps {
  screenId: number;
  elementId: string;
  allElements: Normalized<StateElement>;
  isDisabled: boolean;
  preSelectedElementId: string | null;
  masterSourceElementId: string | null;
  canDragAndDrop: boolean;
  projectClasses: ProjectClass[];
  parentIds?: string[];
  scrollRef: React.RefObject<Scrollbars>;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  screenId,
  elementId,
  allElements,
  isDisabled,
  preSelectedElementId,
  masterSourceElementId,
  canDragAndDrop,
  projectClasses,
  parentIds = [],
  scrollRef,
}) => {
  const dispatch = useDispatch();
  const isProto = useSelector(selectIsPrototypeMode);

  const element = allElements[elementId];
  const parent = useMemo(
    () => (element?.parent ? allElements[element.parent] : null),
    [allElements, element?.parent],
  );

  const parentElementClass = useMemo(
    () =>
      !parent
        ? null
        : projectClasses.find(
            (projectClass: ProjectClass) =>
              projectClass.className === parent.type,
          ),
    [parent, projectClasses],
  );

  const ref = useRef<HTMLElement | null>(null);

  const isDisplayed = useLayout(element?.parameters.layouts);

  const parentsIdsForChildren = useMemo(
    () => [...parentIds, elementId],
    [elementId, parentIds],
  );

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
      canDragAndDrop &&
      !isProto,
    end: (_, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(setCurrentDropTargetParams(null));
      }
    },
  });

  const [, drop] = useDrop({
    accept: [ElementType.ELEMENT, ElementType.CONSTRUCTOR],
    drop: (
      dragSource: SyntheticElement<StateElement | ElementData>,
      monitor: DropTargetMonitor,
    ) => {
      const clientOffset = monitor.getClientOffset();
      const rect = ref.current.getBoundingClientRect();
      const display = !parent
        ? null
        : parent.styles.ownStyles.display || parentElementClass?.rules.display;
      const flexDirection = !parent
        ? null
        : parent.styles.ownStyles.flexDirection ||
          parentElementClass?.rules.flexDirection;
      if (clientOffset) {
        dispatch(
          processDropTargetParams(
            elementId,
            rect,
            display === 'flex' && flexDirection === 'row',
            clientOffset,
          ),
        );
      }
      if (
        monitor.didDrop() ||
        (dragSource.type === ElementType.ELEMENT &&
          dragSource.original.id === elementId)
      ) {
        return;
      }
      dispatch(processDropElement(dragSource.original, dragSource.type));
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(
    () => () => {
      DOMHandler.INSTANCE.removeElementDom(elementId);
    },
    [elementId],
  );

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

  if (!element || (!isDisplayed && element?.name !== 'Root')) {
    return null;
  }

  // handling div element with divBlock as server using div elements
  const ElementRenderer =
    // @ts-expect-error
    RENDERERS[element.type === 'div' ? 'divBlock' : element.type];

  if (!ElementRenderer) {
    // eslint-disable-next-line no-console
    logger.warn(`Element dose not exists: ${element.type}`);
    return null;
  }

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
          key={childId.toString()}
          elementId={childId}
          parentIds={parentsIdsForChildren}
          scrollRef={scrollRef}
          isDisabled={isDisabled}
          screenId={screenId}
          allElements={allElements}
          preSelectedElementId={preSelectedElementId}
          masterSourceElementId={masterSourceElementId}
          canDragAndDrop={canDragAndDrop}
          projectClasses={projectClasses}
        />
      ))}
    </ElementRenderer>
  );
};

export default memo(DraggableElement);
