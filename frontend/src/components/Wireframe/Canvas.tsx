import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';
import DraggableScreen from './DraggableScreen';
import type { Normalized, Screen as ProjectScren } from '@Src/types';
import GridLines from 'react-gridlines';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentScreenId,
  updateCurrentUIFramework,
} from '@Redux/project/actions';
import { FRAMEWORKS_LIST } from '@Constants/frameworks';
import { GRID_CELL_SPACE, GRID_STROKE_WIDTH } from '@/constants/grid';
import { SCREEN_WIDTH } from './constants';
import { selectCompleteConnections } from '@Redux/wireframe/selectors';

export type WireframeScreen = ProjectScren & {
  position: { x: number; y: number };
};
type Screens = Normalized<WireframeScreen>;

function buildScreenData(_screens: Normalized<ProjectScren>): Screens {
  const screens = {};

  let index = 0;

  Object.entries(_screens).forEach(([key, screen]) => {
    if (screen.name.includes('Master')) {
      return;
    }

    screens[key] = {
      ...screen,
      position: {
        x: GRID_CELL_SPACE * 2 + (SCREEN_WIDTH + 100) * index,
        y: GRID_CELL_SPACE * 4,
      },
    };

    index++;
  });

  return screens;
}

const Canvas: React.FC<{ screens: Normalized<ProjectScren> }> = ({
  screens: _screens,
}) => {
  const [screens] = useState<Screens>(buildScreenData(_screens));
  const connections = useSelector(selectCompleteConnections);

  const [isMoveable, setIsMoveable] = useState(false);
  const [zoom, setZoom] = useState(0.5);
  const updateXArrow = useXarrow();

  const dispatch = useDispatch();

  const onDrag = () => {
    setIsMoveable(true);
    updateXArrow();
    // etc
  };

  const onStop = () => {
    setIsMoveable(false);
    updateXArrow();
    // etc
  };

  useEffect(() => {
    dispatch(setCurrentScreenId(screens[Object.keys(screens)[0]].id));

    dispatch(
      updateCurrentUIFramework({
        name: 'material',
        themeVariables: {},
        version: FRAMEWORKS_LIST[2].versions[0],
      }),
    );

    const timer = setInterval(updateXArrow, 10);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const screensCount = Object.keys(screens).length;

  return (
    <Xwrapper>
      <TransformWrapper
        disabled={isMoveable}
        limitToBounds={true}
        centerOnInit={false}
        minScale={0.2}
        initialScale={zoom}
        onPanning={updateXArrow}
        onPanningStop={updateXArrow}
        onWheel={updateXArrow}
        panning={{
          excluded: ['wireframe-screen-frame'],
        }}
        pinch={{
          excluded: ['wireframe-screen-frame'],
        }}
        wheel={{
          excluded: ['wireframe-screen-frame'],
        }}
        onZoom={(zoom) => {
          setZoom(zoom.state.scale);
        }}
        // wheel={{ activationKeys: ['Control', 'Shift'] }}
      >
        <TransformComponent
          wrapperStyle={{
            height: 'calc(100vh - 60px)',
            width: '100%',
            backgroundColor: '#E5E3E8',
          }}
        >
          <GridLines
            cellWidth={120}
            strokeWidth={GRID_STROKE_WIDTH}
            cellWidth2={GRID_CELL_SPACE}
          >
            <div
              style={{
                minWidth: (600 + 40) * (screensCount + 20),
                minHeight: (1000 + 40) * (screensCount + 20),
              }}
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
            </div>
          </GridLines>
        </TransformComponent>
      </TransformWrapper>
      {connections.map((c) => (
        <Xarrow
          key={c.sourceElement}
          color="#000"
          strokeWidth={1.5}
          start={c.sourceElement.toString()}
          path="grid"
          tailShape="circle"
          tailSize={20}
          zIndex={0}
          end={`wireframe-screen-${c.destinationScreen}`}
        />
      ))}
    </Xwrapper>
  );
};

export default Canvas;
