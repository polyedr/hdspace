/* eslint-disable no-console */

import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';
import {
  selectCustomLibraryElements,
  selectActiveElementId,
  selectAllElements,
  selectElementAsTree,
  selectElementById,
  selectCurrentScreenId,
  selectElementsForScreen,
  selectScreenRootElement,
  selectFreeCanvasMode,
  selectFreeCanvasOffset,
} from '../selectors';
import * as Actions from '../actions';
import { selectors } from '..';
import { updateElementParameters } from '../../../utils/ElementsTreeHelper';
import {
  convertCreatedElementToRequest,
  convertElementToPatchRequest,
  convertElementToRequest,
} from '../../../api/converters/toRequest';
import {
  apiCreateElements,
  apiUpdateElement,
  apiChangeRecursiveElement,
  apiUpdateElements,
} from '../../../api/element';
import {
  isElementCanBeAdded,
  isElementCanBeRemove,
} from '../../../utils/AvailableChildrenHelper';
import { apiCreateScenarios } from '../../../api/scenario';
import { convertElementFromResponse } from '../../../api/converters/fromResponse';
import getSavedValue from '../../../utils/getSavedValue';
import {
  removeMapElement,
  restoreMapElement,
  restoreMapElementChildren,
} from '../../../utils/normalizedStateHelpers';
import {
  ElementsToDrop,
  Entity,
  ScenarioItem,
  LibraryElement,
  LibraryElementUnion,
  Normalized,
  Result,
  ReturnPromisedType,
  StateElement,
  RecursiveElement,
  ServerElement,
} from '../../../types';
import { DEFAULT_INDENTS } from '../../../domain/libraryElements/defaultStyles';
import { reqWrapper } from './shared';
import { Action, ElementHistoryMeta } from '../../types';
import { enqueueSnackbar } from '../../notification/actions';

