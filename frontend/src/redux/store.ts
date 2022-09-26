/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose, Store } from 'redux';
import { persistStore } from 'redux-persist';

import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { Persistor } from 'redux-persist/es/types';
import { composeWithDevTools } from '@redux-devtools/extension';
import createReduxPromiseListener from 'redux-promise-listener';

import projectSaga from './project/sagas';
import userSaga from './user/sagas';
import history from './history';
import DevToolsOptions from './devtools';

import pmToolsSaga from './pmtools/sagas';
import marketplaceSaga from './marketplace/sagas';

import rootReducer from './rootReducer';

const sagaMiddleware = createSagaMiddleware();

const reduxPromiseListener = createReduxPromiseListener();

const composeEnhancers =
  typeof window === 'object' &&
  process.env.NODE_ENV !== 'production' &&
  (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? composeWithDevTools({
        name: 'adevi',
        ...DevToolsOptions,
      })
    : compose;

export const promiseListener = reduxPromiseListener;

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

export function configureStore(): {
  store: Store<any>;
  persistor: Persistor;
} {
  sagaMiddleware.run(userSaga);
  sagaMiddleware.run(projectSaga as any); // TODO: type action types!
  sagaMiddleware.run(pmToolsSaga);
  sagaMiddleware.run(marketplaceSaga as any);
  const persistor = persistStore(store);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(rootReducer));
  }

  return { store, persistor };
}
