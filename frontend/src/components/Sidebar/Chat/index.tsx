import { Container } from '@material-ui/core';
import React from 'react';
import Chat from './Chat';
import ChatLogin from './ChatLogin';

const ChatTab: React.FC = () => {
  const authenticated = false;
  return <Container>{authenticated ? <Chat /> : <ChatLogin />}</Container>;
};

export default ChatTab;
