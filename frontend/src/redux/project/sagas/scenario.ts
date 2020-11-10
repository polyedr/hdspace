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
import {
  DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT,
  DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT,
} from '../../../features/notification/constants';
import {
  getElementsArray,
  updateElementParameters,
} from '../../../utils/ElementsTreeHelper';
import {
  convertCreatedElementToRequest,
  convertElementToPatchRequest,
  convertElementToRequest,
} from '../../../api/converters/toRequest';
import {
  apiAddElements,
  apiChangeElement,
  apiChangeRecursiveElement,
  apiSaveElements,
} from '../../../api/element';
import {
  isElementCanBeAdded,
  isElementCanBeRemove,
} from '../../../utils/AvailableChildrenHelper';
import { apiAddScenarios } from '../../../api/scenario';
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
  IScenarioItem,
  LibraryElement,
  LibraryElementUnion,
  Normalized,
  ReturnPromisedType,
  StateElement,
} from '../../../types';
import { DEFAULT_INDENTS } from '../../../domain/libraryElements/defaultStyles';
import { reqWrapper, updateSavedElementsValues } from './shared';
import { Action, ElementHistoryMeta } from '../../types';

export function* updateElementsTree(
  chunk: Normalized<StateElement>,
  meta: ElementHistoryMeta,
) {
  const root: LibraryElement<'root'> = yield select(
    selectScreenRootElement(meta.screenId),
  );
  const tree = yield select(selectElementAsTree(root.id));

  const elementsArray = getElementsArray(tree);

  yield call(updateSavedElementsValues, elementsArray as LibraryElementUnion[]);
  yield put(Actions.updateElementsTree(chunk, meta));
}

export function* createContainer(scenario?: Partial<IScenarioItem>) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const containerToCreate: IScenarioItem = {
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

  const createdContainers: ReturnPromisedType<typeof apiAddScenarios> = yield call(
    reqWrapper,
    apiAddScenarios,
    { data: [R.omit(['id'], containerToCreate)] },
  );

  return createdContainers[0];
}

export function* createElements(
  { elements, index }: ElementsToDrop,
  parent: LibraryElement<Entity>,
  { screenId, undo }: ElementHistoryMeta,
) {
  const disallowedElements = elements.filter(
    (element) => !isElementCanBeAdded(parent, element.struct_type),
  );

  if (disallowedElements.length) {
    yield put(Actions.setNotification(DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT));
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

  const newElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper,
    apiAddElements,
    { data: elementsWithOffset },
  );

  if (!undo) {
    yield put(
      Actions.setUndoActions(
        newElements.map((el: any) => Actions.deleteItem(el.id, { screenId })),
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: elementData,
    id: parent.id,
  });

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

  const createdElements = yield call(reqWrapper, apiSaveElements, {
    data: elementsWithUpdatedBuoyancy,
  });

  // eslint-disable-next-line consistent-return
  return createdElements.map((el) => el.id);
}

export function* createElementsSaga(
  action: ReturnType<typeof Actions.createElements>,
) {
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
}

export function* addChildToElementSaga(
  action: ReturnType<typeof Actions.addChildToElement>,
) {
  const { childType, elementId, parameters } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  const convertedCreatedChild = convertCreatedElementToRequest(childType, null);
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
}

export function* softDeleteSaga(action: ReturnType<typeof Actions.deleteItem>) {
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
      Actions.setNotification(DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT),
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedParent.children.map((child) => child.id) },
    id: parent.id,
  });

  yield put(Actions.removeBorderedElementRef(id));
  yield put(Actions.updateElement(id, { shared: false }));

  const convertedElements = updatedParent.children.map((child) =>
    convertElementToPatchRequest(child),
  );

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });
}

export function* restoreElementChildrenSaga(
  action: ReturnType<typeof Actions.restoreElementChildren>,
) {
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: {
      children: [...element.children, elementId],
    },
    id: elementId,
  });

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });
}

export function* restoreElementSaga(
  action: ReturnType<typeof Actions.restoreElement>,
) {
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: {
      children: [...element.children, elementId],
    },
    id: elementId,
  });
}

export function* addElementToElement(elementId: string, parentId: string) {
  const parent: StateElement = yield select(selectElementById(parentId));

  const parentData = {
    name: parent.name,
    children: [...new Set([...parent.children, elementId])],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: parentData,
    id: parent.id,
  });
}

export function* wrapIntoContainerSaga(
  action: ReturnType<typeof Actions.wrapIntoContainer>,
) {
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

  const [
    createdContainer,
  ]: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper,
    apiAddElements,
    { data: [serverContainer] },
  );

  yield put(
    Actions.setUndoActions(
      Actions.unwrapFromContainer(id, createdContainer.id, parent.id, {
        screenId,
      }),
    ),
  );

  yield put(
    Actions.insertStateElement(createdContainer, parent.id, element.id, {
      ...action.meta,
      sourceAction: Actions.redoWrapIntoContainer(
        id,
        createdContainer.id,
        parent.id,
        action.meta,
      ),
    }),
  );

  const updatedParent: LibraryElement<any> = yield select(
    selectElementAsTree(parent.id),
  );
  const updatedWrapper: LibraryElement<any> = yield select(
    selectElementAsTree(createdContainer.id),
  );

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedParent.children.map((child) => child.id) },
    id: updatedParent.id,
  });

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedWrapper.children.map((child) => child.id) },
    id: updatedWrapper.id,
  });

  const convertedElements = [
    ...updatedParent.children.map((child) =>
      convertElementToPatchRequest(child),
    ),
    ...updatedWrapper.children.map((child) =>
      convertElementToPatchRequest(child),
    ),
  ];

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });
}

export function* unwrapFromContainerSaga(
  action: ReturnType<typeof Actions.unwrapFromContainer>,
) {
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: parent.children.map((child) => child.id) },
    id: parentId,
  });

  const convertedElements = parent.children.map((child) =>
    convertElementToPatchRequest(child),
  );

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });
}

export function* updateElementSaga(
  action: ReturnType<typeof Actions.updateElement>,
) {
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

  yield call(reqWrapper, apiChangeElement, {
    data: convertedElement,
    id: elementID,
  });
}

export function* redoWrapIntoContainerSaga(
  action: ReturnType<typeof Actions.redoWrapIntoContainer>,
) {
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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: [elementId] },
    id: wrapperId,
  });

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedParent.children.map((child) => child.id) },
    id: parentId,
  });

  const convertedElements = [
    ...updatedParent.children.map((child) =>
      convertElementToPatchRequest(child),
    ),
    ...updatedWrapper.children.map((child) =>
      convertElementToPatchRequest(child),
    ),
  ];

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });

  yield put(
    Actions.setUndoActions(
      Actions.unwrapFromContainer(elementId, wrapperId, parentId, { screenId }),
    ),
  );
}
