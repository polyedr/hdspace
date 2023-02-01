import React, { useCallback } from 'react';
import { styled, Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentWireframeElement,
  selectCurrentWireframeScreen,
  selectCurrentWireframeScreenConnections,
} from '@Redux/wireframe/selectors';
import Connect from './Connect';
import AddIcon from '@mui/icons-material/Add';
import { addConnection } from '@Redux/wireframe/wireframe';
import Scrollbar from '@Components/UI/Scrollbar';

const RightpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderLeft: '1px solid #E4E6EB',
});

const RightSidebar = ({ screens }) => {
  const dispatch = useDispatch();

  const selectedElementId = useSelector(selectCurrentWireframeElement);
  const selectedScreenId = useSelector(selectCurrentWireframeScreen);
  const currentScreenConnections = useSelector(
    selectCurrentWireframeScreenConnections,
  );

  const handleAddConnection = useCallback(() => {
    dispatch(
      addConnection({
        sourceElement: selectedElementId || '',
        screenId: selectedScreenId,
      }),
    );
  }, [selectedElementId, selectedScreenId]);

  if (!selectedScreenId) {
    return null;
  }

  return (
    <RightpanelBox>
      <Scrollbar>
        {currentScreenConnections.map((connection) => (
          <Connect
            key={connection.id}
            connection={connection}
            screens={screens}
            activeElement={selectedElementId}
            activeScreen={selectedScreenId}
          />
        ))}
        <Box display={'flex'} justifyContent={'center'} marginTop={2}>
          <IconButton onClick={handleAddConnection}>
            <AddIcon />
          </IconButton>
        </Box>
      </Scrollbar>
    </RightpanelBox>
  );
};

export default RightSidebar;
