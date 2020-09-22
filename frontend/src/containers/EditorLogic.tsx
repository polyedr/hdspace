import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor/Editor';
import Spinner from '../components/UI/Spinner';
import {
  selectProjectLoader,
  selectScenarioLoader,
  selectScreenLoader,
} from '../redux/project/selectors';
import { RightPanel } from '../features/applyProperties/views/containers';
import { getProject } from '../redux/project/actions';
import { selectIsPrototypeMode } from '../redux/user/selectors';

const styles = require('../styles/global.scss');

export interface IMatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

interface MatchParams {
  projectID: number;
  screenID?: number;
}

type Props = {
  match: IMatch<MatchParams>;
};

const EditorLogic: React.FC<Props> = ({
  match: {
    params: { projectID, screenID },
  },
}) => {
  const dispatch = useDispatch();
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const scenarioLoader = useSelector(selectScenarioLoader);
  const screenLoader = useSelector(selectScreenLoader);
  const projectLoader = useSelector(selectProjectLoader);

  useEffect(() => {
    dispatch(getProject(projectID, screenID));
  }, [projectID]);

  return (
    <div className={styles.editorLogic}>
      <div className={styles.workArea}>
        <Editor />
      </div>

      {!isPrototypeMode && <RightPanel />}

      <Spinner active={projectLoader || screenLoader || scenarioLoader} />
    </div>
  );
};

export default EditorLogic;
