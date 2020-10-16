import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { StateElement } from '../../../redux/project/types';
import { setActiveElement } from '../../../redux/project/actions';
import FreeElementRenderer from './FreeElementRenderer';

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeDraggable: React.FC<Props> = ({ element, isActive }) => {
  const dispatch = useDispatch();
  const {
    id,
    parameters: { left = 0, top = 0 },
  } = element;

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'freeElement', id, left, top },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: () => {
      dispatch(setActiveElement(id));
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <FreeElementRenderer
      element={element}
      isActive={isActive}
      ref={drag}
      isDragging={isDragging}
    />
  );
};

export default FreeDraggable;
