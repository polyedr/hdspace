import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { setActiveElement } from '../../../redux/project/actions';
import { StateElement } from '../../../redux/project/types';
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

  const [{ isDragging }, drag] = useDrag({
    item: { id, left, top, type: 'freeElement' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: () => {
      dispatch(setActiveElement(id));
    },
  });

  return isDragging ? (
    <div ref={drag} /> // to hide source while dragging
  ) : (
    <FreeElementRenderer element={element} isActive={isActive} ref={drag} />
  );
};

export default FreeDraggable;
