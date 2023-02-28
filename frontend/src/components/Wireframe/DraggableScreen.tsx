import React, { useCallback, useMemo } from 'react';
import Draggable, {
  DraggableData,
  DraggableEventHandler,
} from 'react-draggable';
import { Box, SxProps } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentWireframeScreen } from '@Redux/wireframe/selectors';
import { GRID_CELL_SPACE } from '@/constants/grid';
import { editScreenNameAndData } from '@Redux/project/actions';
import { setActiveScreen } from '@Redux/wireframe/wireframe';
import { updateScreenPosition } from '@Redux/wireframe/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import Screen from './Screen';
import { WireframeScreen } from './helpers';

interface Props {
  data: WireframeScreen;
  zoom: number;
  onDrag?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
  setRef: (key: string) => void | React.RefObject<unknown>;
}

const styles: SxProps = {
  position: 'absolute',
  zIndex: 1,
};

const DraggableScreen: React.FC<Props> = ({
  data,
  zoom,
  onDrag,
  onStop,
  setRef,
}) => {
  const { y, x } = data.position;

  const currentScreen = useSelector(selectCurrentWireframeScreen);
  const projectId = useSelector(selectCurrentProjectId);

  const dispatch = useDispatch();

  const handleDropStop = useCallback(
    (e: MouseEvent, dragData: DraggableData) => {
      const { x, y } = dragData;
      dispatch(updateScreenPosition(data.id, { x, y }, projectId));
      onStop(e, dragData);
    },
    [onStop, dispatch, data, projectId, editScreenNameAndData],
  );

  const handleSetActiveScreen = () => {
    dispatch(setActiveScreen(data.id.toString()));
  };

  const gridSnap = useMemo(() => {
    return zoom * GRID_CELL_SPACE;
  }, [zoom]);

  const position = useMemo(() => {
    return {
      x: Math.floor(x / GRID_CELL_SPACE) * GRID_CELL_SPACE + 0.5,
      y: Math.floor(y / GRID_CELL_SPACE) * GRID_CELL_SPACE + 0.5,
    };
  }, [x, y]);

  return (
    <Draggable
      onDrag={onDrag}
      onStop={handleDropStop}
      position={position}
      scale={zoom}
      handle={`.handle-${data.id}`}
      grid={[gridSnap, gridSnap]}
      bounds="parent"
      onMouseDown={handleSetActiveScreen}
    >
      <Box
        sx={styles}
        style={{
          zIndex: currentScreen === data.id.toString() ? 3 : 1,
        }}
        className="wireframe-screen-frame"
        id={`wireframe-screen-${data.id}`}
        ref={setRef(`screen-${data.id}`) as React.RefObject<unknown>}
      >
        <Screen
          setRef={setRef}
          data={data}
          active={currentScreen === data.id.toString()}
        />
      </Box>
    </Draggable>
  );
};

export default DraggableScreen;
