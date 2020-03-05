import React from 'react';
import { render } from 'react-dom';

import { ExportTree } from './components/Editor/Export/Export';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
// import { configureStore } from '$redux/store';

// const { store, persistor } = configureStore();

render(
  //<Provider store={store}>
    <ExportTree renderTreeInfo={window.renderTreeInfo} />,
  //</Provider>,
  document.getElementById('root'),
);
