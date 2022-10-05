import { AvatarGroup, Grid, styled } from '@mui/material';
import {
  selectAllUsersPermissions,
  selectUserPermissions,
} from '@Redux/permissions/selectors';
import { selectUserData } from '@Redux/user/selectors';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import User from './User';

const UserAvatar = styled(User)<{ active: boolean }>(({ active, theme }) => ({
  width: 32,
  height: 32,
  fontSize: 16,
  borderColor: active
    ? `${theme.palette.primary.main} !important`
    : 'transparent',
  transition: '0.1s ease-in-out',
  // position: 'relative',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  // '&:after': {
  //   content: '" "',
  //   position: 'absolute',
  //   border: '2px solid red',
  //   height: '32px',
  //   width: '32px',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
}));

interface Props {
  onSelected?(id: number): void;
  selected?: number[];
}

const Members = ({ onSelected, selected = [] }: Props) => {
  const members = useSelector(selectAllUsersPermissions);
  const activeUser = useSelector(selectUserData);

  const filteredMembers = useMemo(() => {
    return Object.values(members).filter(
      (m) => m.userData.id !== activeUser.id,
    );
  }, [members, activeUser]);

  return (
    <>
      <AvatarGroup max={4}>
        {filteredMembers.map(({ userData }) => (
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
    </>
  );
};

export default Members;
