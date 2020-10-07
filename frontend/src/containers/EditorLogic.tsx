import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Spinner from '../components/UI/Spinner';
import {
  selectProjectLoader,
  selectScenarioLoader,
  selectScreenLoader,
} from '../redux/project/selectors';
import { RightPanel } from '../features/applyProperties/views/containers';
import { activateScreen, getProject } from '../redux/project/actions';
import { selectIsPrototypeMode } from '../redux/user/selectors';
import LeftPanel from '../components/LeftPanel';
import Workspace from '../components/Editor/Workspace/Workspace';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
  },
});

type Props = {
  projectId: number;
  screenId?: number;
};

const EditorLogic: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const scenarioLoader = useSelector(selectScenarioLoader);
  const screenLoader = useSelector(selectScreenLoader);
  const projectLoader = useSelector(selectProjectLoader);

  useEffect(() => {
    dispatch(getProject(projectId, screenId));
  }, [projectId]);

  useEffect(() => {
    if (screenId) {
      dispatch(activateScreen(screenId));
    }
  }, [screenId]);

  return (
    <div className={classes.root}>
      <DndProvider backend={HTML5Backend}>
        <LeftPanel />

        <Workspace />

        {!isPrototypeMode && <RightPanel />}
      </DndProvider>

      <Spinner active={projectLoader || screenLoader || scenarioLoader} />
    </div>
  );
};

export default EditorLogic;
