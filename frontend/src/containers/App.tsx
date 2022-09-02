import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@material-ui/core';
import ChatProvider from '@Components/Chat/ChatProvider';
import history from '../redux/history';
import Routes from './Routes';
import theme from '../styles/Theme';
import Notifier from '../components/Notifier';

const App: React.FC = () => {
  return (
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ChatProvider>
            <Routes />
          </ChatProvider>
          <Notifier />
        </ThemeProvider>
      </MuiThemeProvider>
    </ConnectedRouter>
  );
};

export default App;
