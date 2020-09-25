import { mutateTree, TreeData } from '@atlaskit/tree';
import { LibraryElement } from '../../../api/types';
import { StateElement, Map } from '../../../redux/project/types';
import { Node } from './types';

export const convertTree = (element: LibraryElement<any>) => ({
  id: element.id,
  data: { title: element.name, type: element.type },
  hasChildren: !!element.children.length,
  isExpanded: element.type === 'root',
  children: element.children.map((child) => convertTree(child)),
});

export const convertElements = (elements: Map<StateElement>): Map<Node> =>
  Object.fromEntries(
    Object.entries(elements).map(([key, value]) => [
      key,
      {
        id: value.id,
        data: { title: value.name, type: value.type },
        children: value.children,
        hasChildren: !!value.children.length,
        isExpanded: value.type === 'root',
        parent: value.type === 'root' ? 'root' : value.parent,
      },
    ]),
  );

export const makeTree = (nodes: Map<Node>, rootId: string): TreeData => ({
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [rootId],
      hasChildren: true,
      isExpanded: true,
      data: {
        title: 'root',
      },
    },
    ...nodes,
  },
});

export const updateTree = (oldTree: TreeData, newTree: TreeData): TreeData => {
  let res = { ...newTree };
  Object.keys(newTree.items).forEach((itemId) => {
    if (oldTree.items[itemId]) {
      res = mutateTree(res, itemId, {
        isExpanded: oldTree.items[itemId]?.isExpanded,
      });
    }
  });
  return res;
};

export const findNextNodeId = (tree, itemId, traverseChildren = true) => {
  const item = tree.items[itemId];
  const parent = tree.items[item.parent];

  if (!parent) return item.children[0];

  if (item.isExpanded && item.children[0] && traverseChildren)
    return item.children[0];

  const itemsIndex = parent.children.indexOf(itemId);

  if (!parent.children[itemsIndex + 1]) {
    return findNextNodeId(tree, parent.id, false);
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

export const findPrevNodeId = (tree, itemId) => {
  const item = tree.items[itemId];
  const parent = tree.items[item.parent];
  const itemIndex = parent.children.indexOf(itemId);

  if (parent.id === 'root' && item.id === parent.children[0]) {
    return findLastExpandedChild(
      tree,
      parent.children[parent.children.length - 1],
    );
  }

  const prevItem = tree.items[parent.children[itemIndex - 1]];

  if (!prevItem) return parent.id;

  return prevItem.hasChildren && prevItem.isExpanded
    ? findLastExpandedChild(
        tree,
        prevItem.children[prevItem.children.length - 1],
      )
    : prevItem.id;
};

export const focusTreeItem = (itemId) => {
  (document.querySelector(`#treeitem-${itemId}`) as HTMLElement)?.focus();
};
