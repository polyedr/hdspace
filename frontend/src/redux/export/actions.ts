import { SavedElementsValues, UpdateSavedElementsValues, UpdateSavedElementValues } from "$redux/project/types";

export const updateSavedElementsValues = (elementsValues: SavedElementsValues): UpdateSavedElementsValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENTS_VALUES',
  payload: { elementsValues },
});

export const updateSavedElementValues = (itemID: string, savedValue: string): UpdateSavedElementValues => ({
  type: 'PROJECTS:UPDATE_SAVED_ELEMENT_VALUES',
  payload: { itemID, savedValue },
});