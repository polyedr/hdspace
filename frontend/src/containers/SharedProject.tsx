/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
} from '@Redux/project/selectors/base';
import {
  getProject,
  resetProjectState,
  getSharedProject,
} from '@Redux/project/actions';
import LeftPanel from '@Components/LeftPanel';
import { makeStyles } from '@material-ui/core/styles';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import { changePrototypeMode } from '@Redux/user/actions';
import * as Actions from '@Redux/permissions/actions';
import { selectUserData, selectTokenPair } from '@Redux/user/selectors';
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

const SharedProject: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);
  const screens = useSelector(selectSortedScreens);
  const url = new URL(window.location.href);
  const shortuuid_token = url?.pathname.split('/')[4];
  const { access } = useSelector(selectTokenPair);
  const user = useSelector(selectUserData);
  useEffect(() => {
    dispatch(getSharedProject(shortuuid_token));
  }, [shortuuid_token]);

  useEffect(() => {
    dispatch(Actions.getAllUsersProjectPermissions(projectId));
  }, [dispatch, user]);

  const getInitialScreenId = (screens: Screen[]) => {
    const sorted = screens.sort((a, b) => a.buoyancy - b.buoyancy);
    return sorted[1]?.id || sorted[0]?.id;
  };

  useEffect(() => {
    if (currentProjectId !== projectId) {
      if (!!user && !!access) {
        dispatch(getProject(projectId));
        dispatch(changePrototypeMode(true));
      }
    }
  }, [dispatch, user, access]);

  useEffect(
    () => () => {
      dispatch(resetProjectState());
      DOMHandler.INSTANCE.reset();
    },
    [dispatch],
  );

  useEffect(() => {
    if (!screenId && currentProjectId !== -1 && screens.length) {
      const firstUserScreenId = project.projectscreen[1];
      if (user && firstUserScreenId) {
        history.push(
          `/project/${currentProjectId}/${getInitialScreenId(screens)}`,
        );
      }
    }
  }, [screenId, currentProjectId, project, history, screens]);

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
        </>
      )}
    </div>
  );
};

export default SharedProject;