// eslint-disable-next-line consistent-return
export function* createScenarios(scenario?: Partial<ScenarioItem>) {
  try {
    const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
      selectors.selectCurrentScreen,
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
  { screenId, undo }: ElementHistoryMeta,
) {
  try {
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
      if (i === 0)
        return {
          ...el,
          parameters: {
            ...el.parameters,
            left: offset,
            top: offset,
          },
        };

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
      if (!undo) {
        yield put(
          Actions.setUndoActions(
            newElements.map((el: any) =>
              Actions.deleteItem(el.id, { screenId }),
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
              undo,
              sourceAction: Actions.restoreElementChildren(
                parent.id,
                newElements.map((element) => element.id),
                { screenId },
              ),
            },
            index,
          ),
        );

        yield put(
          Actions.updateLastElements(
            parent.id,
            newElements.map((el) => el.id),
            offset,
          ),
        );

        yield put(Actions.setActiveElement(newElements[0].id));

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
          return createdElements.map((el) => el.id);
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

export function* createElementsSaga(
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
    const { screenId } = action.meta;

    const activeElementId: string = yield select(selectActiveElementId);
    const activeElementTree: LibraryElement<Entity> = yield select(
      selectElementAsTree(parentId || activeElementId),
    );

    const customLibraryElements = yield select(
      selectors.selectCustomLibraryElements,
    );

    const convertedCreatedElements = createdElements.map((dEl) =>
      dEl.custom
        ? convertElementToRequest(
            customLibraryElements.find((element) => element.id === dEl.id),
          )
        : convertCreatedElementToRequest(dEl.type as Entity, null),
    );

    yield call(
      createElements,
      { elements: convertedCreatedElements, index },
      activeElementTree,
      {
        screenId,
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
}

export function* addChildToElementSaga(
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
    const { screenId, undo } = action.meta;

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
        screenId,
        undo,
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
}

export function* softDeleteSaga(action: ReturnType<typeof Actions.deleteItem>) {
  try {
    const { id } = action.payload;

    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, undo } = action.meta;

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

    if (!undo) {
      const undoActions: Action[] = [
        Actions.restoreElementChildren(
          parent.id,
          parent.children.map((child) => child.id),
          { screenId },
        ),
      ];
      if (element.shared === true) {
        undoActions.push(Actions.updateElement(id, { shared: true }));
      }
      yield put(Actions.setUndoActions(undoActions));
    }

    const activeElementId = yield select(selectActiveElementId);
    const root: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screenId),
    );

    if (activeElementId === id) {
      yield put(Actions.setActiveElement(root.id));
    }

    const state = yield select(selectElementsForScreen(screenId));
    yield put(
      Actions.updateElementsTree(removeMapElement(state, id), {
        ...action.meta,
        sourceAction: action,
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
      yield put(Actions.removeBorderedElementRef(id));
      yield put(Actions.updateElement(id, { shared: false }));

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
}

export function* restoreElementChildrenSaga(
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
    const { screenId, undo } = action.meta;

    const element: StateElement = yield select(selectElementById(elementId));

    if (!undo) {
      yield put(
        Actions.setUndoActions(
          childrenIds.map((id) => Actions.deleteItem(id, { screenId })),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);
    yield put(
      Actions.updateElementsTree(
        restoreMapElementChildren(state, elementId, childrenIds),
        { ...action.meta, sourceAction: action },
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
}

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
    const { screenId, undo } = action.meta;
    const element: StateElement = yield select(selectElementById(elementId));

    if (!undo) {
      yield put(
        Actions.setUndoActions([Actions.deleteItem(elementId, { screenId })]),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);

    yield put(
      Actions.updateElementsTree(restoreMapElement(state, elementId), {
        ...action.meta,
        sourceAction: action,
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

export function* wrapIntoContainerSaga(
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
    const { screenId } = action.meta;

    const element = yield select(selectElementById(id));
    const parent = yield select(selectElementById(element.parent));

    const serverContainer = convertCreatedElementToRequest('container', null);

    const {
      result: createdContainers,
    }: ReturnPromisedType<typeof apiCreateElements> = yield call(
      reqWrapper,
      apiCreateElements,
      { data: [serverContainer] },
    );

    if (createdContainers) {
      yield put(
        Actions.setUndoActions(
          Actions.unwrapFromContainer(id, createdContainers[0].id, parent.id, {
            screenId,
          }),
        ),
      );

      yield put(
        Actions.insertStateElement(
          createdContainers[0],
          parent.id,
          element.id,
          {
            ...action.meta,
            sourceAction: Actions.redoWrapIntoContainer(
              id,
              createdContainers[0].id,
              parent.id,
              action.meta,
            ),
          },
        ),
      );

      const updatedParent: LibraryElement<any> = yield select(
        selectElementAsTree(parent.id),
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
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* unwrapFromContainerSaga(
  action: ReturnType<typeof Actions.unwrapFromContainer>,
) {
  try {
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const { wrapperId, parentId } = action.payload;

    yield put(Actions.extractStateElement(wrapperId));
    const parent: LibraryElement<any> = yield select(
      selectElementAsTree(parentId),
    );

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
}

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
          screenId,
          sourceAction: null,
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

export function* redoWrapIntoContainerSaga(
  action: ReturnType<typeof Actions.redoWrapIntoContainer>,
) {
  try {
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { parentId, wrapperId, elementId } = action.payload;
    const { screenId } = action.meta;

    const wrapper: LibraryElement<any> = yield select(
      selectElementAsTree(wrapperId),
    );

    yield put(
      Actions.insertStateElement(wrapper, parentId, elementId, {
        screenId,
        redo: true,
        sourceAction: action,
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
        data: { children: [elementId] },
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

    yield put(
      Actions.setUndoActions(
        Actions.unwrapFromContainer(elementId, wrapperId, parentId, {
          screenId,
        }),
      ),
    );
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}
