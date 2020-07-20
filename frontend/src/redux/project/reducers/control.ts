import { StateWithHistory } from 'redux-undo';
import { initial } from '$redux/project/initial';
import * as T from '../types';

export const controlReducer = (state: StateWithHistory<typeof initial.control>, action: T.Action) => {
  switch (action.type) {
    default:
      return state;
  }
}