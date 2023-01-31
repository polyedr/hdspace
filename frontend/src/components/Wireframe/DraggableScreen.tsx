import React, { useCallback } from 'react';
import Draggable, {
  DraggableData,
  DraggableEventHandler,
} from 'react-draggable';
import Screen from './Screen';
import { type WireframeScreen } from './Canvas';
import { Box, SxProps } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentWireframeScreen } from '@Redux/wireframe/selectors';
import { GRID_CELL_SPACE } from '@/constants/grid';
import { editScreenNameAndData } from '@Redux/project/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';

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
  const currentProjectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();

  const handleDropStop = useCallback(
    (e: MouseEvent, dragData: DraggableData) => {
      const { x, y } = dragData;

      dispatch(
        editScreenNameAndData(currentProjectId, data.id, {
          data: {
            wireframePosition: { x, y },
          },
        }),
      );

      onStop(e, dragData);
    },
    [onStop, dispatch, currentProjectId, data, editScreenNameAndData],
  );

  return (
    <Draggable
      defaultPosition={{ x, y }}
      onDrag={onDrag}
      onStop={handleDropStop}
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
