import { AvatarGroup, Grid, styled } from '@mui/material';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import User from './User';

const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    fontSize: 16,
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
      <StyledAvatarGroup max={4}>
        {Object.values(members).map(({ userData }) => (
          <User
            active={selected.indexOf(userData.id) !== -1}
            user={userData}
            sx={{ width: 32, height: 32 }}
            onClick={() => {
              if (onSelected) {
                onSelected(userData.id);
              }
            }}
          />
        ))}
      </StyledAvatarGroup>
    </Grid>
  );
};

export default Members;
