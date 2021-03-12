/* eslint-disable no-console */
import * as R from 'ramda';
import { call, put, select } from 'redux-saga/effects';
import { convertElementFromResponse } from '@Api/converters/fromResponse';
import {
  convertCreatedElementToRequest,
  convertElementToPatchRequest,
  convertElementToRequest,
} from '@Api/converters/toRequest';
import {
  apiChangeRecursiveElement,
  apiCreateElements,
  apiUpdateElement,
  apiUpdateElements,
} from '@Api/element';
import { apiCreateScenarios } from '@Api/scenario';
import {
  isElementCanBeAdded,
  isElementCanBeRemove,
  canElementHaveAllChildren,
} from '@Utils/AvailableChildrenHelper';
import { updateElementParameters } from '@Utils/ElementsTreeHelper';
import getSavedValue from '@Utils/getSavedValue';
import {
  removeMapElement,
  restoreMapElement,
  restoreMapElementChildren,
} from '@Utils/normalizedStateHelpers';

import { DEFAULT_INDENTS } from '@Domain/libraryElements/defaultStyles';
import {
  ElementsToDrop,
  Entity,
  LibraryElement,
  LibraryElementUnion,
  Normalized,
  RecursiveElement,
  Result,
  ReturnPromisedType,
  ScenarioItem,
  ServerElement,
  StateElement,
  UpdateDataActionType,
} from '@Src/types';
import {
  Action,
  ElementHistoryMeta,
  WrapIntoContainerData,
} from '@Redux/types';
import * as Actions from '../actions';
import { enqueueSnackbar } from '../../notification/actions';
import {
  selectCurrentScreen,
  selectCurrentScreenId,
} from '../selectors/screen';
import { reqWrapper } from './shared';
import {
  selectFreeCanvasMode,
  selectFreeCanvasOffset,
} from '../selectors/base';
import {
  selectActiveElement,
  selectActiveElementId,
  selectAllElements,
  selectCustomLibraryElements,
  selectElementAsTree,
  selectElementById,
  selectElementsByIds,
  // selectElementsForScreen,
  selectElementTreeGroups,
  selectScreenRootElement,
  selectTreeChildIdsByParentsIds,
} from '../selectors/element';
import withActionsHistory from '../wrappers/withActionsHistory';
import { updateOrReplaceMultipleElementsParameters } from './common';

// eslint-disable-next-line consistent-return
export function* createScenarios(scenario?: Partial<ScenarioItem>) {
  try {
    const currentScreen: ReturnType<typeof selectCurrentScreen> = yield select(
      selectCurrentScreen,
    );

    const containerToCreate: ScenarioItem = {
      parent_id: -1, // if parent_id = -1, is container that contains all other elements
      id: -100, // will be omitted and set by server
      name: 'Root',
      struct_type: 'container',
      screen: currentScreen.id,
      buoyancy: 0, // buoyancy can be omitted, cause it is can be expressed using list
      direction: 'vertical',
      elements: [],
      parameters: {
        // parent_id, do we need it? or it already expressed using parent_id placed on the upper level
        children: [], // level up into children field
      },
      styles: {
        ...DEFAULT_INDENTS,
      },
      ...scenario,
    };

    const { result, error }: Result<ScenarioItem[]> = yield call(
      reqWrapper,
      apiCreateScenarios,
      { data: [R.omit(['id'], containerToCreate)] },
    );

    if (result) {
      return result[0];
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message || 'Failed to create scenarios',
        options: { variant: 'error' },
      }),
    );
  }
}

