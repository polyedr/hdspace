import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Spinner from '../components/UI/Spinner';
import {
  selectCurrentProjectId,
  selectProjectLoader,
} from '../redux/project/selectors';
import { getProject } from '../redux/project/actions';
import LeftPanel from '../components/LeftPanel';
import Screen from './Screen';

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

const ProjectLoaderSpinner = () => {
  const projectLoader = useSelector(selectProjectLoader);
  return <Spinner active={projectLoader} />;
};

const Project: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentProjectId = useSelector(selectCurrentProjectId);

  useEffect(() => {
    dispatch(getProject(projectId));
  }, [dispatch, projectId]);

  return (
    <div className={classes.root}>
      <LeftPanel />

      {currentProjectId !== -1 && <Screen screenId={screenId} />}

      <ProjectLoaderSpinner />
    </div>
  );
};

export default Project;
