import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import NewTopPanel from './NewTopPanel';

const useStyles = makeStyles({
  root: {
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
    <div className={classes.root}>
      <NewTopPanel />
      <div className={classes.placeholder} />

      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
