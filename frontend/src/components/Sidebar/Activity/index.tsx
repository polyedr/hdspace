import { Container } from '@material-ui/core';
import { requestGetAction } from '@Redux/pmtools/activity/actions';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from './History';

const ActivityTab = () => {
  const actions = [];
  const dispatch = useDispatch();
  const projectId = useSelector(selectCurrentProjectId);

  useEffect(() => {
    dispatch(requestGetAction(projectId));
  }, [dispatch]);

  return (
    <Container>
      {!actions ? <p>Loading... </p> : <History id={projectId} />}
    </Container>
  );
};

export default ActivityTab;
