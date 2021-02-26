import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DropPosition } from '@Constants/dragAndDrop';
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
import { BorderPosition } from '../constants';
import Border from './Border';

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

  const isActiveBorder = [
    activeElementId,
    hoveredElementId,
    dropTargetParams?.id,
  ].includes(elementId);

  const showBordersPosition = useMemo(() => {
    return {
      [BorderPosition.TOP]:
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.ABOVE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.BOTTOM]:
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BELOW].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.LEFT]:
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.BEFORE].includes(
            dropTargetParams.position,
          )),
      [BorderPosition.RIGHT]:
        !isDropTarget ||
        (dropTargetParams &&
          dropTargetParams.position &&
          [DropPosition.INSIDE, DropPosition.AFTER].includes(
            dropTargetParams.position,
          )),
    };
  }, [dropTargetParams, isDropTarget]);

  return element && styles ? (
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
    </>
  ) : null;
};

export default Borders;
