import { SavedElementsValues } from '../../types';

export type ReduxState = {
  savedElementsValues: SavedElementsValues;
};

export const initial: ReduxState = {
  savedElementsValues: {},
};
