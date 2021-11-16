/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import zulipInit from 'zulip-js';
import { IUser } from '@Src/types/pmtools/zulipTypes';
import { configUser } from '@Constants/configZulipChat';
import { List } from '@material-ui/core';
import LogoutIcon from '@mui/icons-material/Logout';
import { SideBarTitle } from '@Components/styledComponents';
import { requestLogoutChatUser } from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '@Redux/user/selectors';
import User from './User';
import Messages from './Messages';

const Users: React.FC = () => {
  const [users, setUsers] = useState<Array<IUser['members']>>([]);
  const [partnerId, setPartnerId] = useState(0);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(0);
  const { email, profile } = useSelector(selectUserData);
  const config = configUser(email, profile.parameters.passwordZulip);

  const handleFetchUser = async () => {
    const client = await zulipInit(config);
    const { members } = await client.users.retrieve();
    const acc = await client.accounts.retrieve();
    const userId = members?.find((u: IUser) => acc.email === u.email)?.user_id;
    const activeUsers = members.filter(
      (u: IUser) => u.is_active && u?.user_id !== userId,
    );
    setUserId(userId);
    setUsers(activeUsers);
  };

  useEffect(() => {
    handleFetchUser();
  }, []);

  if (partnerId) {
    return <Messages userId={userId} partnerId={partnerId} />;
  }
  const handleLogout = () => {
    dispatch(requestLogoutChatUser());
  };

  return (
    <>
      {users.length ? (
        <SideBarTitle
          title="Users"
          actions={[{ icon: LogoutIcon, callback: handleLogout }]}
        >
          <List>
            {users.map((u) => (
              <User key={u.user_id} user={u} setPartnerId={setPartnerId} />
            ))}
          </List>
        </SideBarTitle>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Users;
