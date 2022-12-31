import produce, { Draft } from 'immer';
import {
  addMapElements,
  arrayToMap,
  extractMapElement,
  flattenElements,
  insertMapElement,
  insertMapElementWrapper,
  moveMapElement,
  removeMapElement,
  removeMapElementWrapper,
  updateMapElement,
} from '@Utils/normalizedStateHelpers';
import { Project, Screen } from '@Src/types';
import { initialData } from '../initial';
import TYPES from '../../actionTypes';
import { Action, ProjectDataState } from '../../types';

const dataReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: Draft<ProjectDataState> = initialData, action: Action) => {
    switch (action.type) {
      case TYPES.UPDATE_ELEMENTS_TREE: {
        draft.elements = {
          ...draft.elements,
          ...action.payload,
        };
        break;
      }

      case TYPES.SET_IMAGE_PALETTE: {
        draft.imagePalette = action.payload;
        break;
      }
      case TYPES.MOVE_STATE_ELEMENT: {
        const { elementId, indices, parents } = action.payload;
        draft.elements = moveMapElement(
          draft.elements,
          elementId,
          indices,
          parents,
        );
        break;
      }

      case TYPES.MOVE_STATE_ELEMENTS_INSIDE: {
        const { ids, parents } = action.payload;
        const { oldParentId, newParentId } = parents;
        draft.elements[oldParentId].children = draft.elements[
          oldParentId
        ].children.filter((childId) => !ids.includes(childId));
        draft.elements[oldParentId].children.forEach((childId, index) => {
          draft.elements[childId].buoyancy = index;
        });
        draft.elements[newParentId].children = [
          ...draft.elements[newParentId].children,
          ...ids,
        ];
        draft.elements[newParentId].children.forEach((childId, index) => {
          draft.elements[childId].buoyancy = index;
        });
        break;
      }

      case TYPES.UPDATE_STATE_ELEMENT: {
        const { elementId, data } = action.payload;
        draft.elements = updateMapElement(draft.elements, elementId, data);
        break;
      }

      case TYPES.UPDATE_MULTIPLE_STATE_ELEMENTS: {
        const { elements } = action.payload;
        draft.elements = {
          ...draft.elements,
          ...elements,
        };
        break;
      }

      case TYPES.ADD_STATE_ELEMENTS: {
        const { elements } = action.payload;
        const { index } = action.meta;

        if (index === undefined) {
          draft.elements = addMapElements(draft.elements, elements);
        } else {
          elements.forEach((element) => {
            element.index = index;
          });

          draft.elements = addMapElements(draft.elements, elements);
        }

        break;
      }

      case TYPES.INSERT_STATE_ELEMENT: {
        const { parentId, childId, element } = action.payload;
        draft.elements = insertMapElement(
          draft.elements,
          element,
          parentId,
          childId,
        );
        break;
      }

      case TYPES.SET_PROJECT_ERROR: {
        const { errorResponse } = action.payload;
        draft.createProjectError = errorResponse;
        break;
      }

      case TYPES.WRAP_STATE_ELEMENTS: {
        const { parentId, childIds, element } = action.payload;
        draft.elements = insertMapElementWrapper(
          draft.elements,
          element,
          parentId,
          childIds,
        );
        break;
      }

      case TYPES.UNWRAP_STATE_ELEMENTS: {
        const { parentId, childIds, wrapperId } = action.payload;
        draft.elements = removeMapElementWrapper(
          draft.elements,
          wrapperId,
          parentId,
          childIds,
        );
        break;
      }

      case TYPES.REMOVE_STATE_ELEMENT: {
        const { elementId } = action.payload;
        draft.elements = removeMapElement(draft.elements, elementId);
        break;
      }

      case TYPES.EXTRACT_STATE_ELEMENT: {
        const elementId = action.payload;
        draft.elements = extractMapElement(draft.elements, elementId);
        break;
      }

      case TYPES.SET_PROJECT_LIST: {
        draft.projectsData.results = arrayToMap<Project>(
          action.payload.projects,
        );
        break;
      }

      case TYPES.SET_PROJECT_SEARCH_PARAMETER: {
        draft.projectsData.parameter = action.payload;
        break;
      }

      case TYPES.SET_PROJECTS_DATA: {
        const { results, next, previous } = action.payload;
        draft.projectsData.results = {
          ...draft.projectsData.results,
          ...arrayToMap(results),
        };
        draft.projectsData.next = next;
        draft.projectsData.previous = previous;
        break;
      }

      case TYPES.SET_PROJECT_LIST_LOADER: {
        draft.projectsData.loading = action.payload.active;
        break;
      }

      case TYPES.SET_PROJECT: {
        draft.projectsData.results = {
          ...draft.projectsData.results,
          [action.payload.project.id]: action.payload.project,
        };
        break;
      }

      case TYPES.SET_SCREENS: {
        const data = arrayToMap<Screen>(action.payload.screens);
        draft.screens = data;
        break;
      }

      case TYPES.UPDATE_SCREEN: {
        const { screen } = action.payload;

        draft.screens[screen.id] = {
          ...draft.screens[screen.id],
          ...screen,
        };
        break;
      }

      case TYPES.ADD_ELEMENTS: {
        const { parentId, elements } = action.payload;

        if (parentId) {
          draft.elements[parentId].children = [
            ...new Set([
              ...draft.elements[parentId].children,
              ...elements.map((el) => el.id),
            ]),
          ];
        }

        draft.elements = {
          ...draft.elements,
          ...flattenElements(elements, parentId),
        };

        break;
      }

      case TYPES.UPDATE_CUSTOM_ELEMENTS_LOADING:
        draft.customElementsData.loading = action.payload.loading;

        break;

      case TYPES.ADD_CUSTOM_ELEMENTS_PAGE:
        draft.customElementsData.next = action.payload.paginatedResult.next;
        draft.customElementsData.previous =
          action.payload.paginatedResult.previous;
        draft.customElementsData.results = [
          ...(action.payload.initial ? [] : draft.customElementsData.results),
          ...action.payload.paginatedResult.results,
        ];
        draft.customElementsData.loading = false;
        break;
      case TYPES.ADD_CUSTOM_ELEMENT:
        draft.customElementsData.results = [
          ...draft.customElementsData.results,
          action.payload.element,
        ];
        break;
      case TYPES.REMOVE_CUSTOM_ELEMENT:
        draft.customElementsData.results =
          draft.customElementsData.results.filter(
            (elementData) => elementData.id !== action.payload.id,
          );
        break;

      case TYPES.ADD_FILE_INPUT: {
        draft.elementInputs[action.payload.id] = action.payload.file;
        break;
      }
      case TYPES.REMOVE_FILE_INPUT: {
        delete draft.elementInputs[action.payload.id];
        break;
      }

      case TYPES.SET_ASSET_LISTS: {
        draft.assetLists = action.payload;
        draft.assetResults = {};
        break;
      }

      case TYPES.SET_ASSETS: {
        const { listId } = action.payload;
        draft.assetResults = {
          ...draft.assetResults,
          [listId]: {
            ...action.payload.assets,
            results: [
              ...(draft.assetResults[listId]
                ? draft.assetResults[listId].results
                : []),
              ...action.payload.assets.results,
            ],
          },
        };
        break;
      }

      case TYPES.ADD_STATE_ASSET_LIST: {
        draft.assetLists = {
          ...draft.assetLists,
          results: [
            action.payload,
            ...(draft.assetLists ? draft.assetLists.results : []),
          ],
        };
        break;
      }

      case TYPES.ADD_STATE_ASSET: {
        const { listId, asset } = action.payload;
        if (draft.assetResults[listId]) {
          draft.assetResults = {
            ...draft.assetResults,
            [listId]: {
              ...draft.assetResults[listId],
              results: [asset, ...draft.assetResults[listId].results],
            },
          };
        }
        break;
      }

      case TYPES.REMOVE_ASSET_LIST_REDUX: {
        draft.assetLists.results.splice(
          draft.assetLists.results.findIndex(
            (assetList) => assetList.id === action.payload,
          ),
          1,
        );
        delete draft.assetResults[action.payload];
        break;
      }

      case TYPES.SET_IMAGE_LIST: {
        const { valueImage } = action.payload;
        draft.assetImageList = valueImage;
        break;
      }

      case TYPES.SET_BACKGROUND_LIST: {
        const { backGroundValue } = action.payload;
        draft.backGroundAssetsList = backGroundValue;
        break;
      }

      case TYPES.REMOVE_ASSET_REDUX: {
        const { id, listId } = action.payload;
        if (draft.assetResults[listId]) {
          draft.assetResults[listId].results = draft.assetResults[
            listId
          ].results.filter((asset) => asset.id !== id);
        }
        break;
      }

      case TYPES.UPDATE_STATE_ASSET_IMAGE: {
        const { assetId, listId, imageUrl } = action.payload;
        const asset = draft.assetResults[listId].results.find(
          (asset) => asset.id === assetId,
        );
        if (!asset) {
          return draft;
        }
        const listAssetIndex = draft.assetResults[listId].results.findIndex(
          (res) => res.id === asset.id,
        );
        const listResults = draft.assetResults[listId].results;
        asset.image = imageUrl;
        draft.assetResults[listId].results = [
          ...listResults.slice(0, listAssetIndex - 1),
          asset,
          ...listResults.slice(listAssetIndex + 1),
        ];
        break;
      }

      case TYPES.RESET_SCREEN_STATE: {
        draft.screens = {};
        draft.elements = {};
        break;
      }

      case TYPES.LOGOUT: {
        return initialData;
      }

      default:
        return draft;
    }
  },
);

export default dataReducer;
