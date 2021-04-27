import React, { useMemo } from 'react';
import { BorderStyles, DropTargetParams } from '@Src/types';
import { DropPosition } from '@Constants/dragAndDrop';
import { BorderPosition } from '../constants';
import Border from './Border';
import DropPositionMarker from './DropPositionMarker';

type Props = {
  elementId: string;
  styles: BorderStyles;
  isActiveBorder: boolean;
  dropTargetParams: DropTargetParams | null;
  enableDropTargetBordersMode: boolean;
  preSelectedElementId: string | null;
};

const Borders: React.FC<Props> = ({
  elementId,
  styles,
  isActiveBorder,
  dropTargetParams,
  enableDropTargetBordersMode,
  preSelectedElementId,
}) => {
  const isDropTarget = dropTargetParams?.id === elementId;

  const showBordersPosition = useMemo(() => {
    return {
      [BorderPosition.TOP]:
        enableDropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.ABOVE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.BOTTOM]:
        enableDropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BELOW].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.LEFT]:
        enableDropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BEFORE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.RIGHT]:
        enableDropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.AFTER].includes(
            dropTargetParams.position,
          )),
    };
  }, [dropTargetParams, enableDropTargetBordersMode, isDropTarget]);

  if (!elementId || !styles) {
    return null;
  }

  return (
    <>
      {showBordersPosition[BorderPosition.TOP] && (
        <Border
          position={BorderPosition.TOP}
          elementId={elementId}
          isActive={isActiveBorder}
          styles={styles}
          visiblePreSelect={elementId === preSelectedElementId}
        />
      )}
      {showBordersPosition[BorderPosition.BOTTOM] && (
        <Border
          position={BorderPosition.BOTTOM}
          elementId={elementId}
          isActive={isActiveBorder}
          styles={styles}
          visiblePreSelect={elementId === preSelectedElementId}
        />
      )}
      {showBordersPosition[BorderPosition.LEFT] && (
        <Border
          position={BorderPosition.LEFT}
          elementId={elementId}
          isActive={isActiveBorder}
          styles={styles}
          visiblePreSelect={elementId === preSelectedElementId}
        />
      )}
      {showBordersPosition[BorderPosition.RIGHT] && (
        <Border
          position={BorderPosition.RIGHT}
          elementId={elementId}
          isActive={isActiveBorder}
          styles={styles}
          visiblePreSelect={elementId === preSelectedElementId}
        />
      )}
      {enableDropTargetBordersMode && isDropTarget && (
        <DropPositionMarker styles={styles} isActive={isActiveBorder} />
      )}
    </>
  );
};

export default Borders;
