import { combineReducers } from 'redux';

import * as T from '../types';
import { dataReducer } from './data';
import { editReducer } from './edit';
import { uiReducer } from './ui';

export default combineReducers<T.ReduxState>({
  data: dataReducer,
  ui: uiReducer,
  edit: editReducer,
});
