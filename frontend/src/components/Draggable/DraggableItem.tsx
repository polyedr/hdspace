import React, { useMemo, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import {
  /* addBorderedElementRect, */
  moveElement,
  /* removeBorderedElementRect, */
} from '../../redux/project/actions';
import { LibraryElementUnion } from '../../api/types';
import useElementProps from '../Editor/hooks/useElementProps';
import { RENDERERS } from '../UI/RenderElements';
import ItemType from './ItemTypes';
import {
  /* selectActiveElement, */
  selectCurrentRootId,
  selectCurrentScreenId,
} from '../../redux/project/selectors';
import { CONTAINER_GROUPS } from '../../constants/defaultParams';

// const styles = require('./DraggableItem.scss');

type SyntheticItem = {
  original: LibraryElementUnion;
  parent?: LibraryElementUnion;
  type: ItemType;
};

type DraggableItemProps = {
  item: LibraryElementUnion;
  parent?: LibraryElementUnion;
};
const DraggableItem: React.FC<DraggableItemProps> = ({ item, parent }) => {
  const elementProps = useElementProps(item);
  const rootID = useSelector(selectCurrentRootId);
  const screenId = useSelector(selectCurrentScreenId);
  // const activeElement = useSelector(selectActiveElement);
  const dispatch = useDispatch();
  const ref = useRef<HTMLElement>(null);

  const dropTarget = useMemo(() => {
    if (
      !!parent &&
      (!item.parameters.group ||
        !CONTAINER_GROUPS.includes(item.parameters.group))
    ) {
      return parent;
    }
    return item;
  }, [item]);

  const [, drag] = useDrag({
    item: {
      original: item,
      parent,
      type: ItemType.ELEMENT,
    } as SyntheticItem,
    canDrag: () => item.id !== rootID,
  });

  const [, drop] = useDrop({
    accept: [ItemType.ELEMENT, ItemType.CONSTRUCTOR],
    drop: (draggedItem: SyntheticItem, monitor: DropTargetMonitor) => {
      if (monitor.didDrop()) {
        return;
      }
      const oldIndex = draggedItem.original.buoyancy;
      // drop into same parent
      if (draggedItem.original.id === item.id) {
        return; // drop into same position
      }

      const newIndex =
        dropTarget.id === item.id
          ? (dropTarget.children as LibraryElementUnion[]).length
          : item.buoyancy;
      dispatch(
        moveElement(
          draggedItem.original.id,
          {
            oldIndex,
            newIndex,
          },
          {
            oldParentId: draggedItem.parent?.id || '',
            newParentId: dropTarget.id,
          },
          { screenId },
        ),
      );
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    drag(ref);
    drop(ref);
  }, [ref.current]);

  /*  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (
      [rootID, activeElement.id].includes(item.id) ||
      (!!parent && parent.id === rootID)
    ) {
      dispatch(
        addBorderedElementRect(item.id, ref.current.getBoundingClientRect()),
      );
    }
  }, [
    ref.current,
    activeElement,
    item.styles.classNames,
    item.styles.ownStyles,
  ]);

  useEffect(() => {
    return () => {
      dispatch(removeBorderedElementRect(item.id));
    };
  }); */

  const ElementRenderer = RENDERERS[item.type];

  return (
    elementProps && (
      <ElementRenderer {...elementProps} elementRef={ref}>
        {(item.children as LibraryElementUnion[])?.map((child) => (
          <DraggableItem key={`item-${child.id}`} item={child} parent={item} />
        ))}
      </ElementRenderer>
    )
  );
};

export default DraggableItem;
