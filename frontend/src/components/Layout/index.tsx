import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import NewTopPanel from './NewTopPanel';

const useStyles = makeStyles({
  root: {},
  content: {},
});

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NewTopPanel />

      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
