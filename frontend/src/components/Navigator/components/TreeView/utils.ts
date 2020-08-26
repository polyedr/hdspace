/* eslint-disable */
import { nanoid } from 'nanoid';

export const node = (title, data, children) => ({
  id: nanoid(),
  data: { title, ...data },
  hasChildren: !!children.length,
  isExpanded: !!children.length,
  isChildrenLoading: false,
  children,
});

export const makeTree = (nodes) => ({
  rootId: 'root',
  selectedItem: null,
  isDragging: false,
  items: {
    root: {
      id: 'root',
      children: nodes.map((node) => node.id),
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'root',
      },
    },
    ...flattenNodes({}, nodes, 'root'),
  },
});

const flattenNodes = (root, nodes, parent) =>
  nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.id]: {
        ...node,
        parent,
        children: node.children.map((child) => child.id),
      },
      ...flattenNodes(root, node.children, node.id),
    }),
    root,
  );

export const findNextNode = (state, itemId, traverseChildren = true) => {
  const item = state.items[itemId];
  const parent = state.items[item.parent];

  if (!parent) return item.children[0];

  if (item.isExpanded && item.children[0] && traverseChildren)
    return item.children[0];

  const itemsIndex = parent.children.indexOf(itemId);

  if (!parent.children[itemsIndex + 1]) {
    return findNextNode(state, parent.id, false);
  }

  return parent.children[itemsIndex + 1];
};

const findLastExpandedChild = (state, itemId) => {
  const item = state.items[itemId];

  if (item.hasChildren && item.isExpanded)
    return findLastExpandedChild(
      state,
      item.children[item.children.length - 1],
    );
  return itemId;
};

export const findPrevNode = (state, itemId) => {
  const item = state.items[itemId];
  const parent = state.items[item.parent];
  const itemIndex = parent.children.indexOf(itemId);

  if (parent.id === 'root' && item.id === parent.children[0]) {
    return findLastExpandedChild(
      state,
      parent.children[parent.children.length - 1],
    );
  }

  const prevItem = state.items[parent.children[itemIndex - 1]];

  if (!prevItem) return parent.id;

  return prevItem.hasChildren && prevItem.isExpanded
    ? findLastExpandedChild(
        state,
        prevItem.children[prevItem.children.length - 1],
      )
    : prevItem.id;
};
