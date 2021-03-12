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
        if (draft.currentProjectId === action.payload.projectId) {
          return draft;
        }
        return { ...draft, currentProjectId: action.payload.projectId };
      }

      case TYPES.SET_CURRENT_SCREEN_ID: {
        if (draft.currentScreenId === action.payload.screenId) {
          return draft;
        }
        return { ...draft, currentScreenId: action.payload.screenId };
      }

      case TYPES.SET_SELECTED_ASSET_LIST_ID: {
        if (draft.selectedAssetListId === action.payload.assetListId) {
          return draft;
        }
        return {
          ...draft,
          selectedAssetListId: action.payload.assetListId,
        };
      }

      case TYPES.UPLOAD_IMAGE_FOR_NN_SUCCESS: {
        return { ...draft, uploadedImageInfo: action.payload };
      }

      case TYPES.SET_ACTIVE_ELEMENT_ID: {
        if (draft.activeElementId === action.payload) {
          return draft;
        }
        return { ...draft, activeElementId: action.payload };
      }

      case TYPES.SET_MASTER_SCREEN_ID: {
        if (draft.masterScreenId === action.payload) {
          return draft;
        }
        return { ...draft, masterScreenId: action.payload };
      }

      case TYPES.SET_HOVERED_ELEMENT: {
        if (draft.hoveredElementId === action.payload) {
          return draft;
        }
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

      case TYPES.ADD_SELECTED_ELEMENT: {
        if (!draft.selectedElementsIds.includes(action.payload.id)) {
          draft.selectedElementsIds = [
            ...draft.selectedElementsIds,
            action.payload.id,
          ];
        }
        break;
      }

      case TYPES.SET_MASTER_CORE_ELEMENT_ID: {
        draft.masterCoreElementId = action.payload.id;
        break;
      }

      case TYPES.SET_MASTER_GROUPS_ELEMENT_ID: {
        draft.masterGroupsElementId = action.payload.id;
        break;
      }
      case TYPES.SET_MASTER_ELEMENTS_IDS: {
        draft.masterGroupsElementId = action.payload.masterGroupsId;
        draft.masterCoreElementId = action.payload.masterCoreId;
        break;
      }

      case TYPES.REMOVE_SELECTED_ELEMENT: {
        draft.selectedElementsIds = draft.selectedElementsIds.filter(
          (elementId) => elementId !== action.payload.id,
        );
        break;
      }

      case TYPES.SET_SELECTED_ELEMENTS: {
        draft.selectedElementsIds = action.payload.ids;
        break;
      }

      case TYPES.SET_VIA_MODE: {
        draft.VIAMode.enabled = action.payload;
        break;
      }

      case TYPES.SET_VIA_REGIONS: {
        draft.VIAMode.regions = action.payload;
        break;
      }

      case TYPES.UPDATE_VIA_REGION: {
        draft.VIAMode.regions[action.payload.id] = {
          ...draft.VIAMode.regions[action.payload.id],
          ...action.payload.data,
        };
        break;
      }

      case TYPES.RESET_SCREEN_STATE: {
        return initialEdit;
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
