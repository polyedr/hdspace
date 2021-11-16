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
  setPartnerId: (v: number) => void;
}> = ({ user, setPartnerId }) => {
  return (
    <ListItemButton
      onClick={() => setPartnerId(user.user_id)}
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
