import { PersistConfig, persistReducer } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import activityReducer from './pmtools/activity/reducer';
import chatReducer from './pmtools/chat/reducer';
import boardReducer from './pmtools/board/reducer';
import inviteReducer from './pmtools/invite/reducer';
import userReducer from './user/reducer';
import history from './history';
import projectReducer from './project/reducers';
import notificationReducer from './notification/reducer';
import permissionsReducer from './permissions/reducer';
import marketplaceReducer from './marketplace/reducers';

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

export default combineReducers({
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
