import { combineReducers } from 'redux';
import { composeReducers, makeResetStateReducer } from '$shared/redux';

import * as T from '../types';
import { dataReducer } from './data';
import { editReducer } from './edit';
import { uiReducer } from './ui';
import { initial } from '../initial';

export default combineReducers({
  data: dataReducer,
  ui: composeReducers([
    uiReducer, // TODO: resolve typings!
    makeResetStateReducer<T.ResetScreenState, T.ReduxState['ui']>('PROJECTS:RESET_SCREEN_STATE', initial.ui) as any,
  ]),
  edit: composeReducers([
    editReducer,
    makeResetStateReducer<T.ResetScreenState, T.ReduxState['edit']>(
      'PROJECTS:RESET_SCREEN_STATE',
      initial.edit
    ) as any,
  ]),
});
