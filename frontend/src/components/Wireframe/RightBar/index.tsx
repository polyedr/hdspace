import { useCallback, useMemo, useState } from 'react';
import { styled, Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import {
  selectCurrentWireframeElement,
  selectCurrentWireframeScreen,
  selectElementLinks,
} from '@Redux/wireframe/selectors';
import Scrollbar from '@Components/UI/Scrollbar';
import { updateElementParameters } from '@Redux/project/actions';
import { Params } from '@Src/types';
import Connect from './Connect';

const RightpanelBox = styled(Box)({
  backgroundColor: 'white',
  height: '100%',
  borderLeft: '1px solid #E4E6EB',
});

const RightSidebar = ({ screens }) => {
  const dispatch = useDispatch();

  const [showAddNew, setShowAddNew] = useState(false);

  const selectedElementId = useSelector(selectCurrentWireframeElement);
  const selectedScreenId = useSelector(selectCurrentWireframeScreen);
  const links = useSelector(selectElementLinks);

  const updateParams = useCallback(
    (params: Params<any>) => {
      dispatch(
        updateElementParameters(selectedElementId, params, {
          screenId: Number(selectedScreenId),
        }),
      );
      setShowAddNew(false);
    },

    [selectedElementId, selectedScreenId],
  );

  const handleAddConnection = useCallback(() => {
    setShowAddNew(true);
  }, []);

  const linksByActiveSceen = useMemo(() => {
    return links.filter(
      (link) => Number(link.screenId) === Number(selectedScreenId),
    );
  }, [links, selectedScreenId]);

  if (!selectedScreenId) {
    return null;
  }

  return (
    <RightpanelBox>
      <Scrollbar>
        {linksByActiveSceen.map((link) => (
          <Connect
            key={link.elementId}
            link={link}
            updateParams={updateParams}
            screens={screens}
            activeScreen={selectedScreenId}
          />
        ))}

        {showAddNew ? (
          <Connect
            link={{
              elementId: selectedElementId,
              isExternalLink: false,
              link: undefined,
              projectId: undefined,
              screenId: undefined,
            }}
            updateParams={updateParams}
            screens={screens}
            onSaved={() => setShowAddNew(false)}
            activeScreen={selectedScreenId}
          />
        ) : (
          <Box display={'flex'} justifyContent={'center'} marginTop={2}>
            <IconButton onClick={handleAddConnection}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </Scrollbar>
    </RightpanelBox>
  );
};

export default RightSidebar;
