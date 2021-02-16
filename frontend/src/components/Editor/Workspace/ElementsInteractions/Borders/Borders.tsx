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
import {
  selectActiveMasterElementId,
  selectMasterElementById,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/masterScreen';
import { BorderPosition } from '../constants';
import Border from './Border';

type Props = {
  elementId: string;
  styles: BorderStyles;
};

const Borders: React.FC<Props> = ({ elementId, styles }) => {
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const masterElement = useSelector(selectMasterElementById(elementId));
  const stateElement = useSelector(selectElementById(elementId));
  const activeElementId = useSelector(selectActiveElementId);
  const masterActiveElementId = useSelector(selectActiveMasterElementId);
  const hoveredElementId = useSelector(selectHoveredElementId);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);
  const isDropTarget = useSelector(selectIsDropTarget(elementId));

  const element = masterScreenEnabled ? masterElement : stateElement;
  const activeId = masterScreenEnabled
    ? masterActiveElementId
    : activeElementId;

  const isActiveBorder = [
    activeId,
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
