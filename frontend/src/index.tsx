import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { SnackbarProvider } from 'notistack';
import App from './containers/App';
import { configureStore } from './redux/store';

import './styles/index.scss';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const { store, persistor } = configureStore();

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SnackbarProvider
        maxSnack={10}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <App />
      </SnackbarProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('app'),
);
