import React from 'react';
import Avatar from '@Components/UI/Avatar';

export function username(user) {
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.username;
}

const User = ({ user, ...options }) => {
  return (
    <Avatar
      sx={{
        width: 24,
        height: 24,
        fontSize: 12,
        lineHeight: 0.8,
      }}
      src={user.profile_avatar ?? undefined}
      alt={username(user)}
      uniqueKey={user.id}
      {...options}
    />
  );
};

export default User;
