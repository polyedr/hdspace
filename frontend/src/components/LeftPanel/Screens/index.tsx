import React, { useCallback, MouseEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import {
  Button,
  List,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  createScreen,
  changeScreensOrder,
  setNewScreenModal,
} from '@Redux/project/actions';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  selectCurrentProjectId,
  selectScreenCreateLoader,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
  selectMasterScreenId,
  selectScreensWithoutMaster,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import prevent from '@Utils/preventEvent';
import ELEMENT_IDS from '@Constants/elementIds';
import { Indices } from '@Src/types';
import ScreenListItem from './ScreenListItem';
import Scrollbar from '../../UI/Scrollbar';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const useStyles = makeStyles(({ palette, typography, spacing }) => ({
  name: {
    fontSize: typography.fontSize,
  },
  button: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
  list: {
    width: '100%',
    padding: 0,
    overflowX: 'hidden',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    padding: spacing(3),
  },
}));

const Screens = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const screens = useSelector(selectScreensWithoutMaster);
  const screenCreateLoader = useSelector(selectScreenCreateLoader);
  const masterScreenId = useSelector(selectMasterScreenId);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const freeCanvas = useSelector(selectFreeCanvasMode);

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

  const handleReorder = ({ destination, source }) => {
    if (!destination) return;
    const indices: Indices = {
      newIndex: destination.index,
      oldIndex: source.index,
    };
    dispatch(changeScreensOrder(indices));
  };

  const handleShowMoreOptions = (ev: MouseEvent<HTMLButtonElement>) => {
    prevent(ev);
    dispatch(setNewScreenModal(true));
  };

  const handleClick = useCallback(() => {
    if (!masterScreenEnabled) {
      history.push(`/project/${currentProjectId}/${masterScreenId}`);
    } else {
      history.goBack();
    }
  }, [currentProjectId, history, masterScreenId, masterScreenEnabled]);

  return (
    <>
      <StyledAccordion defaultExpanded id={ELEMENT_IDS.screenList}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <span>Screens</span>

          <div>
            <>
              <IconButton
                title="Create Screen"
                size="small"
                onClick={handleMenuOpen}
                className={classes.button}
                disabled={screenCreateLoader}
              >
                {!screenCreateLoader ? (
                  <AddIcon />
                ) : (
                  <CircularProgress size={24} color="secondary" />
                )}
              </IconButton>

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
            </>
            <IconButton
              title="More options"
              size="small"
              className={classes.button}
              onClick={handleShowMoreOptions}
              disabled={freeCanvas}
            >
              <MoreHorizIcon />
            </IconButton>
          </div>
        </StyledAccordionSummary>

        <StyledAccordionDetails className={classes.details}>
          <Button
            color="secondary"
            variant={masterScreenEnabled ? 'contained' : 'outlined'}
            onClick={handleClick}
            id={ELEMENT_IDS.masterScreenListItem}
          >
            Master Screen
          </Button>

          <DragDropContext onDragEnd={handleReorder}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <Scrollbar autoHeightMax={200}>
                  <List
                    className={classes.list}
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
                  </List>
                </Scrollbar>
              )}
            </Droppable>
          </DragDropContext>
        </StyledAccordionDetails>
      </StyledAccordion>
    </>
  );
};

export default Screens;
