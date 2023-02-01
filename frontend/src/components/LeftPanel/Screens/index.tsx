import React, { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import {
  Typography,
  List,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { createScreen, changeScreensOrder } from '@Redux/project/actions';
import {
  selectCurrentProjectId,
  selectScreenCreateLoader,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectSortedScreens,
} from '@Redux/project/selectors/screen';
import prevent from '@Utils/preventEvent';
import { Indices } from '@Src/types';
import Scrollbar from '../../UI/Scrollbar';
import ScreenListItem from './ScreenListItem';

const TitleContainer = styled(Box)({
  paddingLeft: 16,
  paddingRight: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffffff',
});

const Title = styled(Typography)({
  fontStyle: 'normal',
  fontWeight: '600 !important',
  fontSize: '10px !important',
  textTransform: 'uppercase',
  lineHeight: '145%',
});

const StyledIconButton = styled(IconButton)({
  width: '32px',
  height: '32px',
  color: '#81818e',

  '& svg': {
    height: 20,
  },
});

const StyledCustomList = styled(List)`
  width: 100%;
  min-height: 259px;
  padding: 0;
  overflow-x: hidden;
`;

function Screens() {
  const dispatch = useDispatch();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const screens = useSelector(selectSortedScreens);
  const screenCreateLoader = useSelector(selectScreenCreateLoader);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    prevent(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateScreen = (isFreeCanvas: boolean = false) => {
    dispatch(
      createScreen({
        projectID: currentProjectId,
        name: 'Screen-1',
        buoyancy: screens.length + 1, // + 1 because masterScreen should always have buoyancy 0
        freeCanvas: isFreeCanvas,
      }),
    );
  };

  const handleReorder = ({ destination, source }: DropResult) => {
    if (!destination) return;
    const indices: Indices = {
      newIndex: destination.index,
      oldIndex: source.index,
    };
    dispatch(changeScreensOrder(indices));
  };

  return (
    <>
      <TitleContainer>
        <Title>Screens</Title>
        <StyledIconButton
          title="Create Screen"
          size="small"
          onClick={handleMenuOpen}
          disabled={screenCreateLoader}
        >
          {!screenCreateLoader ? (
            <AddIcon />
          ) : (
            <CircularProgress size={24} color="secondary" />
          )}
        </StyledIconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(ev) => {
              prevent(ev);
              handleCreateScreen(false);
              handleClose();
            }}
          >
            Common mode
          </MenuItem>
          <MenuItem
            onClick={(ev) => {
              prevent(ev);
              handleCreateScreen(true);
              handleClose();
            }}
          >
            Free canvas mode
          </MenuItem>
        </Menu>
      </TitleContainer>
      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Scrollbar
              autoHeightMin="calc(100vh - 90px)"
              autoHeightMax="calc(100vh - 90px)"
              style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}
            >
              <StyledCustomList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {screens
                  .filter((screen) => screen.id !== -1)
                  .map((screen, i) => (
                    <ScreenListItem
                      key={screen.id}
                      screen={screen}
                      index={i}
                      active={screen.id === currentScreenId}
                    />
                  ))}
                {provided.placeholder}
              </StyledCustomList>
            </Scrollbar>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default Screens;
