import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';
import { ListItemAvatar, Avatar } from '@mui/material';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginBottom: '10px',
  },
  title: {
    fontWeight: 600,
    margin: '0 5px 0 0',
    fontSize: 16,
    color: '#2A2A2D',
  },
  time: {
    margin: '0 0 0 5px',
    '& p': {
      fontSize: 13,
      color: '#81818E',
      margin: 0,
    },
  },
  action: {
    '& h6': {
      wordWrap: 'break-word',
      fontSize: 14,
      color: '#2A2A2D',
      margin: '0 0 5px',
    },
  },
  edit: {
    '& h6': {
      margin: '0 0 5px',
      color: '#5064FF',
      fontSize: 14,
      fontWeight: 400,
    },

    '& p': {
      color: '#81818E',
      fontSize: 12,
      margin: '0 0 5px',
    },
    '& img': {
      maxWidth: '100px',
      margin: '5px 0',
    },
  },
});

interface Props {
  activity: ActionTypePM;
  platform: PlatformActionData;
}

const History: React.FC<Props> = ({ activity, platform }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <ListItemAvatar>
          <Avatar src="" alt="H" sx={{ bgcolor: '#344AF0' }}>
            H
          </Avatar>
        </ListItemAvatar>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className={classes.title}>Username</p>
            <Typography variant="subtitle1" className={classes.action}>
              {platform === 'ALL' && activity.action}
              {platform === activity.platform && activity.action}
            </Typography>
            <div className={classes.time}>
              <p>3 minutes ago</p>
            </div>
          </div>
          <div className={classes.edit}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>
                <AssignmentTurnedInOutlinedIcon
                  style={{
                    fontSize: 14,
                    color: '#5064FF',
                    marginRight: '5px',
                  }}
                />
              </span>
              <h6>Finalize the editor&apos;s screen</h6>
            </div>
            <div>
              <img
                src="https://v4.mui.com/static/images/image-list/morning.jpg"
                alt=""
              />
            </div>
            <p>Board</p>
          </div>
        </div>
      </div>

      {/* <Typography variant="subtitle1" className={classes.action}>
        {platform === 'ALL' && activity.action}
        {platform === activity.platform && activity.action}
      </Typography> */}
    </>
  );
};

export default History;
