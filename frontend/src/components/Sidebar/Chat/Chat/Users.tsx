/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import zulipInit from 'zulip-js';
import { IUser } from '@Src/types/pmtools/zulipTypes';
import config from '@Constants/configZulipChat';
import { IconButton, List } from '@material-ui/core';
import LogoutIcon from '@mui/icons-material/Logout';
import { SideBarTitle } from '@Components/styledComponents';
import { requestLogoutChatUser } from '@Redux/pmtools/chat/actions';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@mui/material/styles';
import User from './User';
import Messages from './Messages';

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
      <LogoutIcon />
    </IconButton>
  );
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<Array<IUser['members']>>([]);
  const [messages, setMessages] = useState<null | number>(null);
  const [clientId, setClientId] = useState<null | number>(null);

  const handleFetchUser = async () => {
    const client = await zulipInit(config);
    const allUsers = await client.users.retrieve();
    const acc = await client.accounts.retrieve();
    setClientId(
      allUsers.members.find((u: IUser) => acc.email === u.email).user_id,
    );
    setUsers(
      allUsers.members.filter(
        (u: IUser) => u.is_active && acc.email !== u.email,
      ),
    );
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  if (messages) {
    return <Messages clientId={clientId} id={messages} />;
  }

  if (!users.length) {
    return <p>Loading...</p>;
  }

  return (
    <SideBarTitle title="Users" icon={StyledButton}>
      <List>
        {users.map((u) => (
          <User key={u.user_id} user={u} setMessages={setMessages} />
        ))}
      </List>
    </SideBarTitle>
  );
};

export default Users;
