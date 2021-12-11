import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import { ServerProject } from '@Src/types';
import IMAGES from '@Constants/images';

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
        <Avatar src={profile.avatar ?? IMAGES.prof} alt="profile" />
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
