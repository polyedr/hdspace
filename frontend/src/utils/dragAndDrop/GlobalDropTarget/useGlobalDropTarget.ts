import React, { useEffect } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';

import { SyntheticGlobalElement } from './types';

const useGlobalDropTarget = (
  itemTypes: string[],
  dropTargetRef: React.RefObject<HTMLElement>,
) => {
  const [collectedParams, drop] = useDrop({
    accept: itemTypes,
    drop: (
      item: SyntheticGlobalElement<unknown, unknown>,
      monitor: DropTargetMonitor,
    ) => {
      if (item.drop) {
        item.drop(monitor, collectedParams);
      }
    },
    canDrop: (
      item: SyntheticGlobalElement<unknown, unknown>,
      monitor: DropTargetMonitor,
    ) => {
      if (item.canDrop) {
        return item.canDrop(monitor, collectedParams);
      }
      return true;
    },
    hover: (
      item: SyntheticGlobalElement<unknown, unknown>,
      monitor: DropTargetMonitor,
    ) => {
      if (item.hover) {
        return item.hover(monitor, collectedParams);
      }
      return true;
    },
  });

  useEffect(() => {
    if (dropTargetRef && dropTargetRef.current) {
      drop(dropTargetRef);
    }
  }, [drop, dropTargetRef]);
};

export default useGlobalDropTarget;
