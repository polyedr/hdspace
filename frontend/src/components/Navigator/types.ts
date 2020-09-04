export type Node = {
  id: string;
  data: { title: string };
  hasChildren: boolean;
  isExpanded: boolean;
  isChildrenLoading: boolean;
  children: string[];
};
