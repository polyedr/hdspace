import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import history from '../redux/history';
import Routes from './Routes';
import theme from '../styles/Theme';
import Notifier from '../components/Notifier';

const App: React.FC = () => {
  return (
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <Routes />

        <Notifier />
      </MuiThemeProvider>
    </ConnectedRouter>
  );
};

export default App;
