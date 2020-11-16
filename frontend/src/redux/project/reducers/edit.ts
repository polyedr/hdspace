import * as R from 'ramda';
import produce, { Draft } from 'immer';
import { initialEdit } from '../initial';
import TYPES from '../../actionTypes';
import { Action, ProjectEditState } from '../../types';

const editReducer = produce(
  (
    draft: Draft<ProjectEditState> = initialEdit,
    action: Action,
    // eslint-disable-next-line consistent-return
  ) => {
    switch (action.type) {
      case TYPES.CLEAN_AFTER_PREV_SCREEN: {
        return {
          ...draft,
          ...R.pick(
            [
              'currentScreen',
              'scenarios',
              'scenarioElements',
              'modifyElements',
            ],
            initialEdit,
          ),
        };
      }

      case TYPES.SET_CURRENT_PROJECT_ID: {
        return { ...draft, currentProjectId: action.payload.projectId };
      }

      case TYPES.SET_NOTIFICATION: {
        return { ...draft, notification: action.payload };
      }

      case TYPES.REMOVE_NOTIFICATION: {
        return { ...draft, notification: null };
      }

      case TYPES.SET_CURRENT_SCREEN_ID: {
        return { ...draft, currentScreenId: action.payload.screenId };
      }

      case TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS: {
        return { ...draft, uploadedImageInfo: action.payload };
      }

      case TYPES.SET_ACTIVE_ELEMENT_ID: {
        return { ...draft, activeElementId: action.payload };
      }

      case TYPES.SET_ELEMENT_BEING_EDITED: {
        return { ...draft, elementBeingEdited: action.payload };
      }

      case TYPES.SET_HOVERED_ELEMENT: {
        return { ...draft, hoveredElementId: action.payload };
      }

      case TYPES.CHANGE_FREE_CANVAS_MODE: {
        return {
          ...draft,
          freeCanvas: {
            ...draft.freeCanvas,
            enabled: action.payload,
          },
        };
      }

      case TYPES.UPDATE_LAST_ELEMENTS: {
        const { parentId, ids, offset } = action.payload;
        draft.freeCanvas.lastElements[parentId] = { elements: ids, offset };
        break;
      }

      case TYPES.LOGOUT: {
        return {
          ...initialEdit,
        };
      }

      default:
        return draft;
    }
  },
);

export default editReducer;
