import List from '@material-ui/core/List';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScreenListItem from './ScreenListItem';
import {
  createScreen,
  changeScreensOrder,
} from '../../../redux/project/actions';
import {
  selectCurrentProjectId,
  selectCurrentScreenId,
  selectScreenCreateLoader,
  selectScreens,
} from '../../../redux/project/selectors';
import { Scrollbar } from '../../UI';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '../StyledAccordion';

const useStyles = makeStyles({
  button: {
    color: '#eee',
    '&:hover': {
      backgroundColor: lighten('#2f4050', 0.1),
    },
  },
  list: {
    width: '100%',
    padding: 0,
    overflowX: 'hidden',
  },
});

const Screens = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const screens = useSelector(selectScreens);
  const screenCreateLoader = useSelector(selectScreenCreateLoader);

  const handleAddScreen = (ev) => {
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

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <span>Screens</span>

        <IconButton
          title="Create Screen"
          size="small"
          onClick={handleAddScreen}
          className={classes.button}
          disabled={screenCreateLoader}
        >
          {!screenCreateLoader ? (
            <AddIcon />
          ) : (
            <CircularProgress size={24} color="secondary" />
          )}
        </IconButton>
      </AccordionSummary>

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <AccordionDetails>
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
            </AccordionDetails>
          )}
        </Droppable>
      </DragDropContext>
    </Accordion>
  );
};

export default Screens;
