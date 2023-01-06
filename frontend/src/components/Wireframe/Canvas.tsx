import { styled } from '@mui/material';
import React, { useRef, useState } from 'react';
import DraggableScreen from './DraggableScreen';
import { useDrop } from 'react-dnd';
import DragLayer from './DragLayer';
import type { Normalized, Screen as ProjectScren } from '@Src/types';
import Scrollbar from '@Components/UI/Scrollbar';
import Scrollbars from 'react-custom-scrollbars';

const Wrapper = styled('div')({
  height: '100%',
  width: '100%',
});

const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '150%',
  width: '150%',
  position: 'relative',
  cursor: 'grab',
}));

export type WireframeScreen = ProjectScren & { left: number; top: number };
type Screens = Normalized<WireframeScreen>;

function buildScreenData(_screens: Normalized<ProjectScren>): Screens {
  const screens = {};

  Object.entries(_screens).forEach(([key, screen]) => {
    screens[key] = { ...screen, left: 10, top: 0 };
  });

  return screens;
}

const Canvas: React.FC<{ screens: Normalized<ProjectScren> }> = ({
  screens: _screens,
}) => {
  const [screens, setScreens] = useState<Screens>(buildScreenData(_screens));
  // const enabledPincAndMove = useRef(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: 'wireframe-screen',
    drop: (item: WireframeScreen & { id: string }, monitor) => {
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

  // const handleMouseMove = useCallback(
  //   (e: React.MouseEvent<HTMLDivElement>) => {
  //     if (!enabledPincAndMove.current) return null;

  //     const { x, y } = wrapperRef.current.getBoundingClientRect();

  //     scrollbarRef.current.scrollTop(e.pageY - y);
  //     scrollbarRef.current.scrollLeft(e.pageX - x);
  //   },
  //   [enabledPincAndMove],
  // );

  // const enablePinchAndMove = useCallback(
  //   (enable: boolean) => {
  //     return () => (enabledPincAndMove.current = enable);
  //   },
  //   [enabledPincAndMove],
  // );

  return (
    <Wrapper ref={wrapperRef}>
      <Scrollbar ref={scrollbarRef}>
        <Container
          // onMouseDown={enablePinchAndMove(true)}
          // onMouseUp={enablePinchAndMove(false)}
          // onMouseMove={handleMouseMove}
          ref={drop}
        >
          {Object.keys(screens).map((key) => (
            <DraggableScreen key={key} id={key} data={screens[key]} />
          ))}
          <DragLayer />
        </Container>
      </Scrollbar>
    </Wrapper>
  );
};

export default Canvas;
