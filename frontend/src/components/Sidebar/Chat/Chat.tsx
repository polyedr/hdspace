import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import { Button } from '@material-ui/core';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';

const Chat: React.FC = () => (
  <SideBarTitle title="Welcome to chat!" icon={SendIcon}>
    <PanelTextField placeholder="Enter message" />
    <Button fullWidth variant="contained" color="secondary">
      Send
    </Button>
  </SideBarTitle>
);

export default Chat;
