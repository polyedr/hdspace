import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import NNProcessingModal from '@Components/Dialogs/NNProcessing';
import {
  selectCurrentProjectId,
  selectProjectById,
  selectProjectLoader,
} from '@Redux/project/selectors/base';
import { getProject, resetProjectState } from '@Redux/project/actions';
import LeftPanel from '@Components/LeftPanel';
import NewScreenModal from '@Components/Dialogs/NewScreenModal';
import Screen from './Screen';

const useStyles = makeStyles({
  project: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
    maxWidth: '100vw',
  },
  loader: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  projectId: number;
  screenId?: number;
  elementId?: string;
};

const Project: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectById(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);

  useEffect(() => {
    if (currentProjectId !== projectId) {
      dispatch(getProject(projectId));
    }
  }, [dispatch, projectId, currentProjectId]);

  useEffect(
    () => () => {
      dispatch(resetProjectState());
    },
    [dispatch],
  );

  useEffect(() => {
    if (!screenId && currentProjectId !== -1) {
      const firstUserScreenId = project.projectscreen[1];
      if (firstUserScreenId) {
        history.push(`/project/${currentProjectId}/${firstUserScreenId}`);
      }
    }
  }, [screenId, currentProjectId, project, history]);

  return (
    <div className={classes.project}>
      <LeftPanel />

      {projectLoader ? (
        <div className={classes.loader}>
          <CircularProgress />
        </div>
      ) : (
        <>
          {currentProjectId !== -1 && !!screenId && (
            <Screen screenId={screenId} />
          )}
          <NNProcessingModal />
        </>
      )}

      <NewScreenModal />
    </div>
  );
};

export default Project;
