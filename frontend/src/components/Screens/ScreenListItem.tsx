import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { lighten } from '@material-ui/core';
import { Screen } from '../../redux/project/types';
import ScreenControls from './ScreenControls';
import ScreenLogo from './ScreenLogo';

const useStyles = makeStyles({
  link: {
    '&, &:hover, &:active, &:link, &:visited, &:focus': {
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
    padding: '.5em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenData: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    color: '#eee',
    minWidth: 0,
    paddingRight: '.5em',
  },
});

type Props = {
  screen: Screen;
};

const ScreenListItem: React.FC<Props> = ({ screen }) => {
  const { name, project, id, image } = screen;
  const classes = useStyles();
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  return (
    <NavLink
      to={`/project/${project}/${id}`}
      className={classes.link}
      activeClassName={classes.active}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ListItem className={classes.listItem}>
        <div className={classes.screenData}>
          <ListItemIcon className={classes.icon}>
            <ScreenLogo image={image} />
          </ListItemIcon>

          {name}
        </div>

        <ScreenControls show={show} screen={screen} />
      </ListItem>
    </NavLink>
  );
};

export default ScreenListItem;
