import { Entity } from '../../../domain/core';

export type Node = {
  id: string;
  data: { title: string; type: Entity | 'none' };
  hasChildren: boolean;
  isExpanded: boolean;
  children: string[];
};
