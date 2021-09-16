import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core';
import { StyledIconButton } from '@Components/styledComponents';

const SearchMember = ({ user, setAddMember, isDisabled }: any) => (
  <ListItem button style={{ padding: 0 }} key={user.id}>
    <ListItemAvatar>
      <Avatar src={user.profile.avatar || ''} />
    </ListItemAvatar>
    <ListItemText
      primary={user.first_name}
      secondary={user.username}
      secondaryTypographyProps={{ style: { color: '#fff' } }}
      primaryTypographyProps={{ style: { fontSize: '14px' } }}
    />
    <StyledIconButton
      size="small"
      title="Add member"
      onClick={() => setAddMember(true)}
      disabled={isDisabled}
    >
      <AddIcon />
    </StyledIconButton>
  </ListItem>
);

export default SearchMember;
