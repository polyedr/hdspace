import React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import Screen from './Screen';
import { type WireframeScreen } from './Canvas';
import { Box, SxProps } from '@mui/material';

interface Props {
  data: WireframeScreen;
  zoom: number;
  onDrag?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
}

const styles: SxProps = {
  position: 'fixed',
};

const DraggableScreen: React.FC<Props> = ({ data, zoom, onDrag, onStop }) => {
  const { y, x } = data.position;

  return (
    <Draggable
      defaultPosition={{ x, y }}
      onDrag={onDrag}
      onStop={onStop}
      scale={zoom}
      handle={`.handle-${data.id}`}
      // grid={[8 * zoom, 8 * zoom]}
      bounds="parent"
    >
      <Box sx={styles}>
        <Screen data={data} />
      </Box>
    </Draggable>
  );
};

export default DraggableScreen;
