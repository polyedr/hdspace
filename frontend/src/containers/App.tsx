import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import 'antd/dist/antd.css';
import { history } from '$redux/store';
import Notification from '$features/notification';

import Routes from './Routes';

const App: React.FC = () => {
  return (
    <ConnectedRouter history={history}>
      <Routes />
      <Notification />
    </ConnectedRouter>
  );
};

export default App;
