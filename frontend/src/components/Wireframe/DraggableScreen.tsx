import React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import Screen from './Screen';
import { type WireframeScreen } from './Canvas';
import { Box, SxProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentWireframeScreen } from '@Redux/wireframe/selectors';
import { GRID_CELL_SPACE } from '@/constants/grid';

interface Props {
  data: WireframeScreen;
  zoom: number;
  onDrag?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
}

const styles: SxProps = {
  position: 'absolute',
  zIndex: 1,
};

const DraggableScreen: React.FC<Props> = ({ data, zoom, onDrag, onStop }) => {
  const { y, x } = data.position;

  const currentScreen = useSelector(selectCurrentWireframeScreen);

  return (
    <Draggable
      defaultPosition={{ x: x * zoom, y: y * zoom }}
      onDrag={onDrag}
      onStop={onStop}
      scale={zoom}
      handle={`.handle-${data.id}`}
      grid={[GRID_CELL_SPACE * zoom, GRID_CELL_SPACE * zoom]}
      bounds="parent"
    >
      <Box
        sx={styles}
        className="wireframe-screen-frame"
        id={`wireframe-screen-${data.id}`}
      >
        <Screen data={data} active={currentScreen === data.id.toString()} />
      </Box>
    </Draggable>
  );
};

export default DraggableScreen;
