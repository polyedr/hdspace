/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import { CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NNProcessingModal from '@Components/Dialogs/NNProcessing';
import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
} from '@Redux/project/selectors/base';
import { getProject } from '@Redux/project/actions';
import LeftPanel from '@Components/LeftPanel';
import NewScreenModal from '@Components/Dialogs/NewScreenModal';
import Sidebar from '@Components/Sidebar';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';
import ScreenComponent from './Screen';

const useStyles = makeStyles({
  project: {
    display: 'flex',
    minHeight: '100%',
    height: 1, // allows children use height in %
    maxWidth: '100vw',
    position: 'relative',
  },
  loader: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  projectId: number;
  screenId?: number;
  elementId?: string;
}

const Project: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);
  const screens = useSelector(selectSortedScreens);

  const getInitialScreenId = (screens: Screen[]) => {
    const sorted = screens.sort((a, b) => a.buoyancy - b.buoyancy);
    return sorted[1]?.id || sorted[0]?.id;
  };

  useEffect(() => {
    if (currentProjectId !== projectId) {
      dispatch(getProject(projectId));
    }
  }, [dispatch, projectId, currentProjectId]);

  // useEffect(
  //   () => () => {
  //     dispatch(resetProjectState());
  //     DOMHandler.INSTANCE.reset();
  //   },
  //   [dispatch],
  // );

  useEffect(() => {
    if (!screenId && currentProjectId !== -1 && screens.length) {
      const firstUserScreenId = project.projectscreen[1];
      if (firstUserScreenId) {
        history.push(
          `/project/${currentProjectId}/${getInitialScreenId(screens)}`,
        );
      }
    }
  }, [screenId, currentProjectId, project, screens]);

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
            <ScreenComponent screenId={screenId} />
          )}
          <NNProcessingModal />
        </>
      )}

      <Sidebar />

      <NewScreenModal />
    </div>
  );
};

export default Project;
