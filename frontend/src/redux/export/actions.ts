import TYPES from '../../constants/actions';
import {
  SavedElementsValues,
  UpdateSavedElementsValues,
  UpdateSavedElementValues,
} from '../../types';

export const updateSavedElementsValues = (
  elementsValues: SavedElementsValues,
): UpdateSavedElementsValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENTS_VALUES,
  payload: { elementsValues },
});

export const updateSavedElementValues = (
  itemID: string,
  savedValue: string,
): UpdateSavedElementValues => ({
  type: TYPES.UPDATE_SAVED_ELEMENT_VALUES,
  payload: { itemID, savedValue },
});
