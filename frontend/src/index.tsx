import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import App from './containers/App';
import { configureStore } from './redux/store';

require('./styles/index.scss');

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const { store, persistor } = configureStore();

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('app'),
);
