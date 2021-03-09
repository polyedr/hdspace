import { logout, setTokenPair, setUserData } from '@Redux/user/actions';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

const SharedWithLink: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  let projectId;
  let screenId;
  let accessToken;

  useEffect(() => {
    const url = new URL(window.location.href);
    projectId = url.searchParams.get('project');
    screenId = url.searchParams.get('screen');
    accessToken = url.searchParams.get('token');

    dispatch(logout());
    dispatch(setTokenPair({ access: accessToken, refresh: '' }));
    dispatch(
      setUserData({
        username: 'anonymous',
      }),
    );
    history.push(`/project/${projectId}/${screenId}`);
  }, []);

  return null;
};

export default SharedWithLink;
