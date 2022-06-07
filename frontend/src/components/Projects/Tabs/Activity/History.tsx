import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Avatar } from '@material-ui/core';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';

const useStyles = makeStyles({
  action: {
    maxWidth: '270px',
    margin: '10px 0',
    wordWrap: 'break-word',
    fontSize: 14,
  },
});

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
      <Grid container item spacing={1} direction="column">
        <Grid item>
          <Typography variant="subtitle1" className={classes.action}>
            {platform === 'ALL' && activity.action}
            {platform === activity.platform && activity.action}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">{ platform }</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default History;
