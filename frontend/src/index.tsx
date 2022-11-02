import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { configureStore } from '@Redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { setConfig } from 'react-hot-loader';
import App from './containers/App';

import './styles/index.scss';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://8ba6442c457b4bccbb4b2bddb368b192@o1115998.ingest.sentry.io/4504082243256320',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

setConfig({
  reloadHooks: false,
});

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const { store, persistor } = configureStore();

const renderApp = () =>
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById('app'),
  );

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./containers/App', renderApp);
}

renderApp();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
