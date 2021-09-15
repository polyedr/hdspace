import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import History from './History';

const ActivityTab = () => {
  const actions = [];
  // const projectId = useSelector(selectCurrentProjectId);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(1);
    // dispatch(requestGetAction(projectId));
  }, [dispatch]);

  return <Container>{!actions ? <p>Loading... </p> : <History />}</Container>;
};

export default ActivityTab;
