import { combineReducers } from 'redux';
import marketplaceReducer from './marketplaceReducer';

export default combineReducers({
  data: marketplaceReducer,
});
