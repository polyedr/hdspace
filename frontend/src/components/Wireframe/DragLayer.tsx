import { useDragLayer } from 'react-dnd';
import Screen from './Screen';
import React from 'react';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  if (isSnapToGrid) {
    // x -= initialOffset.x;
    // y -= initialOffset.y;
    // [x, y] = snapToGrid(x, y);
    // x += initialOffset.x;
    // y += initialOffset.y;
  }
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

const DragLayer = () => {
  const { initialOffset, currentOffset, isDragging, item } = useDragLayer(
    (monitor) => ({
      type: monitor.getItemType(),
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  );

  const renderItem = () => {
    return <Screen data={item} />;
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, false)}>
        {renderItem()}
      </div>
    </div>
  );
};

export default DragLayer;
