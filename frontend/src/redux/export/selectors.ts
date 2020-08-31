/* eslint-disable import/prefer-default-export */
import { ReduxState } from './initial';

export function selectSavedElementsValues(state: ReduxState) {
  return state.savedElementsValues;
}
