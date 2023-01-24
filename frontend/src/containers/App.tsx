import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import ChatProvider from '@Components/Sidebar/Chat/ChatProvider';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackbarProvider } from 'notistack';
import history from '@/redux/history';
import Routes from './Routes';
import { AppThemeProvider } from '@/styles/Theme';
import Notifier from '@/components/Notifier';

const App: React.FC = () => (
  <SnackbarProvider
    maxSnack={10}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
  >
    <ConnectedRouter history={history}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppThemeProvider>
          <CssBaseline />
          <ChatProvider>
            <Routes />
          </ChatProvider>
          <Notifier />
        </AppThemeProvider>
      </LocalizationProvider>
    </ConnectedRouter>
  </SnackbarProvider>
);

export default App;
