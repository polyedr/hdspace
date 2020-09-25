import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from '../components/Editor/Editor';
import Spinner from '../components/UI/Spinner';
import {
  selectProjectLoader,
  selectScenarioLoader,
  selectScreenLoader,
} from '../redux/project/selectors';
import { RightPanel } from '../features/applyProperties/views/containers';
import { activateScreen, getProject } from '../redux/project/actions';
import { selectIsPrototypeMode } from '../redux/user/selectors';

// const styles = require('../styles/global.scss');

const styles = {} as any;

export interface IMatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

interface MatchParams {
  projectId: number;
  screenId?: number;
}

type Props = {
  match: IMatch<MatchParams>;
};

const EditorLogic: React.FC<Props> = ({
  match: {
    params: { projectId, screenId },
  },
}) => {
  const dispatch = useDispatch();
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
    <div className={styles.editorLogic}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.workArea}>
          <Editor />
        </div>

        {!isPrototypeMode && <RightPanel />}
      </DndProvider>

      <Spinner active={projectLoader || screenLoader || scenarioLoader} />
    </div>
  );
};

export default EditorLogic;