export function* createElements(
  { elements, index }: ElementsToDrop,
  parent: LibraryElement<Entity>,
  meta: ElementHistoryMeta,
) {
  try {
    const { useHistory, screenId } = meta;
    const disallowedElements = elements.filter(
      (element) => !isElementCanBeAdded(parent, element.struct_type),
    );

    if (disallowedElements.length) {
      yield put(
        enqueueSnackbar({
          message: 'Can not add this element!',
          options: { variant: 'warning' },
        }),
      );
      return;
    }

    const isFreeCanvasMode = yield select(selectFreeCanvasMode);
    let offset = 0;
    if (isFreeCanvasMode) {
      offset = yield select(selectFreeCanvasOffset(parent.id));
    }
    // free canvas offset
    const elementsWithOffset = elements.map((el, i) => {
      if (i === 0) {
        return {
          ...el,
          parameters: {
            ...el.parameters,
            freeCanvas: {
              ...el.parameters.freeCanvas,
              left: el.parameters.freeCanvas?.left || offset,
              top: el.parameters.freeCanvas?.top || offset,
            },
          },
          styles: isFreeCanvasMode
            ? {
                ...el.styles,
                ownStyles: {
                  ...el.styles.ownStyles,
                  width: `${el.parameters.freeCanvas.width}px`,
                  height: `${el.parameters.freeCanvas.height}px`,
                },
              }
            : el.styles,
        };
      }

      return el;
    });

    const {
      result: newElements,
      error,
    }: ReturnPromisedType<typeof apiCreateElements> = yield call(
      reqWrapper,
      apiCreateElements,
      { data: elementsWithOffset },
    );
    if (newElements) {
      if (!useHistory) {
        yield put(
          Actions.addUndoActions(
            newElements.map((el: any) =>
              Actions.deleteElement(el.id, { ...meta }),
            ),
          ),
        );
      }
      const newChildren = [
        ...parent.children.map((child) => child.id),
        ...newElements.map((element) => element.id),
      ];

      const elementData = {
        name: parent.name,
        children: newChildren,
      };
      const { result, error }: Result<RecursiveElement> = yield call(
        reqWrapper,
        apiChangeRecursiveElement,
        {
          data: elementData,
          id: parent.id,
        },
      );
      if (result) {
        yield put(
          Actions.addStateElements(
            newElements,
            parent.id,
            {
              screenId,
              useHistory,
            },
            index,
          ),
        );
        if (!useHistory) {
          yield put(
            Actions.addRedoActions(
              Actions.restoreElementChildren(
                parent.id,
                newElements.map((element) => element.id),
                { ...meta, useHistory: true },
              ),
            ),
          );
        }
        yield put(
          Actions.updateLastElements(
            parent.id,
            newElements.map((el) => el.id),
            offset,
          ),
        );

        const updatedParent: LibraryElement<Entity> = yield select(
          selectElementAsTree(parent.id),
        );
        const elementsWithUpdatedBuoyancy = updatedParent.children.map(
          (child, childIndex) => {
            const createdElement = convertElementToPatchRequest(child);
            createdElement.buoyancy = childIndex + (index || 0);
            return createdElement;
          },
        );
        const { result: createdElements, error } = yield call(
          reqWrapper,
          apiUpdateElements,
          {
            data: elementsWithUpdatedBuoyancy,
          },
        );
        if (createdElements) {
          // eslint-disable-next-line consistent-return
          return createdElements.map((el) => String(el.id));
        }
        if (error) throw new Error(error);
      }
      if (error) throw new Error(error);
    }
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: {
          variant: 'error',
        },
      }),
    );
  }
}

