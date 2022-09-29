import React from 'react';
import { render } from 'react-dom';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { configureStore } from '@Redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './containers/App';

import './styles/index.scss';

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

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./containers/App', renderApp);
}

renderApp();

if (module.hot) {
  module.hot.accept();
}
