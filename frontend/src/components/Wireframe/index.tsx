import React, { useEffect } from 'react';
import { Stack, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getProject } from '@Redux/project/actions';
import {
  selectCurrentProject,
  selectCurrentProjectId,
} from '@Redux/project/selectors/base';
import { selectScreens } from '@Redux/project/selectors/screen';
import Canvas from './Canvas';
import RightSidebar from './RightBar';
import LeftSidebar from './LeftBar';

interface Props {
  projectId: number;
  screenId?: number;
  elementId?: string;
}

interface Props {
  projectId: number;
  screenId?: number;
}

const Wireframe: React.FC<Props> = ({ projectId, screenId: _ }) => {
  const screens = useSelector(selectScreens);
  const project = useSelector(selectCurrentProject);
  const currentProjectId = useSelector(selectCurrentProjectId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentProjectId !== projectId) {
      dispatch(getProject(projectId));
    }
  }, [dispatch, currentProjectId, projectId]);

  if (
    project.name === '' ||
    !currentProjectId ||
    !screens ||
    Object.keys(screens).length < 1
  ) {
    return null;
  }

  return (
    <>
      <Stack sx={{ height: '100%' }}>
        <Grid container columnSpacing={0} flex={1}>
          <Grid style={{ position: 'relative', zIndex: 4 }} item xs={2}>
            <LeftSidebar screens={screens} />
          </Grid>
          <Grid item xs={8}>
            <Canvas screens={screens} />
          </Grid>
          <Grid
            style={{ position: 'relative', zIndex: 4, background: 'white' }}
            item
            xs={2}
          >
            <RightSidebar screens={screens} />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Wireframe;
