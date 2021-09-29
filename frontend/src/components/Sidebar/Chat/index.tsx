import { Container } from '@material-ui/core';
import { authChat } from '@Redux/pmtools/chat/selectors';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chat from './Chat';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(authChat);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    if (Object.entries(login).length > 0) {
      setSave(true);
    }
  }, [dispatch]);

  return (
    <Container>{authenticated || save ? <Chat /> : <ChatLogin />}</Container>
  );
};

export default ChatTab;
