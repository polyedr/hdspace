import { Container } from '@material-ui/core';
import { requestLoginChatUser } from '@Redux/pmtools/chat/actions';
import { chatUser } from '@Redux/pmtools/chat/selectors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Users from './Chat/Users';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(chatUser);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    if (Object.entries(login).length > 0) {
      dispatch(requestLoginChatUser(login.password));
    }
  }, [dispatch]);

  return <Container>{authenticated ? <Users /> : <ChatLogin />}</Container>;
};

export default ChatTab;
