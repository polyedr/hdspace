import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopPanel from './TopPanel';

const useStyles = makeStyles({
  layout: {
    minHeight: '100vh',
    height: 1, // allows children use height in %
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  content: {
    flex: 1,
  },
  placeholder: {
    minHeight: 48, // Toolbar variant="dense" min-height
    flex: '0 0',
  },
});

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <TopPanel />
      <div className={classes.placeholder} />

      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
