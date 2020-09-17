import React, { useCallback, useState } from 'react';
import * as R from 'ramda';
import { useSelector, useDispatch } from 'react-redux';
import SortableGroup from '../SortableGroup/SortableGroup';
import { AVAILABLE_CHILDREN, Entity } from '../../../domain/core';
import { LibraryElement, LibraryElementUnion } from '../../../api/types';
import { LIST_SCENARIO_TYPE } from '../../../constants/defaultParams';
import { Indices } from '../../../redux/project/types';

import useElementProps from '../hooks/useElementProps';
import { RENDERERS } from '../../UI/RenderElements';
import {
  selectActiveItem,
  selectCurrentScreen,
  selectRootID,
} from '../../../redux/project/selectors';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import { moveElement } from '../../../redux/project/actions';
import LIST_NOT_DRAGGING from '../../../domain/constants/listNotDragging';

type Props = {
  item: LibraryElementUnion;
  isMoving: boolean;
  isResizing: boolean;
  isResizable?: boolean;

  onActiveElementChange(parentId: number, child: LibraryElement<Entity>): void;
  setIsMoving: (value: boolean) => void;
  setIsResizing: (value: boolean) => void;
};

const SortableContainer: React.FC<Props> = ({
  item,
  isMoving,
  onActiveElementChange,
  setIsMoving,
  isResizing,
  setIsResizing,
  isResizable,
}) => {
  const rootID = useSelector(selectRootID);
  const currentScreen = useSelector(selectCurrentScreen);
  const disableInteractions = useSelector(selectIsPrototypeMode);
  const activeItem = useSelector(selectActiveItem);

  const getGroupName = useCallback(
    (itemType): string =>
      LIST_SCENARIO_TYPE.indexOf(itemType) !== -1 ? itemType : 'element',
    [],
  );

  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const itemProps = useElementProps(item);

  if (itemProps === null) {
    return null;
  }

  const handleChooseToSort = (itemIndex: number) => {
    // TODO: called when item chosen for sorting. rewrite without onActiveElementChange use
    setIsDragging(true);
    const draggedItem = (item.children as LibraryElementUnion[]).find(
      (child) => child.buoyancy === itemIndex,
    );
    const itemID = draggedItem?.id;

    if (itemID !== activeItem.itemId && draggedItem && itemID) {
      onActiveElementChange(Number(itemID), draggedItem);
    }
  };

  const handleItemPositionChange = (
    indices: Indices,
    parentId: string,
    isRemote?: boolean,
  ) => {
    setIsDragging(!!isRemote);
    dispatch(
      moveElement(
        indices,
        activeItem.itemId,
        parentId === 'root' ? rootID : parentId,
        isRemote,
        { screenId: currentScreen.id },
      ),
    );
  };

  const getIsPutItem = (type: Entity): boolean | string[] => {
    const availableChildren = Object.keys(AVAILABLE_CHILDREN[type]);
    const put = R.head(availableChildren) === 'all' ? true : availableChildren;
    return LIST_NOT_DRAGGING.indexOf(type) === -1 && put;
  };

  const { id, type } = item;

  const ElementRenderer = RENDERERS[type];

  return disableInteractions ? (
    <ElementRenderer key={id} {...itemProps}>
      {(item.children as LibraryElementUnion[])?.map((child) => (
        <SortableContainer
          key={child.id}
          isMoving={isMoving}
          item={child}
          onActiveElementChange={onActiveElementChange}
          setIsMoving={setIsMoving}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />
      ))}
    </ElementRenderer>
  ) : (
    <SortableGroup
      elementRenderer={ElementRenderer}
      disableSortable={!isMoving || disableInteractions}
      isPutItem={getIsPutItem(type)}
      group={getGroupName(type)}
      onChoose={handleChooseToSort}
      isSomeItemBeingDragged={isDragging}
      isSomeItemResizable={isResizable}
      onChange={handleItemPositionChange}
      {...itemProps}
    >
      {(item.children as LibraryElementUnion[])?.map((child) => (
        <SortableContainer
          key={child.id}
          isMoving={isMoving}
          item={child}
          onActiveElementChange={onActiveElementChange}
          setIsMoving={setIsMoving}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />
      ))}
    </SortableGroup>
  );
};

export default SortableContainer;
