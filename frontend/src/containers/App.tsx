import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from '@Components/Sidebar/Chat/ChatProvider';
import history from '@/redux/history';
import { AppThemeProvider } from '@/styles/Theme';
import Notifier from '@/components/Notifier';
import Routes from './Routes';

const App: React.FC = () => (
  <SnackbarProvider
    maxSnack={10}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
  >
    <BrowserRouter>
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
    </BrowserRouter>
  </SnackbarProvider>
);

export default App;
