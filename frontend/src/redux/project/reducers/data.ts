import produce, { Draft } from 'immer';
import {
  addMapElements,
  arrayToMap,
  extractMapElement,
  flattenElements,
  insertMapElement,
  moveMapElement,
  removeMapElement,
  updateMapElement,
} from '@Utils/normalizedStateHelpers';
import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';
import { initialData } from '../initial';
import TYPES from '../../actionTypes';
import { Project, Screen } from '../../../types';
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

      case TYPES.UPDATE_STATE_ELEMENT: {
        const { elementId, data } = action.payload;
        draft.elements = updateMapElement(draft.elements, elementId, data);
        break;
      }

      case TYPES.ADD_STATE_ELEMENTS: {
        const { elements, parentId, index } = action.payload;
        draft.elements = addMapElements(
          draft.elements,
          elements,
          parentId,
          index,
        );
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
        draft.screens = arrayToMap<Screen>(action.payload.screens);
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

        draft.elements = {
          ...draft.elements,
          ...flattenElements(elements, parentId),
        };

        if (parentId) {
          draft.elements[parentId].children = [
            ...new Set([
              ...draft.elements[parentId].children,
              ...elements.map((el) => el.id),
            ]),
          ];
        }
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
          action.payload.element,
          ...draft.customElementsData.results,
        ];
        break;
      case TYPES.REMOVE_CUSTOM_ELEMENT:
        draft.customElementsData.results = draft.customElementsData.results.filter(
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
        break;
      }

      case TYPES.SET_ASSETS: {
        const { listId } = action.payload;
        draft.assetResults = {
          ...draft.assetResults,
          [listId]: action.payload.assets,
        };
        break;
      }

      case TYPES.ADD_ASSET_LIST_REDUX: {
        draft.assetLists = {
          ...draft.assetLists,
          results: [action.payload, ...draft.assetLists.results],
        };
        break;
      }

      case TYPES.ADD_ASSET_REDUX: {
        draft.assetResults = {
          ...draft.assetResults,
          [action.payload.listId]: {
            ...draft.assetResults[action.payload.listId],
            results: [
              action.payload.asset,
              ...draft.assetResults[action.payload.listId].results,
            ],
          },
        };

        // update all images section, should be removed in the future
        draft.assetResults[DEFAULT_ASSETS_LIST_ID].results = [
          action.payload.asset,
          ...draft.assetResults[DEFAULT_ASSETS_LIST_ID].results,
        ];
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
