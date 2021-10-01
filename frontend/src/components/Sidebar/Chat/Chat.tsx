import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import { Button, IconButton } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';
import { requestLogoutChatUser } from '@Redux/pmtools/chat/actions';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(({ palette }) => ({
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
    '&.Mui-disabled': {
      color: '#888',
    },
  },
}));

const StyledButton = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(requestLogoutChatUser());
  };

  return (
    <IconButton
      color="primary"
      className={classes.iconButton}
      onClick={handleLogout}
    >
      <SendIcon />
    </IconButton>
  );
};

const Chat: React.FC = () => (
  <SideBarTitle title="Welcome to chat!" icon={StyledButton}>
    <PanelTextField placeholder="Enter message" />
    <Button fullWidth variant="contained" color="secondary">
      Send
    </Button>
  </SideBarTitle>
);

export default Chat;
