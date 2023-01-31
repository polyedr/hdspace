import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Xarrow, { Xwrapper, useXarrow } from 'react-xarrows';
import DraggableScreen from './DraggableScreen';
import type { Normalized, Project, Screen as ProjectScren } from '@/types';
import GridLines from 'react-gridlines';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentScreenId,
  updateCurrentUIFramework,
} from '@/redux/project/actions';
import { FRAMEWORKS_LIST } from '@/constants/frameworks';
import { GRID_CELL_SPACE, GRID_STROKE_WIDTH } from '@/constants/grid';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';
import { selectCompleteConnections } from '@/redux/wireframe/selectors';
import { initConnections } from '@Redux/wireframe/wireframe';

export type WireframeScreen = ProjectScren & {
  position: { x: number; y: number };
};
type Screens = Normalized<WireframeScreen>;

function calculateCanvasSize(count: number, size: number) {
  return size * count * 10;
}

function buildScreenData(_screens: Normalized<ProjectScren>): Screens {
  const screens = {};

  const validScreens = Object.values(_screens).filter(
    (s) => !s.name.includes('Master'),
  );

  const canvasWidth = calculateCanvasSize(
    Object.values(validScreens).length,
    SCREEN_WIDTH,
  );
  const canvasHeight = calculateCanvasSize(
    Object.keys(validScreens).length,
    SCREEN_HEIGHT,
  );

  let index = 0;

  Object.entries(_screens).forEach(([key, screen]) => {
    if (screen.name.includes('Master')) {
      return;
    }

    screens[key] = {
      ...screen,
      position: {
        x:
          Math.round(
            (screen.screenData?.wireframePosition?.x ??
              canvasWidth / 2 - (SCREEN_WIDTH + 100) * index) / GRID_CELL_SPACE,
          ) *
            GRID_CELL_SPACE +
          GRID_STROKE_WIDTH / 2,
        y:
          Math.round(
            (screen.screenData?.wireframePosition?.y ??
              canvasHeight / 2 - SCREEN_HEIGHT / 2) * GRID_CELL_SPACE,
          ) /
            GRID_CELL_SPACE +
          GRID_STROKE_WIDTH / 2,
      },
    };

    index++;
  });

  return screens;
}

const Canvas: React.FC<{
  screens: Normalized<ProjectScren>;
  project: Project;
}> = ({ screens: _screens, project: currentProject }) => {
  const [zoom, setZoom] = useState(0.4);

  const [screens] = useState<Screens>(buildScreenData(_screens));

  const connections = useSelector(selectCompleteConnections);

  const [isMoveable, setIsMoveable] = useState(false);

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

  useEffect(() => {
    if (currentProject.projectData?.wireframeConnections) {
      dispatch(
        initConnections(currentProject.projectData.wireframeConnections),
      );
    }
  }, []);

  const screensCount = Object.keys(screens).length;

  return (
    <Xwrapper>
      <TransformWrapper
        disabled={isMoveable}
        limitToBounds={true}
        centerOnInit={true}
        minScale={0.01}
        initialScale={zoom}
        onPanning={updateXArrow}
        onPanningStop={updateXArrow}
        onWheel={updateXArrow}
        panning={{
          excluded: ['wireframe-screen-frame', 'screen-control'],
        }}
        pinch={{
          excluded: ['wireframe-screen-frame', 'screen-control'],
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
            cursor: 'grab',
          }}
        >
          <GridLines
            cellWidth={120}
            strokeWidth={GRID_STROKE_WIDTH}
            cellWidth2={GRID_CELL_SPACE}
          >
            <div
              style={{
                minWidth: calculateCanvasSize(screensCount, SCREEN_WIDTH),
                minHeight: calculateCanvasSize(screensCount, SCREEN_HEIGHT),
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
          key={c.id}
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
