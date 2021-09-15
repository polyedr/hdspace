import { Container } from '@material-ui/core';
import { authChat } from '@Redux/pmtools/chat/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import Chat from './Chat';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const authenticated = useSelector(authChat);
  return <Container>{authenticated ? <Chat /> : <ChatLogin />}</Container>;
};

export default ChatTab;
