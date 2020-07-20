import { combineReducers } from 'redux';
import { composeReducers, makeResetStateReducer } from '$shared/redux';
import undoable  from 'redux-undo';

import * as T from '../types';
import { dataReducer } from './data';
import { editReducer } from './edit';
import { uiReducer } from './ui';
import { initial } from '../initial';
import { communicationReducer } from '$redux/project/reducers/communication';
import { controlReducer } from '$redux/project/reducers/control';

export default combineReducers({
  data: dataReducer,
  ui: composeReducers([
    uiReducer, // TODO: resolve typings!
    makeResetStateReducer<T.ResetScreenState, T.ReduxState['ui']>('PROJECTS:RESET_SCREEN_STATE', initial.ui) as any,
  ]),
  edit: undoable(composeReducers([
    editReducer,
    makeResetStateReducer<T.ResetScreenState, T.ReduxState['edit']>(
      'PROJECTS:RESET_SCREEN_STATE',
      initial.edit
    ) as any,
  ])) as any, // TODO: figure out this type
  communication: communicationReducer,
  // control: controlReducer,
});
