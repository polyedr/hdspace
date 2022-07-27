import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PATH_NAMES from '@Constants/pathNames';
import { logoutStart } from '@Redux/user/actions';
import { selectProfileData, selectUserData } from '@Redux/user/selectors';
import {
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar as MuiAvatar,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  menu: {
    '& ul': {
      fontSize: '1em',
      padding: 0,
    },
  },
  navLink: {
    '&:focus, &:hover, &:visited, &:link, &:active': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
});

const Avatar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
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

      <Menu
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorEl={menuAnchorEl}
        keepMounted
        className={classes.menu}
      >
        <NavLink to={PATH_NAMES.profile} exact className={classes.navLink}>
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
        </NavLink>

        <NavLink to={PATH_NAMES.projects} exact className={classes.navLink}>
          <MenuItem onClick={handleMenuClose}>My Projects</MenuItem>
        </NavLink>

        <Divider />

        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default Avatar;
