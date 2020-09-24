import List from '@material-ui/core/List';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { darken, lighten } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  selectCurrentProjectId,
  selectScreens,
} from '../../redux/project/selectors';
import { addScreen, changeScreensOrder } from '../../redux/project/actions';
import ScreenListItem from './ScreenListItem';

const useStyles = makeStyles({
  root: {
    color: '#fff',
    fontWeight: 'normal',
  },
  header: {
    padding: '.7em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderBottomColor: lighten('#2f4050', 0.1),
    backgroundColor: darken('#2f4050', 0.1),
    fontWeight: 600,
  },
  button: {
    color: '#eee',
    '&:hover': {
      backgroundColor: lighten('#2f4050', 0.1),
    },
  },
  list: {
    padding: 0,
  },
});

const Screens = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const screens = useSelector(selectScreens);

  const handleAddScreen = () => {
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
    <div className={classes.root}>
      <div className={classes.header}>
        <span>Screens</span>

        <IconButton
          title="Add Screen"
          size="small"
          onClick={handleAddScreen}
          className={classes.button}
        >
          <AddIcon />
        </IconButton>
      </div>

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="droppable">
          {(provided) => (
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
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Screens;