export const createElementsSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.createElements>,
) {
  try {
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const { createdElements, parentId, index } = action.payload;

    const activeElementId: string = yield select(selectActiveElementId);
    const activeElementTree: LibraryElement<Entity> = yield select(
      selectElementAsTree(parentId || activeElementId),
    );

    const customLibraryElements = yield select(selectCustomLibraryElements);

    const elementGroups = yield select(selectElementTreeGroups);

    const createdGroupsIds: string[] = [];

    const convertedCreatedElements = createdElements.map((dEl) => {
      if (dEl.custom) {
        return convertElementToRequest(
          customLibraryElements.find((element) => element.id === dEl.id),
        );
      }
      if (dEl.parameters?.isGroup) {
        if (dEl.id) {
          createdGroupsIds.push(dEl.id);
        }
        const group = elementGroups.find((group) => group.id === dEl.id);
        return convertElementToRequest({
          ...group,
          parameters: {
            ...group.parameters,
            isGroup: false,
          },
        });
      }
      return convertCreatedElementToRequest(
        dEl.type as Entity,
        dEl.name || null,
        null,
        dEl.parameters,
      );
    });

    const elementsIds = yield call(
      createElements,
      { elements: convertedCreatedElements, index },
      activeElementTree,
      {
        ...action.meta,
      },
    );

    if (createdGroupsIds.length) {
      const updatedElements = yield select(selectElementsByIds(elementsIds));
      const newGroupElements = updatedElements.filter((el) => {
        return !!el.parameters.sourceElementId;
      });

      const allChildIds = yield select(
        selectTreeChildIdsByParentsIds(
          newGroupElements.reduce((allChildIds, element) => {
            return [...allChildIds, ...element.children];
          }, []),
        ),
      );

      const elements = yield select(selectAllElements);

      const paramsToUpdate = allChildIds.reduce((params, childId) => {
        const newElement = elements[childId];
        const sourceElement = elements[newElement.parameters?.sourceElementId];
        if (!sourceElement) {
          return params;
        }
        return {
          ...params,
          [sourceElement.id]: {
            groupElements: [
              ...(sourceElement.parameters?.groupElements || []),
              newElement.id,
            ],
          },
        };
      }, {});

      yield call(
        updateOrReplaceMultipleElementsParameters,
        Actions.updateMultipleElementsParameters(
          Object.keys(paramsToUpdate),
          paramsToUpdate,
          {
            ...action.meta,
          },
        ),
        UpdateDataActionType.UPDATE,
      );
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const addChildrenToElementSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.addChildrenToElement>,
) {
  try {
    const { children, elementId } = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const convertedCreatedChildren = children.map((child) =>
      convertElementToRequest(
        updateElementParameters(
          '-1',
          child.parameters,
          convertElementFromResponse(
            convertCreatedElementToRequest(child.childType, null),
          ),
        ),
      ),
    );

    const element: LibraryElement<Entity> = yield select(
      selectElementAsTree(elementId),
    );

    yield call(
      createElements,
      { elements: convertedCreatedChildren },
      element,
      {
        ...action.meta,
      },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const addChildToElementSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.addChildToElement>,
) {
  try {
    const { childType, elementId, parameters } = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const convertedCreatedChild = convertCreatedElementToRequest(
      childType,
      null,
    );
    const createdChild = convertElementFromResponse(convertedCreatedChild);
    const childWithUpdatedParameters = updateElementParameters(
      '-1',
      parameters,
      createdChild,
    );
    const convertedChildWithUpdatedParameters = convertElementToRequest(
      childWithUpdatedParameters,
    );

    const element: LibraryElement<Entity> = yield select(
      selectElementAsTree(elementId),
    );

    yield call(
      createElements,
      { elements: [convertedChildWithUpdatedParameters] },
      element,
      {
        ...action.meta,
      },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const softDeleteSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.deleteElement>,
) {
  try {
    const { id } = action.payload;

    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    const element: StateElement = yield select(selectElementById(id));

    if (!element.parent) return;

    const parent: LibraryElement<Entity> = yield select(
      selectElementAsTree(element.parent),
    );

    if (!isElementCanBeRemove(parent, element.type as Entity)) {
      yield put(
        enqueueSnackbar({
          message: 'Can not remove this element!',
          options: { variant: 'warning' },
        }),
      );
      return;
    }

    if (!useHistory) {
      const undoActions: Action[] = [
        Actions.restoreElementChildren(
          parent.id,
          parent.children.map((child) => child.id),
          { ...action.meta },
        ),
      ];
      if (element.shared === true) {
        undoActions.push(
          Actions.updateElement(
            {
              elementID: id,
              data: { shared: true },
            },
            { ...action.meta },
          ),
        );
      }
      yield put(Actions.addUndoActions(undoActions));
    }

    const activeElementId = yield select(selectActiveElementId);
    const root: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screenId),
    );

    if (activeElementId === id) {
      yield put(Actions.setActiveElement(root.id));
    }

    const state = yield select(selectAllElements);
    yield put(
      Actions.updateElementsTree(removeMapElement(state, id), {
        ...action.meta,
      }),
    );

    const updatedParent: LibraryElement<any> = yield select(
      selectElementAsTree(parent.id),
    );

    const { result, error }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: { children: updatedParent.children.map((child) => child.id) },
        id: parent.id,
      },
    );

    if (result) {
      yield put(
        Actions.updateElement(
          { elementID: id, data: { shared: false } },
          { ...action.meta },
        ),
      );

      const convertedElements = updatedParent.children.map((child) =>
        convertElementToPatchRequest(child),
      );

      yield call(reqWrapper, apiUpdateElements, { data: convertedElements });
    }
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const restoreElementChildrenSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.restoreElementChildren>,
) {
  try {
    const { elementId, childrenIds } = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    const element: StateElement = yield select(selectElementById(elementId));

    if (!useHistory) {
      yield put(
        Actions.addUndoActions(
          childrenIds.map((id) =>
            Actions.deleteElement(id, { ...action.meta, screenId }),
          ),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);

    yield put(
      Actions.updateElementsTree(
        restoreMapElementChildren(state, elementId, childrenIds),
        { ...action.meta },
      ),
    );

    const updatedElement: LibraryElement<any> = yield select(
      selectElementAsTree(elementId),
    );

    const convertedElements = updatedElement.children.map((child) =>
      convertElementToPatchRequest(child),
    );

    const { error: changeError } = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: {
          children: [...element.children, elementId],
        },
        id: elementId,
      },
    );
    if (changeError) throw new Error(changeError);

    const { error: updateError } = yield call(reqWrapper, apiUpdateElements, {
      data: convertedElements,
    });
    if (updateError) throw new Error(updateError);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export function* restoreElementSaga(
  action: ReturnType<typeof Actions.restoreElement>,
) {
  try {
    const elementId = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { useHistory } = action.meta;
    const element: StateElement = yield select(selectElementById(elementId));

    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.deleteElement(elementId, { ...action.meta }),
        ]),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);

    yield put(
      Actions.updateElementsTree(restoreMapElement(state, elementId), {
        ...action.meta,
      }),
    );

    const { error }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: {
          children: [...element.children, elementId],
        },
        id: elementId,
      },
    );
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* addElementToElement(elementId: string, parentId: string) {
  try {
    const parent: StateElement = yield select(selectElementById(parentId));

    const parentData = {
      name: parent.name,
      children: [...new Set([...parent.children, elementId])],
    };

    const { error }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: parentData,
        id: parent.id,
      },
    );
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

// eslint-disable-next-line consistent-return
export function* wrapIntoContainer(
  { containerType, name, ids }: WrapIntoContainerData,
  meta: ElementHistoryMeta,
) {
  try {
    const elements = yield select(selectElementsByIds(ids));
    const activeElement = yield select(selectActiveElement);
    if (elements.find((el) => el.parent !== activeElement.parent)) {
      console.error('Can wrap only elements with same parent');
      yield put(
        enqueueSnackbar({
          message: 'Can not add this element!',
          options: { variant: 'error' },
        }),
      );
    }
    const canWrap =
      canElementHaveAllChildren(containerType) || containerType === 'group';
    if (!canWrap) {
      yield put(
        enqueueSnackbar({
          message: 'Can not add this element!',
          options: { variant: 'warning' },
        }),
      );
    }
    const serverContainer = convertCreatedElementToRequest(
      containerType,
      null,
      name,
    );

    const {
      result: createdContainers,
    }: ReturnPromisedType<typeof apiCreateElements> = yield call(
      reqWrapper,
      apiCreateElements,
      { data: [serverContainer] },
    );

    if (createdContainers) {
      yield put(
        Actions.wrapStateElements(
          createdContainers[0],
          activeElement.parent,
          ids,
          {
            ...meta,
          },
        ),
      );
      if (!meta?.useHistory) {
        yield put(
          Actions.addUndoActions(
            Actions.unwrapFromContainer(
              ids,
              createdContainers[0].id,
              activeElement.parent,
              {
                ...meta,
              },
            ),
          ),
        );
      }

      const updatedParent: LibraryElement<any> = yield select(
        selectElementAsTree(activeElement.parent),
      );
      const updatedWrapper: LibraryElement<any> = yield select(
        selectElementAsTree(createdContainers[0].id),
      );

      const { error: parentError }: Result<RecursiveElement> = yield call(
        reqWrapper,
        apiChangeRecursiveElement,
        {
          data: { children: updatedParent.children.map((child) => child.id) },
          id: updatedParent.id,
        },
      );
      if (parentError) throw new Error(parentError);

      const { error: wrapperError }: Result<RecursiveElement> = yield call(
        reqWrapper,
        apiChangeRecursiveElement,
        {
          data: { children: updatedWrapper.children.map((child) => child.id) },
          id: updatedWrapper.id,
        },
      );

      if (wrapperError) throw new Error(parentError);

      const convertedElements = [
        ...updatedParent.children.map((child) =>
          convertElementToPatchRequest(child),
        ),
        ...updatedWrapper.children.map((child) =>
          convertElementToPatchRequest(child),
        ),
      ];

      const { error }: Result<ServerElement<any>> = yield call(
        reqWrapper,
        apiUpdateElements,
        { data: convertedElements },
      );
      if (error) throw new Error(error);
    }
    if (createdContainers) {
      return createdContainers.map(({ id }) => id);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }),
    );
  }
}

