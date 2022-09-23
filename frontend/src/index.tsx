import React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import App from './containers/App';

import './styles/index.scss';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

if (process.env.NODE_ENV === 'development') {
  const AppWithHotReloading = hot(module)(App);

  render(<AppWithHotReloading />, document.getElementById('app'));
} else {
  render(<App />, document.getElementById('app'));
}

if (module.hot) {
  module.hot.accept();
}
