import React, { useEffect, useMemo, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Xwrapper, useXarrow } from 'react-xarrows';
import GridLines from 'react-gridlines';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material';
import {
  setCurrentScreenId,
  updateCurrentUIFramework,
} from '@/redux/project/actions';
import { FRAMEWORKS_LIST } from '@/constants/frameworks';
import { GRID_CELL_SPACE, GRID_STROKE_WIDTH } from '@/constants/grid';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';
import DraggableScreen from './DraggableScreen';
import { buildScreenData, calculateCanvasSize } from './helpers';
import Arrows from './Arrows';
import type { Normalized, Screen as ProjectScren } from '@/types';

const CanvasBox = styled('div')({
  '&:active': {
    cursor: 'grabbing',
  },
});

const Canvas: React.FC<{
  screens: Normalized<ProjectScren>;
}> = ({ screens: _screens }) => {
  const [zoom, setZoom] = useState(0.4);

  const updateXArrow = useXarrow();

  const dispatch = useDispatch();

  const screens = useMemo(() => {
    return Object.values(buildScreenData(_screens));
  }, [_screens]);

  useEffect(() => {
    dispatch(setCurrentScreenId(screens[Object.keys(screens)[0]].id));

    dispatch(
      updateCurrentUIFramework({
        name: 'material',
        themeVariables: {},
        version: FRAMEWORKS_LIST[2].versions[0],
      }),
    );
  }, []);

  const screensCount = screens.length;

  return (
    <Xwrapper>
      <TransformWrapper
        ref={(ref) => {
          window.wireframeCanvas = ref;
        }}
        limitToBounds={true}
        centerOnInit={true}
        minScale={0.01}
        initialScale={zoom}
        onTransformed={updateXArrow}
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
            <CanvasBox
              style={{
                minWidth: calculateCanvasSize(screensCount, SCREEN_WIDTH),
                minHeight: calculateCanvasSize(screensCount, SCREEN_HEIGHT),
              }}
            >
              {screens.map((screen) => (
                <DraggableScreen
                  key={screen.id.toString()}
                  zoom={zoom}
                  data={screen}
                  onDrag={updateXArrow}
                  onStop={updateXArrow}
                />
              ))}
            </CanvasBox>
          </GridLines>
        </TransformComponent>
      </TransformWrapper>
      <Arrows />
    </Xwrapper>
  );
};

export default Canvas;
