import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentRootId } from '@Redux/project/selectors/element';

import DraggableElement from '../Draggable/DraggableElement';

const Screen: React.FC = () => {
  const rootId = useSelector(selectCurrentRootId);
  return <DraggableElement elementId={rootId} />;
};

export default Screen;
