import React, { useCallback } from 'react';
import { styled, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentWireframeElement,
  selectCurrentWireframeScreen,
  selectCurrentWireframeScreenConnections,
} from '@Redux/wireframe/selectors';
import Connect from './Connect';
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
        <Button variant="text" onClick={handleAddConnection}>
          Add Connection
        </Button>
        {currentScreenConnections.map((connection) => (
          <Connect
            key={connection.id}
            connection={connection}
            screens={screens}
            activeElement={selectedElementId}
            activeScreen={selectedScreenId}
          />
        ))}
      </Scrollbar>
    </RightpanelBox>
  );
};

export default RightSidebar;
