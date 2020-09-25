import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const NewTopPanel = () => {
  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">topBar</Toolbar>
    </AppBar>
  );
};

export default NewTopPanel;
