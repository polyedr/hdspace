import { Container } from '@material-ui/core';
import { successLoginChatUser } from '@Redux/pmtools/chat/actions';
import { chatUser } from '@Redux/pmtools/chat/selectors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from './Chat';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(chatUser);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    if (Object.entries(login).length > 0) {
      dispatch(successLoginChatUser(login));
    }
  }, [dispatch]);

  return <Container>{authenticated ? <Chat /> : <ChatLogin />}</Container>;
};

export default ChatTab;
