import List from '@material-ui/core/List';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { darken, lighten } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import withStyles from '@material-ui/core/styles/withStyles';
import ScreenListItem from './ScreenListItem';
import { addScreen, changeScreensOrder } from '../../redux/project/actions';
import {
  selectCurrentProjectId,
  selectScreens,
} from '../../redux/project/selectors';

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
  },
});

const Accordion = withStyles({
  root: {
    color: '#fff',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    padding: 0,
    minHeight: 0,
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    margin: 0,
    padding: '.7em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderBottomColor: lighten('#2f4050', 0.1),
    backgroundColor: darken('#2f4050', 0.1),
    fontWeight: 600,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {
    minHeight: 0,
  },
})(MuiAccordionSummary);

const AccordionDetails = withStyles({
  root: {
    padding: 0,
  },
})(MuiAccordionDetails);

const Screens = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const screens = useSelector(selectScreens);

  const handleAddScreen = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dispatch(addScreen(currentProjectId, 'Screen 1', screens.length));
  };

  const handleReorder = ({ destination, source }) => {
    const newScreens = [...screens];
    const [target] = newScreens.splice(source.index, 1);
    newScreens.splice(destination.index, 0, target);
    const result = newScreens.map((screen, i) => ({ ...screen, buoyancy: i }));
    dispatch(changeScreensOrder(result));
  };

  return (
    <Accordion>
      <AccordionSummary>
        <span>Screens</span>

        <IconButton
          title="Add Screen"
          size="small"
          onClick={handleAddScreen}
          className={classes.button}
        >
          <AddIcon />
        </IconButton>
      </AccordionSummary>

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <AccordionDetails>
              <List
                className={classes.list}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {screens.map((screen, i) => (
                  <ScreenListItem key={screen.id} screen={screen} index={i} />
                ))}
                {provided.placeholder}
              </List>
            </AccordionDetails>
          )}
        </Droppable>
      </DragDropContext>
    </Accordion>
  );
};

export default Screens;
