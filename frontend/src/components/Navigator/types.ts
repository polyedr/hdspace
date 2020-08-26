export type Tree = {
  rootId: string;
  selectedItem: string | null;
  isDragging: boolean;
  items: Node;
};

export type Node = {
  id: string;
  data: { title: string };
  hasChildren: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  children: string[];
};
