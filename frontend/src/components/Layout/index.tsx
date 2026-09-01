import React from 'react';
import { makeStyles } from '@mui/styles';
import TopPanel from './TopPanel';

const useStyles = makeStyles({
  layout: {
    minHeight: '100vh',
    height: 1, // allows children use height in %
    display: 'flex',
    flexFlow: 'column nowrap',
    '& header': {
      position: 'unset',
    },
  },
  content: {
    flex: 1,
  },
  placeholder: {
    minHeight: 44, // Toolbar variant="dense" min-height
    flex: '0 0',
  },
  noeventclass: {
    pointerEvents: 'none',
  },
});

function Layout({ children }) {
  const classes = useStyles();
  const url = new URL(window.location.href);
  const shortuuid_token = url?.pathname.split('/')[4];

  return (
    <div
      className={
        shortuuid_token
          ? `${classes.layout} ${classes.noeventclass}`
          : classes.layout
      }
    >
      <TopPanel />
      <div className={classes.content}>{children}</div>
    </div>
  );
}

export default Layout;
