import React, { useMemo } from 'react';
import { BoundingStyles, DropTargetParams } from '@Src/types/types';
import { ResizableBox } from 'react-resizable';
import { DropPosition } from '@Constants/dragAndDrop';
import './ResizableBox.css';
import BorderPosition from '../constants';
import Border from './Border';
import DropPositionMarker from './DropPositionMarker';

type Props = {
  elementId: string;
  type: string;
  styles: BoundingStyles;
  isActiveBorder: boolean;
  dropTargetParams: DropTargetParams | null;
  enableDropTargetBordersMode: boolean;
  preSelectedElementId: string | null;
  updateStyles(payload: React.CSSProperties): void;
};

const Borders: React.FC<Props> = ({
  elementId,
  type,
  styles,
  isActiveBorder,
  dropTargetParams,
  enableDropTargetBordersMode,
  preSelectedElementId,
  updateStyles,
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
  const { top, left, height, width } = styles;
  const onResize = (e, data) => {
    const newWidth = { width: `${Math.trunc(data.size.width)}px` };
    const newHeight = { height: `${Math.trunc(data.size.height)}px` };

    updateStyles({
      ...newWidth,
      ...newHeight,
      flexGrow: 0,
    });
  };
  return (
    <>
      {isActiveBorder &&
        !['root', 'calendar', 'clock', 'label'].includes(type) && (
          <div style={{ width }}>
            <ResizableBox
              style={{ left, top }}
              className="absolutely-positioned top-aligned left-aligned resizable-box"
              width={width}
              height={height}
              handle={(h, ref) => (
                <span
                  className={`custom-handle custom-handle-${h}`}
                  ref={ref}
                />
              )}
              handleSize={[8, 8]}
              onResize={onResize}
              onResizeStop={onResize}
              resizeHandles={
                type === 'navbar'
                  ? ['n', 's']
                  : type === 'carousel'
                  ? ['sw', 'se', 'nw', 'ne']
                  : ['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']
              }
              lockAspectRatio={type === 'carousel'}
            />
            <div
              style={{
                left: 4 + left + width,
                top: top + height / 2,
                position: 'absolute',
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
              }}
            >
              {`${height} px`}
            </div>
            <div
              style={{
                marginTop: 4 + top + height,
                textAlign: 'center',
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
              }}
            >
              {`${width} px`}
            </div>
          </div>
        )}
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
