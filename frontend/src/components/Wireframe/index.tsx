import React from 'react';
import Canvas from './Canvas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Props {
  projectId: number;
  screenId?: number;
  elementId?: string;
}

const Wireframe: React.FC<Props> = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Canvas />
    </DndProvider>
  );
};

export default Wireframe;
