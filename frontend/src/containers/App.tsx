import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackbarProvider } from 'notistack';
import { HistoryRouter } from 'redux-first-history/rr6';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ChatProvider from '@Components/Sidebar/ChatDisabled/ChatProvider';
import { history } from '@/redux/store';
import { AppThemeProvider } from '@/styles/Theme';
import Notifier from '@/components/Notifier';
import Routes from './Routes';

const App: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <SnackbarProvider
      maxSnack={10}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    >
      <HistoryRouter history={history}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppThemeProvider>
            <CssBaseline />
            <ChatProvider>
              <Routes />
            </ChatProvider>
            <Notifier />
          </AppThemeProvider>
        </LocalizationProvider>
      </HistoryRouter>
    </SnackbarProvider>
  </DndProvider>
);

export default App;
