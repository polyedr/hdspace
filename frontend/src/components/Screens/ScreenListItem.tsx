import React from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { lighten } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Screen } from '../../redux/project/types';

const useStyles = makeStyles({
  link: {
    '&, &:hover': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  active: {
    '& $listItem': {
      backgroundColor: lighten('#2f4050', 0.1),
    },
  },
  listItem: {
    '&:hover': {
      backgroundColor: lighten('#2f4050', 0.07),
    },
  },
  icon: {
    color: '#eee',
    minWidth: 0,
    paddingRight: '.5em',
  },
  image: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
});

type Props = {
  screen: Screen;
};

const ScreenListItem: React.FC<Props> = ({
  screen: { name, project, id, image },
}) => {
  const classes = useStyles();

  return (
    <NavLink
      to={`/project/${project}/${id}`}
      className={classes.link}
      activeClassName={classes.active}
    >
      <ListItem className={classes.listItem}>
        <ListItemIcon className={classes.icon}>
          {image ? (
            <img className={classes.image} src={image as string} alt="" />
          ) : (
            <InsertDriveFileIcon />
          )}
        </ListItemIcon>
        {name}
      </ListItem>
    </NavLink>
  );
};

export default ScreenListItem;
