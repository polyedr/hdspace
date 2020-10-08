import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Workspace from '../components/Editor/Workspace/Workspace';
import { RightPanel } from '../features/applyProperties/views/containers';
import { selectIsPrototypeMode } from '../redux/user/selectors';
import { activateScreen } from '../redux/project/actions';
import { selectScreens } from '../redux/project/selectors';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
    flex: 1,
  },
});

const Screen: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isPrototypeMode = useSelector(selectIsPrototypeMode);

  const screens = useSelector(selectScreens);
  const screenId = screens[0]?.id;

  useEffect(() => {
    if (screenId) {
      dispatch(activateScreen(screenId));
    }
  }, [screenId, dispatch]);

  return (
    <div className={classes.root}>
      <DndProvider backend={HTML5Backend}>
        <Workspace />

        {!isPrototypeMode && <RightPanel />}
      </DndProvider>
    </div>
  );
};

export default Screen;
