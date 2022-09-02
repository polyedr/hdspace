import { Avatar, Tooltip } from '@mui/material';
import React from 'react';
import { deepOrange } from '@mui/material/colors';

function username(user) {
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.username;
}

const User = ({ user, ...options }) => {
  return (
    <Tooltip arrow title={username(user)}>
      <Avatar
        sx={{
          bgcolor: deepOrange[500],
          width: 24,
          height: 24,
          fontSize: 12,
          lineHeight: 0.8,
        }}
        alt={username(user)}
        src={undefined}
        {...options}
      >
        {username(user)
          .split(' ')
          .map((n) => n[0].toUpperCase())
          .join('')}
      </Avatar>
    </Tooltip>
  );
};

export default User;
