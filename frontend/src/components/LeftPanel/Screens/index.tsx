import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VisibilityOutlined, Add } from '@mui/icons-material';
import {
  Typography,
  List,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import {
  createScreen,
  changeScreensOrder,
  changeScreenFolderOrder,
} from '@Redux/project/actions';
import {
  selectCurrentProjectId,
  selectScreenCreateLoader,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectSortedFolders,
  selectUncategoriesScreens,
} from '@Redux/project/selectors/screen';
import prevent from '@Utils/preventEvent';
import ScreenListItem from './ScreenListItem';
import ScreenFolder from './ScreenFolder';
import FolderListItem from './FolderListItem';

const TitleContainer = styled(Box)({
  padding: '5px 6px 5px 16px',
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

const StyledCustomList = styled(List)({
  width: '100%',
  padding: '0',
  overflowX: 'hidden',
  minHeight: 1,
});

function Screens() {
  const dispatch = useDispatch();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const uncategoriesScreens = useSelector(selectUncategoriesScreens);
  const folders = useSelector(selectSortedFolders);
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
        buoyancy: 1, // + 1 because masterScreen should always have buoyancy 0
        freeCanvas: isFreeCanvas,
      }),
    );
  };

  const handleReorder = ({ destination, source, draggableId }: DropResult) => {
    if (
      !destination ||
      (source.index === destination.index &&
        source.droppableId === destination.droppableId)
    )
      return;

    if (source.droppableId === 'droppable-screen-folder') {
      // return when no change in order
      if (source.index === destination.index) {
        return;
      }

      dispatch(
        changeScreenFolderOrder({
          newIndex: destination.index,
          oldIndex: source.index,
        }),
      );

      return;
    }

    dispatch(
      changeScreensOrder({
        newIndex: destination.index,
        oldIndex: source.index,
        screenId: Number(draggableId),
        source: source.droppableId,
        destination: destination.droppableId,
      }),
    );
  };

  return (
    <>
      <TitleContainer>
        <Title>Screens</Title>
        <Box>
          <StyledIconButton size="small">
            <VisibilityOutlined />
          </StyledIconButton>
          <StyledIconButton
            title="Create Screen"
            size="small"
            onClick={handleMenuOpen}
            disabled={screenCreateLoader}
          >
            {!screenCreateLoader ? (
              <Add />
            ) : (
              <CircularProgress size={24} color="secondary" />
            )}
          </StyledIconButton>
          <StyledIconButton size="small">
            <ScreenFolder />
          </StyledIconButton>
        </Box>
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
        <Droppable
          droppableId="droppable-screen-folder"
          type="droppable-screen-folder"
        >
          {(mainProvided) => (
            <div ref={mainProvided.innerRef} {...mainProvided.droppableProps}>
              <Droppable droppableId={'-1'} type="droppable-screen">
                {(provided) => (
                  <StyledCustomList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {uncategoriesScreens
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
                )}
              </Droppable>

              {folders.map((folder, folderIndex) => (
                <FolderListItem
                  folder={folder}
                  key={folder.id}
                  index={folderIndex}
                >
                  <Droppable
                    droppableId={folder.id.toString()}
                    type="droppable-screen"
                  >
                    {(provided) => (
                      <StyledCustomList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {folder.ctscreens
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
                    )}
                  </Droppable>
                </FolderListItem>
              ))}
              {mainProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default Screens;
