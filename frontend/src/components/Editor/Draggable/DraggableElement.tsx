import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDebouncedCallback } from 'use-debounce';
import {
  createElements,
  moveElement,
  setActiveElement,
  setCurrentDropTargetParams,
  setElementBeingEdited,
  setElementCanBeEdited,
  setHoveredElementId,
  setMasterSourceElementId,
  toggleSelectedElement,
} from '@Redux/project/actions';
import {
  ElementData,
  StateElement,
  SyntheticElement,
  UserProjectPermission,
} from '@Src/types';
import {
  selectCurrentRootId,
  selectElementBeingEdited,
  selectElementByChildId,
  selectElementById,
  selectElementCanBeEdited,
  selectMasterSourceElementId,
  selectPreSelectedElementId,
} from '@Redux/project/selectors/element';
import { selectCurrentDropTargetParams } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { DropPosition, ElementType } from '@Constants/dragAndDrop';
import {
  CONTAINER_GROUPS,
  EDITABLE_COMPONENTS_LIST,
  NOT_DRAGGABLE_COMPONENTS,
} from '@Constants/defaultParams';
import useLayout from '@Components/Editor/hooks/useLayout';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import Scrollbars from 'react-custom-scrollbars';
import { DOMHandler } from '../Workspace/DOMHandler';
import {
  getFlexRowDropPosition,
  getBlockDropPosition,
  getDropIndex,
} from './helper';
import RENDERERS from '../../UI/RenderElements';
import { WindowContext } from '../FrameWrapper/FrameContext';

type DraggableElementProps = {
  elementId: string;
  parentDomStyles?: CSSStyleDeclaration | null;
  parentIds?: Array<string>;
  scrollRef: React.RefObject<Scrollbars>;
  isDisabled: boolean;
};

const DraggableElement: React.FC<DraggableElementProps> = ({
  elementId,
  parentDomStyles,
  parentIds = [],
  isDisabled,
  scrollRef,
}) => {
  const dispatch = useDispatch();
  const frameWindow = useContext(WindowContext);

  const element = useSelector(selectElementById(elementId));
  const parent = useSelector(selectElementByChildId(elementId));
  const rootID = useSelector(selectCurrentRootId);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const screenId = useSelector(selectCurrentScreenId);
  const elementBeingEdited = useSelector(selectElementBeingEdited(elementId));
  const elementCanBeEdited = useSelector(selectElementCanBeEdited(elementId));
  const preSelectedElementId = useSelector(selectPreSelectedElementId);
  const masterSourceElementId = useSelector(selectMasterSourceElementId);
  const canDragAndDrop = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;

  const [
    dropDomStyles,
    setDropDomStyles,
  ] = useState<CSSStyleDeclaration | null>(null);

  const isContainer = useMemo(
    () =>
      elementId === rootID ||
      CONTAINER_GROUPS.includes(element?.parameters.group),
    [elementId, element, rootID],
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
  }, [element, parent, dropTargetParams]);

  const [, drag, preview] = useDrag({
    item: {
      original: element,
      parent,
      type: ElementType.ELEMENT,
    } as SyntheticElement<StateElement>,
    canDrag: () =>
      !NOT_DRAGGABLE_COMPONENTS.includes(element.type) &&
      elementId !== rootID &&
      !element.parameters.sourceElementId &&
      canDragAndDrop,
    end: () => {
      dispatch(setCurrentDropTargetParams(null));
      dispatch(setElementBeingEdited(false));
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

  useEffect(() => {
    if (!dropDomStyles && isOverArea && frameWindow) {
      setDropDomStyles(frameWindow.getComputedStyle(ref.current));
    } else if (dropDomStyles && !isOverArea) {
      setDropDomStyles(null);
    }
  }, [isOverArea, frameWindow]);

  useEffect(() => {
    if (!isOverArea && dropTargetParams && elementId === rootID) {
      dispatch(setCurrentDropTargetParams(null));
    }
  }, [isOverArea, rootID, dropTargetParams]);

  useEffect(() => {
    return () => {
      DOMHandler.INSTANCE.removeElementDom(elementId);
    };
  }, []);

  const runResetEditState = useDebouncedCallback(() => {
    dispatch(setElementCanBeEdited(false));
  }, 300);

  const clickHandler = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (event.ctrlKey || event.metaKey) {
        dispatch(toggleSelectedElement(element.id));
        return;
      }
      dispatch(setActiveElement(element.id));
      if (
        element &&
        EDITABLE_COMPONENTS_LIST.includes(element.type) &&
        !elementBeingEdited
      ) {
        if (runResetEditState.pending()) {
          runResetEditState.cancel();
        }
        if (!elementCanBeEdited) {
          dispatch(setElementCanBeEdited(true));
        } else if (!elementBeingEdited) {
          runResetEditState.callback();
        }
      }
      if (elementCanBeEdited) {
        dispatch(setElementBeingEdited(true));
        ref.current.focus();
      }
    },
    [
      dispatch,
      element,
      elementBeingEdited,
      elementCanBeEdited,
      runResetEditState,
    ],
  );

  const keyDownHandler = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.stopPropagation();
      const event = e.nativeEvent as KeyboardEvent;
      if (event.code === 'Enter' && elementBeingEdited) {
        (event.target as HTMLElement).blur();
        e.preventDefault();
      }
    },
    [elementBeingEdited],
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
      onKeyDown={keyDownHandler}
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
        />
      ))}
    </ElementRenderer>
  );
};

export default DraggableElement;
