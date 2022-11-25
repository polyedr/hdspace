/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
} from '@material-ui/core';

import arrowright from '../../../assets/images/arrow-right.png';
import pluses from '../../../assets/images/pluses.png';
import lightbulb from '../../../assets/images/lightbulb.png';

const useStyles = makeStyles((theme) =>
  createStyles({
    containerCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
      alignItems: 'baseline',
    },
    img: {
      maxHeight: 380,
    },
    listItemText: {
      fontSize: '1.25rem',
      maxWidth: 635,
    },
    listItemIcon: {
      minWidth: 15,
    },
    containerLeft: {
      background: theme.palette.secondary.main,
      color: 'rgb(59, 86, 110)',
    },
    inlineimg: {
      display: 'flex',
      width: 580,
      '& img': {
        marginRight: 5,
      },
    },
    title: {
      fontSize: '1.875rem',
      textAlign: 'center',
      maxWidth: 680,
    },
    arrow: {
      height: 15,
      marginRight: 10,
    },
    pluses: {
      height: 160,
      right: 0,
      bottom: 0,
      position: 'absolute',
    },
  }),
);
const Info = ({ title, list, img }) => {
  const classes = useStyles();
  const screen = (title, list, img) => (
    <Grid
      item
      xs={12}
      sm={7}
      className={`${classes.containerLeft} ${classes.containerCenter} `}
    >
      <img src={img} alt="image" className={classes.img} />
      {Array.isArray(title) ? (
        <>
          <div className={classes.inlineimg}>
            <img src={lightbulb} alt="" />
            <Typography variant="h6">{title[0]}</Typography>
          </div>
          <Typography variant="h5" className={classes.title}>
            {title[1]}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
      )}

      <List>
        {list.map((text) => (
          <ListItem className={classes.list}>
            <ListItemIcon className={classes.listItemIcon}>
              <img src={arrowright} className={classes.arrow} alt="arrow" />
            </ListItemIcon>
            <ListItemText disableTypography className={classes.listItemText}>
              {text}
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <img src={pluses} className={classes.pluses} alt="background img" />
    </Grid>
  );

  return screen(title, list, img);
};

export default Info;
