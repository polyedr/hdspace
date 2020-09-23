import List from '@material-ui/core/List';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentProjectId,
  selectScreens,
} from '../../redux/project/selectors';
import { addScreen } from '../../redux/project/actions';
import ScreenListItem from './ScreenListItem';

const useStyles = makeStyles({
  root: {
    color: '#fff',
    fontWeight: 'normal',
  },
  header: {
    padding: '.8em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #8f8f8f',
  },
  button: {
    color: '#000',
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

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <span>Screens</span>
        <button
          onClick={handleAddScreen}
          type="button"
          className={classes.button}
        >
          +
        </button>
      </div>

      <List className={classes.list}>
        {screens.map((screen) => (
          <ScreenListItem key={screen.id} screen={screen} />
        ))}
      </List>
    </div>
  );
};

export default Screens;
