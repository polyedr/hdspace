import { IUser } from '@Src/types/pmtools/zulipTypes';
import ListItemButton from '@mui/material/ListItemButton';
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React from 'react';

const User: React.FC<{
  user: IUser;
  setMessages: (v: null | number) => void;
}> = ({ user, setMessages }) => {
  return (
    <ListItemButton
      onClick={() => setMessages(user.user_id)}
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={user.avatar_url} />
      </ListItemAvatar>
      <ListItemText
        primary={user.full_name}
        secondary={
          <Typography
            style={{ color: '#fff', width: 40, wordWrap: 'break-word' }}
            component="span"
            variant="body2"
          >
            {user.email}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

export default User;
