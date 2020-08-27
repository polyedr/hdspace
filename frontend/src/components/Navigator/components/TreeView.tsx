/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React from 'react';
import AtlasTree, {
  moveItemOnTree,
  mutateTree,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData,
} from '@atlaskit/tree';
import { useDispatch, useSelector } from 'react-redux';
import TreeItem from './TreeItem';
import { findPrevNode, findNextNode } from '../utils';
import { setActiveItem } from '$redux/project/actions';
import { findChildByID } from '$utils/ElementsTreeHelper';
import { selectCurrentScreenElement } from '$redux/project/selectors';

const styles = require('../Navigator.scss');

// export const addNode = ({ state, setState }, node) => {
//   const parent = state.selectedItem || 'root';
//
//   setState(
//     produce((draft) => {
//       draft.items[parent].isExpanded = true;
//       draft.items[parent].hasChildren = true;
//       draft.items[parent].children.push(node.id);
//       draft.items[node.id] = { ...node, parent };
//       selectItem(draft, node.id);
//     }),
//   );
// };

type Props = {
  tree: TreeData;
  setTree: React.Dispatch<React.SetStateAction<TreeData>>;
  selectedItem: string | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const TreeView: React.FC<Props> = ({
  tree,
  setTree,
  selectedItem,
  setSelectedItem,
  isDragging,
  setIsDragging,
}) => {
  const dispatch = useDispatch();
  const rootElement = useSelector(selectCurrentScreenElement);

  const expand = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: true }));

  const collapse = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: false }));

  const select = (itemId) => {
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

  // const removeNode = ({ state, setState }, itemId) => {
  //   setState(
  //     produce((draft) => {
  //       if (!itemId || itemId === 'root') return;
  //       const item = draft.items[itemId];
  //       const parent = draft.items[item.parent];
  //       const itemIndex = parent.children.indexOf(itemId);
  //
  //       draft.items[item.parent].children = parent.children.filter(
  //         (id) => id !== itemId,
  //       );
  //
  //       delete draft.items[itemId];
  //
  //       parent.hasChildren = !!parent.children.length;
  //
  //       selectItem(
  //         draft,
  //         parent.children[itemIndex === 0 ? 0 : itemIndex - 1] || parent.id,
  //       );
  //     }),
  //   );
  // };

  // const removeSelectedNode = ({ state, setState }) => {
  //   removeNode({ state, setState }, state.selectedItem);
  // };

  const handleKeyDown = (e) => {
    if (selectedItem && !isDragging) {
      if (e.key === 'ArrowUp') select(findPrevNode(tree, selectedItem));

      if (e.key === 'ArrowDown') select(findNextNode(tree, selectedItem));

      if (e.key === 'ArrowRight') {
        expand(selectedItem);
        select(selectedItem);
      }

      if (e.key === 'ArrowLeft') {
        collapse(selectedItem);
        select(selectedItem);
      }

      // if (e.key === 'n') {
      //   addNode(selectedItem);
      // }

      // if (e.key === 'Delete') {
      //   removeSelectedNode();
      // }

      if (e.key === ' ') {
        setIsDragging((state) => !state);
      }
    }
  };

  const dragStart = (itemId) => select(itemId);

  const dragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) return;
    const { items } = tree;

    const oldParent = items[source.parentId];
    const newParent = items[destination.parentId];
    const childId = oldParent.children[source.index];
    const child = items[childId];

    setIsDragging(false);

    setTree((state) => {
      const nextState = moveItemOnTree(state, source, destination);
      return {
        ...nextState,
        items: {
          ...nextState.items,
          [childId]: { ...child, parent: newParent.id },
        },
      };
    });
    select(
      newParent.isExpanded ? oldParent.children[source.index] : newParent.id,
    );
  };

  const renderItem = (props) => (
    <TreeItem
      {...props}
      select={select}
      deselect={deselect}
      selectedItem={selectedItem}
    />
  );
  return (
    <div className={styles.tree} id="tree" onKeyDown={handleKeyDown}>
      <AtlasTree
        tree={tree}
        renderItem={renderItem}
        onExpand={expand}
        onCollapse={collapse}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        offsetPerLevel={20}
        isDragEnabled
        isNestingEnabled
      />
    </div>
  );
};

export default TreeView;
