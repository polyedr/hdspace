import { combineReducers } from 'redux';

import * as T from '../types';
import { dataReducer } from './data';
import { editReducer } from './edit';

export default combineReducers<T.ReduxState>({
  data: dataReducer,
  edit: editReducer,
});
