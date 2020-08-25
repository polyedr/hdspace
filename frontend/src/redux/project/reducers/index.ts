import { combineReducers } from 'redux';
import { composeReducers, makeResetStateReducer } from '$shared/redux';
import * as T from '../types';
import dataReducer from './data';
import editReducer from './edit';
import uiReducer from './ui';
import { initialEdit, initialUi } from '../initial';
import communicationReducer from '$redux/project/reducers/communication';
import controlReducer from '$redux/project/reducers/control';
import TYPES from '$constants/actions';

export default combineReducers({
  data: dataReducer,
  ui: composeReducers([
    uiReducer, // TODO: resolve typings!
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
