import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Workspace from '../components/Editor/Workspace/Workspace';
import { RightPanel } from '../features/applyProperties/views/containers';
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

type Props = {
  screenId?: number;
};

const Screen: React.FC<Props> = ({ screenId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const screens = useSelector(selectScreens);
  const id = screenId || screens[0]?.id;

  useEffect(() => {
    if (id) {
      dispatch(activateScreen(id));
    }
  }, [id, dispatch]);

  return (
    <div className={classes.root}>
      <DndProvider backend={HTML5Backend}>
        <Workspace />

        <RightPanel />
      </DndProvider>
    </div>
  );
};

export default Screen;
