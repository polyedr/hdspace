import { AvatarGroup, Grid, styled } from '@mui/material';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import User from './User';

const UserAvatar = styled(User)<{ active: boolean }>(({ active, theme }) => ({
  width: 32,
  height: 32,
  fontSize: 16,
  borderColor: active ? `${theme.palette.primary.main} !important` : '#fff',
  '&:hover': {
    transform: 'scale(1.1)',
    transition: '0.1s ease-in-out',
  },
}));

interface Props {
  onSelected?(id: number): void;
  selected?: number[];
}

const Members = ({ onSelected, selected = [] }: Props) => {
  const members = useSelector(selectAllUsersPermissions);

  return (
    <Grid item md="auto" justifyContent="left">
      <AvatarGroup max={4}>
        {Object.values(members).map(({ userData }) => (
          <UserAvatar
            active={selected.indexOf(userData.id) !== -1}
            user={userData}
            // sx={{ width: 32, height: 32 }}
            onClick={() => {
              if (onSelected) {
                onSelected(userData.id);
              }
            }}
          />
        ))}
      </AvatarGroup>
    </Grid>
  );
};

export default Members;
