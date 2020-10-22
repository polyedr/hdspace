import { DropTargetMonitor } from 'react-dnd';

export type SyntheticGlobalElement<T, P> = {
  type: string;
  original?: T;
  canDrop?: (monitor: DropTargetMonitor, collectedParams?: P) => boolean;
  drop?: (monitor: DropTargetMonitor, collectedParams?: P) => void;
  hover?: (monitor: DropTargetMonitor, collectedParams?: P) => void;
  collect?: (monitor: DropTargetMonitor, collectedParams?: P) => void;
};
