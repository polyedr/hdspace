import { pick } from 'ramda';
import produce, { current, Draft } from 'immer';
import { Normalized, VIARegion } from '@Src/types';
import { sortByLayer } from '@Utils/viaHelpers';
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
          ...pick(
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

      case TYPES.SET_ACTIVE_NN_MODEL: {
        if (draft.activeNNModel === action.payload.model) {
          return draft;
        }
        return { ...draft, activeNNModel: action.payload.model };
      }

      case TYPES.IS_LIBRARY_TAB: {
        if (draft.isLibraryTab === action.payload.isLibraryTab) {
          return draft;
        }
        return { ...draft, isLibraryTab: action.payload.isLibraryTab };
      }

      case TYPES.UPDATE_VIA_REGION_SUCCESS: {
        draft.VIAMode.regions[draft.activeNNModel][action.payload.id] = {
          ...draft.VIAMode.regions[draft.activeNNModel][action.payload.id],
          ...action.payload.data,
        };
        break;
      }

      case TYPES.SET_ACTIVE_VIA_REGION: {
        draft.VIAMode.activeRegionId = action.payload.id;
        if (action.payload.isUpdatingLayer) {
          draft.VIAMode.regions[draft.activeNNModel][
            action.payload.id
          ].layer = 0;
          Object.keys(draft.VIAMode.regions[draft.activeNNModel]).forEach(
            (regionId, index) => {
              if (
                draft.VIAMode.regions[draft.activeNNModel][
                  regionId
                ].id.toString() !== action.payload.id
              )
                draft.VIAMode.regions[draft.activeNNModel][regionId].layer =
                  index + 1;
            },
          );
        }
        break;
      }

      case TYPES.CREATE_VIA_REGION_SUCCESS: {
        const { payload: newRegion } = action;
        draft.VIAMode.regions[draft.activeNNModel][newRegion.id] = newRegion;
        break;
      }

      case TYPES.DELETE_VIA_REGION_SUCCESS: {
        delete draft.VIAMode.regions[draft.activeNNModel][action.payload];
        break;
      }

      case TYPES.SET_ANNOTATED_ELEMENT_ID: {
        draft.VIAMode.annotatedElementId = action.payload;
        break;
      }

      case TYPES.UPDATE_VIA_REGION_LAYER_SUCCESS: {
        const { id, layer } = action.payload;
        const arr = Object.values(
          current(draft.VIAMode.regions[draft.activeNNModel]),
        ).sort(sortByLayer);

        const startIndex = draft.VIAMode.regions[draft.activeNNModel][id].layer;

        const [target] = arr.splice(startIndex, 1);

        arr.splice(layer, 0, target);

        draft.VIAMode.regions[draft.activeNNModel] = arr.reduce<
          Normalized<VIARegion>
        >((acc, curr, i) => {
          acc[curr.id] = {
            ...curr,
            layer: i,
          };
          return acc;
        }, {});

        break;
      }

      case TYPES.SET_ANNOTATED_IMAGE_URL: {
        draft.VIAMode.annotatedImageFile = action.payload;
        break;
      }

      case TYPES.COPY_VIA_REGION: {
        const copy =
          draft.VIAMode.regions[draft.activeNNModel][
            draft.VIAMode.activeRegionId
          ];
        if (copy) {
          draft.VIAMode.copiedRegion = {
            ...copy,
          };
        }
        break;
      }

      case TYPES.SET_PRESELECTED_ELEMENT_ID: {
        if (draft.preSelectedElementId !== action.payload) {
          draft.preSelectedElementId = action.payload;
        }
        break;
      }

      case TYPES.SET_MASTER_SOURCE_ELEMENT_ID: {
        if (draft.masterSourceElementId !== action.payload) {
          draft.masterSourceElementId = action.payload;
        }
        break;
      }

      case TYPES.SET_VIA_RESULT_ID: {
        draft.VIAMode.resultId = action.payload;
        break;
      }

      case TYPES.SET_BLOCK_TYPE: {
        draft.VIAMode.blockType = action.payload;
        break;
      }

      case TYPES.SET_VIA_DATA: {
        draft.VIAMode.viaData.fdict = {
          [action.payload.value.fdict.key]: action.payload.value.fdict.value,
        };
        draft.VIAMode.viaData.fordict = {
          [action.payload.value.fordict.key]:
            action.payload.value.fordict.value,
        };
        draft.VIAMode.viaData.opencvdict = {
          [action.payload.value.opencvdict.key]:
            action.payload.value.opencvdict.value,
        };
        draft.VIAMode.viaData.cnndict = {
          [action.payload.value.cnndict.key]:
            action.payload.value.cnndict.value,
        };
        break;
      }

      case TYPES.FINISH_ANNOTATION: {
        draft.VIAMode = initialEdit.VIAMode;
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
