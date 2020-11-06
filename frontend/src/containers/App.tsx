import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { history } from '../redux/store';
import Notification from '../features/notification';
import Routes from './Routes';
import theme from '../styles/Theme';

const App: React.FC = () => {
  return (
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <Routes />

        <Notification />
      </MuiThemeProvider>
    </ConnectedRouter>
  );
};

export default App;
