import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { PersistConfig, Persistor } from 'redux-persist/es/types';

import userReducer from './user/reducer';
import projectReducer from './project/reducers';
import projectSaga from './project/sagas';
import userSaga from './user/sagas';

const userPersistConfig: PersistConfig = {
  key: 'user',
  whitelist: [
    'isLPanelMinimized',
    'isNavPanelMinimized',
    'isPrototypeMode',
    'tokenPair',
    'userData',
  ],
  storage,
};

/* const projectPersistConfig: PersistConfig = {
  key: 'project',
  whitelist: ['currentProjectId', 'scenarios'],
  blacklist: ['projects', 'currentScreenId'],
  storage,
}; */

export const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();

const composeEnhancers =
  typeof window === 'object' &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  project: projectReducer, // persistReducer(projectPersistConfig, projectReducer),
  router: connectRouter(history),
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

export function configureStore(): { store: Store<any>; persistor: Persistor } {
  sagaMiddleware.run(userSaga);
  sagaMiddleware.run(projectSaga as any); // TODO: type action types!

  const persistor = persistStore(store);

  return { store, persistor };
}
