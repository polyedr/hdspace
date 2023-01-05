import { styled } from '@mui/material';
import React, { useState } from 'react';
import DraggableScreen from './DraggableScreen';
import { useDrop } from 'react-dnd';
import DragLayer from './DragLayer';

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '100%',
  position: 'relative',
}));

export interface Item {
  title: string;
  left: number;
  top: number;
}

const Canvas: React.FC = () => {
  const [screens, setScreens] = useState<Record<string, Item>>({
    a: { title: 'screen 1', left: 10, top: 10 },
    b: { title: 'screen 2', left: 50, top: 50 },
  });

  const [, drop] = useDrop(() => ({
    accept: 'wireframe-screen',
    drop: (item: Item & { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveScreen(item.id, left, top);
    },
  }));

  const moveScreen = (id, left, top) => {
    setScreens((screens) => {
      screens[id] = { ...screens[id], left, top };
      return { ...screens };
    });
  };

  return (
    <Container ref={drop}>
      {Object.keys(screens).map((key) => (
        <DraggableScreen key={key} id={key} data={screens[key]} />
      ))}
      <DragLayer />
    </Container>
  );
};

export default Canvas;