export const wrapIntoContainerSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.wrapIntoContainer>,
) {
  try {
    const { id } = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const element = yield select(selectElementById(id));
    const parent = yield select(selectElementById(element.parent));

    const ids = yield call(
      wrapIntoContainer,
      {
        containerType: 'container',
        name: null,
        ids: [id],
      },
      {
        ...action.meta,
      },
    );

    if (ids && !action.meta.useHistory) {
      yield put(
        Actions.addUndoActions(
          Actions.unwrapFromContainer([id], ids[0], parent.id, {
            ...action.meta,
          }),
        ),
      );
    }
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const unwrapFromContainerSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.unwrapFromContainer>,
) {
  try {
    const { meta } = action;
    if (!meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { wrapperId, parentId, ids } = action.payload;
    yield put(
      Actions.unwrapStateElements(ids, parentId, wrapperId, { ...meta }),
    );

    const parent = yield select(selectElementAsTree(parentId));

    const { error: parentError }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: { children: parent.children.map((child) => child.id) },
        id: parentId,
      },
    );

    if (parentError) throw new Error(parentError);

    const convertedElements = parent.children.map((child) =>
      convertElementToPatchRequest(child),
    );

    const { error: elementsError }: Result<ServerElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data: convertedElements,
      },
    );
    if (elementsError) throw new Error(elementsError);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export function* updateElementSaga(
  action: ReturnType<typeof Actions.updateElement>,
) {
  try {
    const screenId = yield select(selectCurrentScreenId);
    const { elementID, data } = action.payload;

    yield put(
      Actions.updateStateElement(
        elementID,
        { ...data },
        {
          ...action.meta,
          screenId,
        },
      ),
    );

    const updatedElement: LibraryElement<any> = yield select(
      selectElementAsTree(elementID),
    );

    const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
    yield put(Actions.updateSavedElementValues(elementID, savedValue));

    if (action.payload.active) {
      yield put(Actions.setActiveElement(elementID));
    }

    const customLibraryElements = yield select(selectCustomLibraryElements);
    const existsInLibrary = !!customLibraryElements.find(
      (element) => element.id === action.payload.elementID,
    );
    if (data.shared === true) {
      if (!existsInLibrary) {
        yield put(Actions.addCustomElement(updatedElement));
      }
    } else if (existsInLibrary) {
      yield put(Actions.removeCustomElement(action.payload.elementID));
    }

    const convertedElement = convertElementToPatchRequest(updatedElement);

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElement,
      {
        data: convertedElement,
        id: elementID,
      },
    );

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export const redoWrapIntoContainerSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.redoWrapIntoContainer>,
) {
  try {
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { parentId, wrapperId, ids } = action.payload;
    const { screenId } = action.meta;

    const wrapper: LibraryElement<any> = yield select(
      selectElementAsTree(wrapperId),
    );

    yield put(
      Actions.wrapStateElements(wrapper, parentId, ids, {
        ...action.meta,
        screenId,
        useHistory: true,
      }),
    );

    const updatedParent: LibraryElement<any> = yield select(
      selectElementAsTree(parentId),
    );
    const updatedWrapper: LibraryElement<any> = yield select(
      selectElementAsTree(wrapperId),
    );

    const { error: wrapperError }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: { children: ids },
        id: wrapperId,
      },
    );

    if (wrapperError) throw new Error(wrapperError);

    const { error: parentError }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: { children: updatedParent.children.map((child) => child.id) },
        id: parentId,
      },
    );

    if (parentError) throw new Error(parentError);

    const convertedElements = [
      ...updatedParent.children.map((child) =>
        convertElementToPatchRequest(child),
      ),
      ...updatedWrapper.children.map((child) =>
        convertElementToPatchRequest(child),
      ),
    ];

    const { error }: Result<ServerElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      { data: convertedElements },
    );

    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});
