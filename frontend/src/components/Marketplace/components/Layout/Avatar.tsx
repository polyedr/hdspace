import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar as MuiAvatar,
} from '@mui/material';
import styled from 'styled-components';
import PATH_NAMES from '@Constants/pathNames';
import { logoutStart } from '@Redux/user/actions';
import { selectProfileData, selectUserData } from '@Redux/user/selectors';

const CustomMenu = styled(Menu)`
  & ul {
    font-size: 1em;
    padding: 0;
  }
  a {
    text-decoration: none;
    color: black;
  }
`;

const CustomeNavLink = styled(NavLink)`
  & li:focus,
  & li:hover,
  & li:visited,
  & li:link,
  & li:active {
    color: 'inherit';
    text-decoration: none;
  }
`;

const Avatar: React.FC = () => {
  const dispatch = useDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { username } = useSelector(selectUserData);
  const {
    parameters: { avatarCrop: avatar },
  } = useSelector(selectProfileData);

  const handleAvatarClick = (ev: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(ev.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    dispatch(logoutStart());
  };

  return (
    <div>
      <Tooltip title={username} arrow enterDelay={500}>
        <IconButton size="small" onClick={handleAvatarClick}>
          <MuiAvatar alt={username} src={avatar} sx={{ bgcolor: '#344AF0' }}>
            {username[0]?.toUpperCase()}
          </MuiAvatar>
        </IconButton>
      </Tooltip>
      <CustomMenu
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        keepMounted
      >
        <CustomeNavLink to={PATH_NAMES.profile} exact>
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
        </CustomeNavLink>
        <CustomeNavLink to={PATH_NAMES.projects} exact>
          <MenuItem onClick={handleMenuClose}>My Projects</MenuItem>
        </CustomeNavLink>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </CustomMenu>
    </div>
  );
};

export default Avatar;
