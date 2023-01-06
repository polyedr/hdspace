import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import Screen from './Screen';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { type WireframeScreen } from './Canvas';

interface Props {
  data: WireframeScreen;
  id: string;
}

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  };
}

const DraggableScreen: React.FC<Props> = ({ data, id }) => {
  const { left, top } = data;

  const [{ isDragging }, dragRef, preview] = useDrag(
    () => ({
      type: 'wireframe-screen',
      item: { id, ...data },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, data],
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div ref={dragRef} style={getStyles(left, top, isDragging)}>
      <Screen data={data} />
    </div>
  );
};

export default DraggableScreen;
