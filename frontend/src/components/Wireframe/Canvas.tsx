import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import DraggableScreen from './DraggableScreen';
import type { Normalized, Screen as ProjectScren } from '@Src/types';

import gridIcon from './grid.svg';

export type WireframeScreen = ProjectScren & {
  position: { x: number; y: number };
};
type Screens = Normalized<WireframeScreen>;

function buildScreenData(_screens: Normalized<ProjectScren>): Screens {
  const screens = {};

  Object.entries(_screens).forEach(([key, screen]) => {
    screens[key] = { ...screen, position: { x: 10, y: 50 } };
  });

  return screens;
}

const Canvas: React.FC<{ screens: Normalized<ProjectScren> }> = ({
  screens: _screens,
}) => {
  const [screens] = useState<Screens>(buildScreenData(_screens));
  const [isMoveable, setIsMoveable] = useState(false);
  const [zoom, setZoom] = useState(1);

  const onDrag = () => {
    setIsMoveable(true);
    // etc
  };

  const onStop = () => {
    setIsMoveable(false);
    // etc
  };

  const screensCount = Object.keys(screens).length;

  return (
    <TransformWrapper
      disabled={isMoveable}
      limitToBounds={true}
      centerOnInit
      minScale={0.5}
      onZoom={(zoom) => {
        setZoom(zoom.state.scale);
      }}
      // wheel={{ activationKeys: ['Control', 'Shift'] }}
    >
      <TransformComponent
        contentClass="main"
        contentStyle={{
          minWidth: (400 + 40) * (screensCount + 20),
          minHeight: (600 + 40) * (screensCount + 20),
          display: 'flex',
          flexDirection: 'row',
          backgroundImage: `url(${gridIcon})`,
        }}
        wrapperStyle={{ height: 'calc(100vh - 60px)', width: '100%' }}
      >
        {Object.keys(screens).map((key) => (
          <DraggableScreen
            key={key}
            zoom={zoom}
            data={screens[key]}
            onDrag={onDrag}
            onStop={onStop}
          />
        ))}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default Canvas;
