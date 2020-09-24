import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { CONTAINER_GROUPS } from '../../../../constants/defaultParams';
import { AppReduxState } from '../../../../shared/types/app';
import {
  selectActiveElementId,
  selectCurrentDropTargetId,
  selectElementById,
  selectShowingBorders,
} from '../../../../redux/project/selectors';
import useBorderStyles from '../hooks/useBorderStyles';
import Border, { BorderPosition, StyleProps } from './Border';

type Props = {
  elementId: string;
};

const Borders: React.FC<Props> = ({ elementId }) => {
  const { element, activeElementId, showBorders, dropTargetId } = useSelector(
    (state: AppReduxState) => ({
      element: selectElementById(elementId)(state),
      activeElementId: selectActiveElementId(state),
      showBorders: selectShowingBorders(state),
      dropTargetId: selectCurrentDropTargetId(state),
    }),
  );
  const isDropTarget = elementId === dropTargetId;
  const isDropTargetContainer =
    element.parameters.group &&
    CONTAINER_GROUPS.includes(element.parameters.group);

  const styles = useBorderStyles(elementId);

  const handleDropTargetProps = useCallback((styleProps: StyleProps | null) => {
    if (!styles || !styleProps) {
      return {};
    }
    let borderTop = styleProps.top || 0;
    if (isDropTargetContainer) {
      borderTop -= 5;
    } else {
      borderTop += 5;
    }
    return {
      top: borderTop,
      left: (styleProps.left || 0) + (styles.width / 2 - 5),
      right: (styleProps.right || styles.width) - (styles.width / 2 + 5),
      width: 10,
      height: 1,
    };
  }, []);

  const isActive = elementId === activeElementId;

  const displayBorders = showBorders || isActive || isDropTarget;

  return element && styles && displayBorders ? (
    <>
      <Border
        position={BorderPosition.TOP}
        element={element}
        isActive={isActive || isDropTarget}
        styles={styles}
      />
      <Border
        position={BorderPosition.BOTTOM}
        element={element}
        isActive={isActive || isDropTarget}
        styles={styles}
      />
      <Border
        position={BorderPosition.LEFT}
        element={element}
        isActive={isActive || isDropTarget}
        styles={styles}
        isDropTarget={isDropTarget}
      />
      <Border
        position={BorderPosition.RIGHT}
        element={element}
        isActive={isActive || isDropTarget}
        styles={styles}
      />
      {isDropTarget && (
        <Border
          position={
            isDropTargetContainer ? BorderPosition.BOTTOM : BorderPosition.TOP
          }
          element={element}
          isActive
          styles={styles}
          onRenderProps={handleDropTargetProps}
        />
      )}
    </>
  ) : null;
};

export default Borders;
