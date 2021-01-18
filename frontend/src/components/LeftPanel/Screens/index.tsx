import List from '@material-ui/core/List';
import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createScreen, changeScreensOrder } from '@Redux/project/actions';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
  selectCurrentProjectId,
  selectScreenCreateLoader,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreenId,
  selectScreens,
} from '@Redux/project/selectors/screen';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HtmlImportForm from '@Components/HTMLImportForm';
import ScreenListItem from './ScreenListItem';
import Scrollbar from '../../UI/Scrollbar';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const useStyles = makeStyles(({ palette, typography }) => ({
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
}));

const Screens = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const screens = useSelector(selectScreens);
  const screenCreateLoader = useSelector(selectScreenCreateLoader);

  const handleCreateScreen = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(createScreen(currentProjectId, 'Screen 1', screens.length));
  };

  const handleReorder = ({ destination, source }) => {
    const newScreens = [...screens];
    const [target] = newScreens.splice(source.index, 1);
    newScreens.splice(destination.index, 0, target);
    const result = newScreens.map((screen, i) => ({ ...screen, buoyancy: i }));
    dispatch(changeScreensOrder(result));
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleOpenMenu = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setAnchorEl(ev.currentTarget);
  };

  const handleCloseMenu = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <StyledAccordion defaultExpanded>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <span>Screens</span>

          <div>
            <IconButton
              title="Create Screen"
              size="small"
              onClick={handleCreateScreen}
              className={classes.button}
              disabled={screenCreateLoader}
            >
              {!screenCreateLoader ? (
                <AddIcon />
              ) : (
                <CircularProgress size={24} color="secondary" />
              )}
            </IconButton>

            <IconButton
              title="more"
              size="small"
              className={classes.button}
              onClick={handleOpenMenu}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                dense
                onClick={(ev) => {
                  setOpen(true);
                  handleCloseMenu(ev);
                }}
              >
                Create screen from external html file
              </MenuItem>
            </Menu>
          </div>
        </StyledAccordionSummary>

        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <StyledAccordionDetails>
                <Scrollbar autoHeightMax={200}>
                  <List
                    className={classes.list}
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {screens.map((screen, i) => (
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
              </StyledAccordionDetails>
            )}
          </Droppable>
        </DragDropContext>
      </StyledAccordion>

      <HtmlImportForm open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Screens;
