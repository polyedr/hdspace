import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DropPosition } from '../../../../constants/dragAndDrop';
import {
  selectActiveElementId,
  selectCurrentDropTargetParams,
  selectElementById,
  selectShowingBorders,
} from '../../../../redux/project/selectors';
import { BorderStyles } from '../ElementsInteractions';
import Border, { BorderPosition } from './Border';

type DisplayDropTargetBorders = {
  [key in DropPosition]: boolean;
};

type Props = {
  elementId: string;
  styles: BorderStyles;
};

const Borders: React.FC<Props> = ({ elementId, styles }) => {
  const element = useSelector(selectElementById(elementId));
  const activeElementId = useSelector(selectActiveElementId);
  const showBorders = useSelector(selectShowingBorders);
  const dropTargetParams = useSelector(selectCurrentDropTargetParams);

  const isDropTarget = elementId === dropTargetParams?.id;

  const isActive = elementId === activeElementId;

  const displayBorders = showBorders || isActive || isDropTarget;

  const showDropTargetBorders = useMemo(() => {
    return {
      [BorderPosition.TOP]:
        !isDropTarget ||
        !dropTargetParams ||
        !dropTargetParams.position ||
        [DropPosition.INSIDE, DropPosition.ABOVE].includes(
          dropTargetParams.position,
        ),
      [BorderPosition.BOTTOM]:
        !isDropTarget ||
        !dropTargetParams ||
        !dropTargetParams.position ||
        [DropPosition.INSIDE, DropPosition.BELOW].includes(
          dropTargetParams.position,
        ),
      [BorderPosition.LEFT]:
        !isDropTarget ||
        !dropTargetParams ||
        !dropTargetParams.position ||
        [DropPosition.INSIDE, DropPosition.BEFORE].includes(
          dropTargetParams.position,
        ),
      [BorderPosition.RIGHT]:
        !isDropTarget ||
        !dropTargetParams ||
        !dropTargetParams.position ||
        [DropPosition.INSIDE, DropPosition.AFTER].includes(
          dropTargetParams.position,
        ),
    };
  }, [dropTargetParams]);

  return element && styles && displayBorders ? (
    <>
      {showDropTargetBorders[BorderPosition.TOP] && (
        <Border
          position={BorderPosition.TOP}
          element={element}
          isActive={isActive || isDropTarget}
          styles={styles}
        />
      )}
      {showDropTargetBorders[BorderPosition.BOTTOM] && (
        <Border
          position={BorderPosition.BOTTOM}
          element={element}
          isActive={isActive || isDropTarget}
          styles={styles}
        />
      )}
      {showDropTargetBorders[BorderPosition.LEFT] && (
        <Border
          position={BorderPosition.LEFT}
          element={element}
          isActive={isActive || isDropTarget}
          styles={styles}
          isDropTarget={isDropTarget}
        />
      )}
      {showDropTargetBorders[BorderPosition.RIGHT] && (
        <Border
          position={BorderPosition.RIGHT}
          element={element}
          isActive={isActive || isDropTarget}
          styles={styles}
        />
      )}
    </>
  ) : null;
};

export default Borders;
