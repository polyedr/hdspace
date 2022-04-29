/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { ServerProject } from '@Src/types';

type PropsType = {
  project: ServerProject['id'];
  userData: any;
  permissions: Array<string>;
};

const Member: React.FC<PropsType> = ({ userData, permissions }) => {
  const { username, id, profile } = userData;
  const rights = !!permissions.find((p: string) => p === 'change_project');

  return (
    <ListItem button key={id} style={{ padding: 0 }}>
      <ListItemAvatar>
        <Avatar
          src={
            typeof profile.parameters.avatarCrop === 'string'
              ? profile.parameters.avatarCrop
              : ''
          }
          alt={username}
          sx={{ bgcolor: '#344AF0' }}
        >
          {username[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={profile.role}
        secondary={username}
        secondaryTypographyProps={{ style: { color: '#fff' } }}
        primaryTypographyProps={{ style: { fontSize: '14px' } }}
      />
      <p style={{ fontSize: 10 }}>{rights ? 'READ, WRITE' : 'READ'}</p>
    </ListItem>
  );
};

export default Member;
