/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React, { useEffect, KeyboardEvent } from 'react';
import AtlasTree, {
  mutateTree,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData,
} from '@atlaskit/tree';
import { useDispatch, useSelector } from 'react-redux';
import TreeItem from './TreeItem';
import { findPrevNodeId, findNextNodeId, focusTreeItem } from '../utils';
import {
  selectActiveItem,
  selectCurrentScreenElement,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import { DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT } from '../../../features/notification/types';
import {
  copyActiveItem,
  deleteItem,
  moveElement,
  pasteCopiedItem,
  redoAction,
  setActiveItem,
  setNotification,
  undoAction,
} from '../../../redux/project/actions';
import { findChildByID } from '../../../utils/ElementsTreeHelper';
import { isElementCanBeAdded } from '../../../utils/AvailableChildrenHelper';
import Scrollbar from '../../UI/Scrollbar';

const styles = require('../Navigator.scss');

type Props = {
  tree: TreeData;
  setTree: React.Dispatch<React.SetStateAction<TreeData>>;
  selectedItemId: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const TreeView: React.FC<Props> = ({
  tree,
  setTree,
  selectedItemId,
  setSelectedItem,
  isDragging,
  setIsDragging,
}) => {
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const rootElement = useSelector(selectCurrentScreenElement);
  const { itemId: activeItemId } = useSelector(selectActiveItem);

  const expand = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: true }));

  const collapse = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: false }));

  const select = (itemId) => {
    if (selectedItemId === itemId) return;

    const item = findChildByID(rootElement, itemId);
    if (!item) return;

    dispatch(
      setActiveItem({
        itemId,
        itemType: item.type,
        name: item.name,
      }),
    );
    setSelectedItem(itemId);
  };

  const deselect = () => {
    setSelectedItem(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedItemId && !isDragging) {
      if (e.keyCode === 38) {
        // ArrowUp
        // TODO: add throttling
        e.preventDefault();
        const prevNodeId = findPrevNodeId(tree, selectedItemId);
        select(prevNodeId);
        focusTreeItem(prevNodeId);
      }

      if (e.keyCode === 40) {
        // ArrowDown
        // TODO: add throttling
        e.preventDefault();
        const nextNodeId = findNextNodeId(tree, selectedItemId);
        focusTreeItem(nextNodeId);
      }

      if (e.keyCode === 39) {
        // ArrowRight
        expand(selectedItemId);
        select(selectedItemId);
      }

      if (e.keyCode === 37) {
        // ArrowLeft
        collapse(selectedItemId);
        select(selectedItemId);
      }

      if (e.keyCode === 32) {
        // Space
        setIsDragging((state) => !state);
      }

      if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + C
        dispatch(copyActiveItem());
      }

      if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + V
        dispatch(pasteCopiedItem({ screenId: currentScreenId }));
      }

      if (e.keyCode === 46 || (e.keyCode === 8 && e.metaKey)) {
        // Delete or Cmd + Backspace
        const prevItemId = findPrevNodeId(tree, selectedItemId);
        dispatch(deleteItem(selectedItemId, { screenId: currentScreenId }));
        focusTreeItem(prevItemId);
      }

      if (e.keyCode === 90 && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        // Ctrl/Cmd + Z
        dispatch(undoAction());
      }

      if (e.keyCode === 90 && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        // Ctrl/Cmd + Shift + Z
        dispatch(redoAction());
      }
    }
  };

  const dragStart = (itemId) => select(itemId);

  const dragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) {
      setIsDragging(false);
      return;
    }

    if (destination.index === undefined) destination.index = -1;
    const { items } = tree;

    const oldParent = items[source.parentId];
    const newParent = items[destination.parentId];
    const childId = oldParent.children[source.index];
    const child = items[childId];
    const parentElement = findChildByID(rootElement, newParent.id as string);
    if (!parentElement) {
      console.error(`No element ${newParent.id}`);
      setIsDragging(false);
      return;
    }
    if (!isElementCanBeAdded(parentElement, child.data.type)) {
      dispatch(setNotification(DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT));
      setIsDragging(false);
      return;
    }
    const isRemote = source.parentId !== destination.parentId;

    if (isRemote) {
      dispatch(
        moveElement(
          { newIndex: destination.index, oldIndex: source.index },
          childId as string,
          source.parentId as string,
          true,
          { screenId: currentScreenId },
        ),
      );
    }

    dispatch(
      moveElement(
        { newIndex: destination.index, oldIndex: source.index },
        childId as string,
        destination.parentId as string,
        false,
        { screenId: currentScreenId },
      ),
    );

    setIsDragging(false);
    select(
      newParent.isExpanded ? oldParent.children[source.index] : newParent.id,
    );
  };

  const expandParents = (itemId) => {
    if (itemId === 'root') return;
    // @ts-ignore
    const parentId = tree.items[itemId]?.parent;
    if (!parentId) return;

    setTree((prevTree) => mutateTree(prevTree, parentId, { isExpanded: true }));
    expandParents(parentId);
  };

  useEffect(() => {
    setSelectedItem(activeItemId);
    expandParents(activeItemId);
  }, [activeItemId]);

  const renderItem = (props) => (
    <TreeItem
      {...props}
      expand={expand}
      select={select}
      deselect={deselect}
      selectedItemId={selectedItemId}
    />
  );

  return (
    <div className={styles.tree} onKeyDown={handleKeyDown}>
      <Scrollbar autoHeightMin="100%">
        <AtlasTree
          tree={tree}
          renderItem={renderItem}
          onExpand={expand}
          onCollapse={collapse}
          onDragStart={dragStart}
          onDragEnd={dragEnd}
          offsetPerLevel={10}
          isDragEnabled
          isNestingEnabled
        />
      </Scrollbar>
    </div>
  );
};

export default TreeView;
