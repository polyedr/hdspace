import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { loadUser } from '@Redux/user/actions';
import { selectUserData } from '@Redux/user/selectors';
import { setPreSelectedElementId } from '@Redux/project/actions';

const SharedWithLink: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector(selectUserData);

  const url = new URL(window.location.href);
  const userId = url.searchParams.get('user');

  const projectId = url.searchParams.get('project');
  const screenId = url.searchParams.get('screen');
  const access = url.searchParams.get('token');
  const refresh = url.searchParams.get('refresh');
  const elementId = url.searchParams.get('element');

  useEffect(() => {
    if (!userId || !access || !refresh) {
      return;
    }
    dispatch(loadUser(userId, { access, refresh }));
  }, [access, dispatch, refresh, userId]);

  useEffect(() => {
    if (!userData.isActive) {
      return;
    }
    if (elementId) {
      dispatch(setPreSelectedElementId(elementId));
    }

    history.push(`/project/${projectId}/${screenId}`);
  }, [dispatch, elementId, history, projectId, screenId, userData.isActive]);

  return null;
};

export default SharedWithLink;
