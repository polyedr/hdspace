/* eslint-disable no-underscore-dangle */
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
import { PersistConfig, Persistor } from 'redux-persist/es/types';
import createReduxPromiseListener from 'redux-promise-listener';
import userReducer from './user/reducer';
import projectReducer from './project/reducers';
import notificationReducer from './notification/reducer';
import permissionsReducer from './permissions/reducer';
import marketplaceReducer from './marketplace/reducers';
import projectSaga from './project/sagas';
import userSaga from './user/sagas';
import history from './history';
import DevToolsOptions from './devtools';
import activityReducer from './pmtools/activity/reducer';
import chatReducer from './pmtools/chat/reducer';
import boardReducer from './pmtools/board/reducer';
import inviteReducer from './pmtools/invite/reducer';
import pmToolsSaga from './pmtools/sagas';
import marketplaceSaga from './marketplace/sagas';

const userPersistConfig: PersistConfig = {
  key: 'user',
  whitelist: [
    'isLPanelMinimized',
    'isPrototypeMode',
    'tokenPair',
    'userData',
    'isLoggedIn',
    'chat',
  ],
  storage,
};

const sagaMiddleware = createSagaMiddleware();

const reduxPromiseListener = createReduxPromiseListener();

const composeEnhancers =
  typeof window === 'object' &&
  process.env.NODE_ENV !== 'production' &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(DevToolsOptions)
    : compose;

export const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  project: projectReducer,
  router: connectRouter(history),
  notification: notificationReducer,
  permissions: permissionsReducer,
  activity: activityReducer,
  chat: chatReducer,
  invite: inviteReducer,
  board: boardReducer,
  marketplace: marketplaceReducer,
});

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
      reduxPromiseListener.middleware,
    ),
  ),
);

export const promiseListener = reduxPromiseListener;

export function configureStore(): { store: Store<any>; persistor: Persistor } {
  sagaMiddleware.run(userSaga);
  sagaMiddleware.run(projectSaga as any); // TODO: type action types!
  sagaMiddleware.run(pmToolsSaga);
  sagaMiddleware.run(marketplaceSaga as any);
  const persistor = persistStore(store);

  return { store, persistor };
}
