import { Container } from '@material-ui/core';
import { requestGetAction } from '@Redux/pmtools/activity/actions';
import selectActions from '@Redux/pmtools/activity/selectors';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from './History';

const ActivityTab = () => {
  const dispatch = useDispatch();
  const project = useSelector(selectCurrentProjectId);
  const actions: Array<string> = useSelector(selectActions);

  useEffect(() => {
    dispatch(requestGetAction(project));
  }, [dispatch, project]);

  return (
    <Container>
      {!actions ? (
        <p>Loading... </p>
      ) : (
        <History actions={actions} id={project} />
      )}
    </Container>
  );
};

export default ActivityTab;
