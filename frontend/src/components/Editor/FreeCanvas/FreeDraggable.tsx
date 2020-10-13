import React from 'react';
import { useDrag } from 'react-dnd';

const style: React.CSSProperties = {
  position: 'absolute',
  border: '1px solid grey',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

type Props = {
  id: any;
  left: number;
  top: number;
};

const FreeDraggable: React.FC<Props> = ({ id, left, top, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, type: 'element' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return isDragging ? (
    <div ref={drag} />
  ) : (
    <div ref={drag} style={{ ...style, left, top }}>
      {children}
    </div>
  );
};

export default FreeDraggable;
