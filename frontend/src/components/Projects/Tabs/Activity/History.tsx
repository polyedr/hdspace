import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Avatar } from '@material-ui/core';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';

const useStyles = makeStyles((theme) => ({
  action: {
    maxWidth: '270px',
    margin: '10px 0',
    wordWrap: 'break-word',
    fontSize: 14,
  },
  description: {
    color: '#81818E',
    fontSize: 12,
  },
  time: {
    fontSize: 12,
    color: '#81818E',
  },
  title: {
    marginRight: theme.spacing(1) 
  },
}));

type Props = {
  activity: ActionTypePM;
  platform: PlatformActionData;
};

const History: React.FC<Props> = ({ activity, platform }) => {
  const classes = useStyles();
  console.log(activity)
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Avatar src="https://picsum.photos/200/300?grayscale">N</Avatar>
      </Grid>
      <Grid item>
        <Grid container direction="column">
          <Grid item>
            <span className={classes.title}>
              { activity.action }
            </span>
            <span className={classes.time}>
              3 minutes ago
            </span>
          </Grid>
          <Grid item>
            <span className={classes.description}>{ platform }</span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default History;
