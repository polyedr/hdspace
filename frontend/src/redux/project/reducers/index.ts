import { combineReducers } from 'redux';
import dataReducer from './data';
import TYPES from '../../../constants/actions';
import { initialEdit, initialUi } from '../initial';
import controlReducer from './control';
import editReducer from './edit';
import communicationReducer from './communication';
import { composeReducers, makeResetStateReducer } from '../../../shared/redux';
import uiReducer from './ui';
import * as T from '../types';

export default combineReducers({
  data: dataReducer,
  ui: composeReducers([
    uiReducer,
    makeResetStateReducer<T.ResetScreenState, T.ProjectUiState>(
      TYPES.RESET_SCREEN_STATE,
      initialUi,
    ) as any,
  ]),
  edit: composeReducers([
    editReducer,
    makeResetStateReducer<T.ResetScreenState, T.ProjectEditState>(
      TYPES.RESET_SCREEN_STATE,
      initialEdit,
    ) as any,
  ]),
  communication: communicationReducer,
  control: controlReducer,
});
