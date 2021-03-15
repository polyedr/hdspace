import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router';
import {
  selectCurrentProjectId,
  selectVIAModeEnabled,
} from '@Redux/project/selectors/base';
import { selectScreenById } from '@Redux/project/selectors/screen';
import VIA from '@Components/Editor/VIA';
import VIARightPanel from '@Components/Editor/VIA/VIARightPanel';
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
  elementId?: string;
};

const Screen: React.FC<Props> = ({ screenId, elementId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const screen = useSelector(selectScreenById(screenId));
  const currentProjectId = useSelector(selectCurrentProjectId);
  const viaModeEnabled = useSelector(selectVIAModeEnabled);

  useEffect(() => {
    if (screen) {
      dispatch(activateScreen(screen.id));
    } else {
      history.push(`/project/${currentProjectId}`);
    }
  }, [history, dispatch, screen, currentProjectId]);

  return (
    <div className={classes.screen}>
      {viaModeEnabled ? (
        <>
          <VIA />

          <VIARightPanel />
        </>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Workspace elementId={elementId} />

          <RightPanel />
        </DndProvider>
      )}
    </div>
  );
};

export default Screen;
