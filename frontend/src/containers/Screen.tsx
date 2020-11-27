import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { selectScreenById } from '@Redux/project/selectors/screen';
import Workspace from '../components/Editor/Workspace/Workspace';
import { activateScreen } from '../redux/project/actions';
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
  screenId: number;
};

const Screen: React.FC<Props> = ({ screenId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const screen = useSelector(selectScreenById(screenId));
  const currentProjectId = useSelector(selectCurrentProjectId);

  useEffect(() => {
    if (screen) {
      dispatch(activateScreen(screen.id));
    } else {
      history.push(`/project/${currentProjectId}`);
    }
  }, [history, dispatch, screen, currentProjectId]);

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
