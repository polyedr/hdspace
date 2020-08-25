import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'antd/dist/antd.css';

import { ExportedApp } from '$containers/ExportedApp';
import uiReducer from '$redux/export/reducer';

const store = createStore(uiReducer);

render(
  <Provider store={store}>
    <ExportedApp />
  </Provider>,
  document.getElementById('root'),
);
