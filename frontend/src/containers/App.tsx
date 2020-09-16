import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import 'antd/dist/antd.css';
import { useSelector } from 'react-redux';
import { history } from '../redux/store';
import Notification from '../features/notification/view/Notification';
import Routes from './Routes';
import { selectCurrentRootElement } from '../redux/project/selectors';
import {
  addStateElement,
  removeStateElement,
} from '../utils/normalizedStateHelpers';

const App: React.FC = () => {
  const elements = useSelector((state: any) => state.project.data.elements);
  const rootId = useSelector(selectCurrentRootElement).id;

  return (
    <ConnectedRouter history={history}>
      <Routes />
      <Notification />
    </ConnectedRouter>
  );
};

export default App;
