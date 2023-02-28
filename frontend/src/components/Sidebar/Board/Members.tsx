import { AvatarGroup, styled } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { selectUserData } from '@Redux/user/selectors';
import User from './User';

const UserAvatar = styled(User)<{ active: boolean }>(({ active, theme }) => ({
  width: 32,
  height: 32,
  fontSize: 16,
  borderColor: active
    ? `${theme.palette.primary.main} !important`
    : 'transparent',
  transition: '0.1s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

interface Props {
  onSelected?: (id: number) => void;
  selected?: number[];
}

function Members({ onSelected, selected = [] }: Props) {
  const members = useSelector(selectAllUsersPermissions);
  const activeUser = useSelector(selectUserData);

  const filteredMembers = useMemo(
    () => Object.values(members).filter((m) => m.userData.id !== activeUser.id),
    [members, activeUser],
  );

  return (
    <AvatarGroup max={4}>
      {filteredMembers.map(({ userData }) => (
        <UserAvatar
          key={userData.id}
          active={selected.includes(userData.id)}
          user={userData}
          onClick={() => {
            if (onSelected) {
              onSelected(userData.id);
            }
          }}
        />
      ))}
    </AvatarGroup>
  );
}

export default Members;
