import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Workspace from '../components/Editor/Workspace/Workspace';
import { activateScreen } from '../redux/project/actions';
import { selectScreens } from '../redux/project/selectors';
import RightPanel from '../components/RightPanel';

const useStyles = makeStyles({
  screen: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
    flex: 1,
    overflow: 'auto',
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
    <div className={classes.screen}>
      <DndProvider backend={HTML5Backend}>
        <Workspace />

        <RightPanel />
      </DndProvider>
    </div>
  );
};

export default Screen;
