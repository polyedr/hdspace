import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
  return (
    <>
      <Typography variant="subtitle1" className={classes.action}>
        {platform === 'ALL' && activity.action}
        {platform === activity.platform && activity.action}
      </Typography>
    </>
  );
};

export default History;
