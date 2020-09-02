import { SavedElementsValues } from '../project/types';

export type ReduxState = {
  savedElementsValues: SavedElementsValues;
};

export const initial: ReduxState = {
  savedElementsValues: {},
};
