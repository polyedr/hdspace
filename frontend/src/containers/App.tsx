import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@material-ui/core';
import ChatProvider from '@Components/Sidebar/Chat/ChatProvider';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackbarProvider } from 'notistack';
import history from '../redux/history';
import Routes from './Routes';
import { theme, themeOld } from '../styles/Theme';
import Notifier from '../components/Notifier';

const App: React.FC = () => (
  <SnackbarProvider
    maxSnack={10}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
  >
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={themeOld}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ChatProvider>
              <Routes />
            </ChatProvider>
            <Notifier />
          </ThemeProvider>
        </LocalizationProvider>
      </MuiThemeProvider>
    </ConnectedRouter>
  </SnackbarProvider>
);

export default App;
