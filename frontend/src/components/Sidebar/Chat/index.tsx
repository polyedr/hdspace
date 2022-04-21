import { Container } from '@material-ui/core';
import { requestLoginChatUser } from '@Redux/pmtools/chat/actions';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChatUser } from '@Redux/pmtools/chat/selectors';
import Messages from './Messages/Messages';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(selectChatUser);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    if (Object.entries(login).length > 0 && !authenticated) {
      dispatch(requestLoginChatUser(login.password));
    }
  }, [authenticated, dispatch]);

  return <Container>{authenticated ? <Messages /> : <ChatLogin />}</Container>;
};

export default ChatTab;
