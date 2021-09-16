import { Container } from '@material-ui/core';
import { logIn } from '@Redux/pmtools/chat/actions';
import { authChat } from '@Redux/pmtools/chat/selectors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from './Chat';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(authChat);

  useEffect(() => {
    const savedLogin = JSON.parse(localStorage.getItem('login') || '{}');
    const { realm, username, password } = savedLogin;

    if (savedLogin) {
      dispatch(logIn(realm, username, password));
    }
  }, [dispatch]);

  return <Container>{authenticated ? <Chat /> : <ChatLogin />}</Container>;
};

export default ChatTab;
