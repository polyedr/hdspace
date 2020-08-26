/* eslint-disable */
import React from 'react';
import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import { curry } from 'ramda';
import produce from 'immer';
import TreeItem from './TreeItem';
import { findPrevNode, findNextNode } from '../utils';

const styles = require('../Navigator.scss');

export const expand = curry(({ setState }, itemId) => {
  setState((state) => mutateTree(state, itemId, { isExpanded: true }));
});

export const collapse = curry(({ setState }, itemId) => {
  setState((state) => mutateTree(state, itemId, { isExpanded: false }));
});

export const select = curry(({ setState }, itemId) => {
  setState(produce((draft) => selectItem(draft, itemId)));
});

const selectItem = (draft, itemId) => {
  draft.selectedItem = itemId;
  Object.keys(draft.items).forEach(
    (id) => (draft.items[id] = mutateTree(draft, id, {}).items[id]),
  );
};

export const deselect = ({ setState }) => {
  setState(
    produce((draft) => {
      draft.selectedItem = null;
      Object.keys(draft.items).forEach(
        (id) => (draft.items[id] = mutateTree(draft, id, {}).items[id]),
      );
    }),
  );
};

export const addNode = ({ state, setState }, node) => {
  const parent = state.selectedItem || 'root';

  setState(
    produce((draft) => {
      draft.items[parent].isExpanded = true;
      draft.items[parent].hasChildren = true;
      draft.items[parent].children.push(node.id);
      draft.items[node.id] = { ...node, parent };
      selectItem(draft, node.id);
    }),
  );
};

export const removeNode = ({ state, setState }, itemId) => {
  setState(
    produce((draft) => {
      if (!itemId || itemId === 'root') return;
      const item = draft.items[itemId];
      const parent = draft.items[item.parent];
      const itemIndex = parent.children.indexOf(itemId);

      draft.items[item.parent].children = parent.children.filter(
        (id) => id !== itemId,
      );

      delete draft.items[itemId];

      parent.hasChildren = !!parent.children.length;

      selectItem(
        draft,
        parent.children[itemIndex === 0 ? 0 : itemIndex - 1] || parent.id,
      );
    }),
  );
};

export const removeSelectedNode = ({ state, setState }) => {
  removeNode({ state, setState }, state.selectedItem);
  console.log('node removed');
};

export const handleKeyDown = curry(({ addNode, state, setState }, e) => {
  if (state.selectedItem && !state.isDragging) {
    if (e.key === 'ArrowUp')
      select({ state, setState }, findPrevNode(state, state.selectedItem));

    if (e.key === 'ArrowDown')
      select({ state, setState }, findNextNode(state, state.selectedItem));

    if (e.key === 'ArrowRight') {
      expand({ state, setState }, state.selectedItem);
      select({ state, setState }, state.selectedItem);
    }

    if (e.key === 'ArrowLeft') {
      collapse({ state, setState }, state.selectedItem);
      select({ state, setState }, state.selectedItem);
    }

    if (e.key === 'n') {
      addNode(state.selectedItem);
    }

    if (e.key === 'd') {
      removeSelectedNode({ state, setState });
    }

    if (e.keyCode === 32 /* Spacebar */) {
      setState((state) => ({ ...state, isDragging: !state.isDragging }));
    }
  }
});

export default ({ addNode, state, setState, promap }) => {
  return (
    <div
      className={styles.tree}
      id="tree"
      onKeyDown={handleKeyDown({ addNode, state, setState })}
    >
      <Tree
        tree={state}
        renderItem={renderItem({ state, setState })}
        onExpand={expand({ state, setState })}
        onCollapse={collapse({ state, setState })}
        onDragStart={dragStart({ state, setState })}
        onDragEnd={dragEnd({ state, setState })}
        offsetPerLevel={20}
        isDragEnabled
        isNestingEnabled
      />
    </div>
  );
};

// - Helpers

const dragStart = curry(({ state, setState }, itemId) =>
  select({ state, setState }, itemId),
);

const dragEnd = curry(({ state, setState }, source, destination) => {
  if (!destination) {
    return;
  }

  const oldParent = state.items[source.parentId];
  const newParent = state.items[destination.parentId];
  const childId = oldParent.children[source.index];
  const child = state.items[childId];

  setState((state) => {
    const nextState = moveItemOnTree(state, source, destination);
    return {
      ...state,
      ...nextState,
      isDragging: false,
      items: {
        ...nextState.items,
        [childId]: { ...child, parent: newParent.id },
      },
    };
  });
  select(
    { state, setState },
    newParent.isExpanded ? oldParent.children[source.index] : newParent.id,
  );
});

const renderItem = curry(({ state, setState }, props) => (
  <TreeItem
    {...props}
    select={select({ state, setState })}
    deselect={() => deselect({ setState })}
    selectedItem={state.selectedItem}
  />
));
