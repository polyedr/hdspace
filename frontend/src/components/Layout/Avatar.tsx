import React, { useState } from 'react';
import MuiAvatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import { NavLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { PATH_NAMES } from '@Constants/pathNames';
import IMAGES from '@Constants/images';
import { logout } from '@Redux/user/actions';
import { selectUserData } from '@Redux/user/selectors';
import { openSignScreen } from '@Redux/history';

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

  const { username, avatar } = useSelector(selectUserData);

  const handleAvatarClick = (ev: React.MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(ev.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    dispatch(logout());
    openSignScreen('signin');
  };

  return (
    <div>
      <Tooltip title={username} arrow enterDelay={500}>
        <IconButton size="small" onClick={handleAvatarClick}>
          <MuiAvatar alt={username} src={avatar || IMAGES.prof} />
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
