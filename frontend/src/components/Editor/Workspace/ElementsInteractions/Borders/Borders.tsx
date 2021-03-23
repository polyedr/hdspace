import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BorderStyles } from '@Src/types';
import {
  selectActiveElementId,
  selectElementById,
  selectHoveredElementId,
} from '@Redux/project/selectors/element';
import {
  selectCurrentDropTargetParams,
  selectIsDropTarget,
} from '@Redux/project/selectors/base';
import { DropPosition } from '@Constants/dragAndDrop';
import { selectDropTargetBordersMode } from '@Redux/user/selectors';
import { BorderPosition } from '../constants';
import Border from './Border';
import DropPositionMarker from './DropPositionMarker';

type Props = {
  elementId: string;
  styles: BorderStyles;
};

const Borders: React.FC<Props> = ({ elementId, styles }) => {
  const element = useSelector(selectElementById(elementId));
  const activeElementId = useSelector(selectActiveElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const isDropTarget = useSelector(selectIsDropTarget(elementId));
  const dropTargetBordersMode = useSelector(selectDropTargetBordersMode);

  const isActiveBorder = [
    activeElementId,
    hoveredElementId,
    dropTargetParams?.id,
  ].includes(elementId);

  const showBordersPosition = useMemo(() => {
    return {
      [BorderPosition.TOP]:
        dropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.ABOVE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.BOTTOM]:
        dropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BELOW].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.LEFT]:
        dropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BEFORE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.RIGHT]:
        dropTargetBordersMode ||
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.AFTER].includes(
            dropTargetParams.position,
          )),
    };
  }, [dropTargetBordersMode, dropTargetParams, isDropTarget]);

  if (!element || !styles) {
    return null;
  }

  return (
    <>
      {showBordersPosition[BorderPosition.TOP] && (
        <Border
          position={BorderPosition.TOP}
          element={element}
          isActive={isActiveBorder}
          styles={styles}
        />
      )}
      {showBordersPosition[BorderPosition.BOTTOM] && (
        <Border
          position={BorderPosition.BOTTOM}
          element={element}
          isActive={isActiveBorder}
          styles={styles}
        />
      )}
      {showBordersPosition[BorderPosition.LEFT] && (
        <Border
          position={BorderPosition.LEFT}
          element={element}
          isActive={isActiveBorder}
          styles={styles}
        />
      )}
      {showBordersPosition[BorderPosition.RIGHT] && (
        <Border
          position={BorderPosition.RIGHT}
          element={element}
          isActive={isActiveBorder}
          styles={styles}
        />
      )}
      {dropTargetBordersMode && isDropTarget && (
        <DropPositionMarker styles={styles} isActive={isActiveBorder} />
      )}
    </>
  );
};

export default Borders;
