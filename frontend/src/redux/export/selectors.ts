import { ReduxState } from "./initial";

export function selectSavedElementsValues(state: ReduxState) {
  return state.savedElementsValues;
};
