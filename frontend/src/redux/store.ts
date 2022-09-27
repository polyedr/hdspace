/* eslint-disable no-underscore-dangle */
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import createReduxPromiseListener from 'redux-promise-listener';

import projectSaga from './project/sagas';
import userSaga from './user/sagas';
import history from './history';

import pmToolsSaga from './pmtools/sagas';
import marketplaceSaga from './marketplace/sagas';

import rootReducer from './rootReducer';

const reduxPromiseListener = createReduxPromiseListener();
export const promiseListener = reduxPromiseListener;

export function configureAppStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [
      routerMiddleware(history),
      sagaMiddleware,
      reduxPromiseListener.middleware as any,
    ],
  });

  sagaMiddleware.run(userSaga);
  sagaMiddleware.run(projectSaga as any); // TODO: type action types!
  sagaMiddleware.run(pmToolsSaga);
  sagaMiddleware.run(marketplaceSaga as any);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./rootReducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export const store = configureAppStore();

export const persistor = persistStore(store);
