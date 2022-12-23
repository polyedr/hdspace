import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import {
  List,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  IconButtonProps,
  ListProps,
} from '@material-ui/core';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { createScreen, changeScreensOrder } from '@Redux/project/actions';
import Box from '@mui/material/Box';
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
import ScreenListItem from './ScreenListItem';
import Scrollbar from '../../UI/Scrollbar';

const TitleContainer = styled(Box)`
  padding-left: 16px;
  padding-right: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
`;

const Title = styled(Typography)`
  font-family: Roboto;
  font-style: normal;
  font-weight: 600 !important;
  font-size: 10px !important;
  text-transform: uppercase;
  line-height: 145%;
`;

const CustomIconButton = styled(IconButton)({
  width: '32px',
  height: '32px',
  color: '#81818e',

  '& svg': {
    height: 20,
  },
});

const CustomList = styled(List)`
  width: 100%;
  min-height: 259px;
  padding: 0;
  overflow-x: hidden;
`;

const StyledIconButton: React.FC<IconButtonProps> = (props) => {
  return <CustomIconButton {...props} />;
};

const StyledCustomList: React.FC<ListProps> = (props) => {
  return <CustomList {...props} />;
};
const Screens = () => {
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
                innerRef={provided.innerRef}
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
};

export default Screens;
