/* eslint-disable no-console */

import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';
import * as Actions from '../actions';
import { selectors, T } from '..';
import { updateSavedElementsValues } from './screen';
import { ElementHistoryMeta, StateElement, Map } from '../types';
import {
  DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT,
  DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT,
} from '../../../features/notification/types';
import {
  LibraryElement,
  LibraryElementUnion,
  ServerElement,
} from '../../../api/types';
import { Entity } from '../../../domain/core';
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
  redoWrapIntoContainer,
  setUndoActions,
  unwrapFromContainer,
} from '../actions';
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
import { DEFAULT_INDENTS } from '../../../domain/constants/defaultStyles';
import { apiAddScenarios } from '../../../api/scenario';

import { ReturnPromisedType } from '../../../shared/types';
import { convertElementFromResponse } from '../../../api/converters/fromResponse';
import getSavedValue from '../../../utils/getSavedValue';
import { reqWrapper } from './index';
import {
  removeMapElement,
  restoreMapElement,
  restoreMapElementChildren,
  updateMapElement,
} from '../../../utils/normalizedStateHelpers';
import {
  selectActiveElementId,
  selectAllElements,
  selectElementAsTree,
  selectElementById,
  selectElementsForScreen,
  selectScreenRootElement,
} from '../selectors';

export function* updateElementsTree(
  chunk: Map<StateElement>,
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

export function* createContainer(scenario?: Partial<T.IScenarioItem>) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen,
  );

  const containerToCreate: T.IScenarioItem = {
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
  elements: ServerElement<Entity>[],
  parent: LibraryElement<Entity>, // TODO: need to use here parent id only
  { screenId, undo }: ElementHistoryMeta,
) {
  const disallowedElements = elements.filter(
    (element) => !isElementCanBeAdded(parent, element.struct_type),
  );

  if (disallowedElements.length) {
    yield put(Actions.setNotification(DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT));
    return;
  }

  const allowedElements = elements.filter((element) =>
    isElementCanBeAdded(parent, element.struct_type),
  );

  const newElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper,
    apiAddElements,
    { data: allowedElements },
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
    Actions.addStateElements(newElements, parent.id, {
      screenId,
      undo,
      sourceAction: Actions.restoreElementChildren(
        parent.id,
        newElements.map((element) => element.id),
        { screenId },
      ),
    }),
  );

  const updatedParent: LibraryElement<Entity> = yield select(
    selectElementAsTree(parent.id),
  );
  const elementsWithUpdatedBuoyancy = updatedParent.children.map((child) =>
    convertElementToPatchRequest(child),
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

  const { createdElements } = action.payload;
  const { screenId } = action.meta;

  const activeElementId: string = yield select(selectActiveElementId);
  const activeElementTree: LibraryElement<Entity> = yield select(
    selectElementAsTree(activeElementId),
  );

  const customLibraryElements = yield select(
    selectors.selectCustomLibraryElements,
  );

  const convertedCreatedElements = createdElements.map((element) => {
    return element.custom
      ? customLibraryElements[element.name]
      : convertCreatedElementToRequest(element.type as Entity, null);
  });
  yield call(createElements, convertedCreatedElements, activeElementTree, {
    screenId,
  });
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

  yield call(createElements, [convertedChildWithUpdatedParameters], element, {
    screenId,
    undo,
  });
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
    yield put(setUndoActions(Actions.restoreElement(id, { screenId })));
  }

  const activeElementId = yield select(selectActiveElementId);
  const root: LibraryElement<'root'> = yield select(
    selectScreenRootElement(screenId),
  );

  if (activeElementId === id) {
    yield put(Actions.setActiveElementId(root.id));
  }

  const state = yield select(selectElementsForScreen(screenId));
  yield put(
    Actions.updateElementsTree(removeMapElement(state, id), {
      ...action.meta,
      sourceAction: action,
    }),
  );

  const updatedParent: StateElement = yield select(
    selectElementById(parent.id),
  );

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedParent.children },
    id: parent.id,
  });
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

  const state: Map<StateElement> = yield select(selectAllElements);
  yield put(
    Actions.updateElementsTree(
      restoreMapElementChildren(state, elementId, childrenIds),
      { ...action.meta, sourceAction: action },
    ),
  );

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: {
      children: [...element.children, elementId],
    },
    id: elementId,
  });
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

  const state: Map<StateElement> = yield select(selectAllElements);

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
  const container: StateElement = yield select(
    selectElementById(createdContainer.id),
  );

  yield call(addElementToElement, container.id, parent.id);

  yield call(addElementToElement, element.id, container.id);
}

export function* unwrapFromContainerSaga(
  action: ReturnType<typeof unwrapFromContainer>,
) {
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { elementId, wrapperId, parentId } = action.payload;
  const { screenId } = action.meta;

  yield put(Actions.setActiveElementId(parentId));
  const parent: StateElement = yield select(selectElementById(parentId));

  const newParentChildrenIds = [
    ...parent.children.filter((id) => id !== wrapperId),
    elementId,
  ];

  const state: Map<StateElement> = yield select(
    selectElementsForScreen(screenId),
  );

  const stateWithUpdatedParent = updateMapElement(state, parentId, {
    children: newParentChildrenIds,
  });
  const stateWithUpdatedWrapper = updateMapElement(
    stateWithUpdatedParent,
    wrapperId,
    {
      children: stateWithUpdatedParent[wrapperId].children.filter(
        (id) => id !== elementId,
      ),
      parent: undefined,
    },
  );

  yield put(
    Actions.updateElementsTree(
      updateMapElement(stateWithUpdatedWrapper, elementId, {
        parent: parentId,
      }),
      { undo: true, screenId, sourceAction: action },
    ),
  );

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: newParentChildrenIds },
    id: parentId,
  });
}

export function* renameElementSaga(
  action: ReturnType<typeof Actions.renameElement>,
) {
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { elementID, name } = action.payload;

  yield put(
    Actions.updateStateElement(
      elementID,
      { name },
      {
        ...action.meta,
        sourceAction: null,
      },
    ),
  );

  const updatedElement: LibraryElement<any> = yield select(
    selectElementAsTree(elementID),
  );

  const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
  yield put(Actions.updateSavedElementValues(elementID, savedValue));

  yield put(Actions.setActiveElementId(elementID));

  const convertedElement = convertElementToPatchRequest(updatedElement);
  yield call(reqWrapper, apiChangeElement, {
    data: convertedElement,
    id: elementID,
  });
}

export function* redoWrapIntoContainerSaga(
  action: ReturnType<typeof redoWrapIntoContainer>,
) {
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { parentId, wrapperId, elementId } = action.payload;
  const { screenId } = action.meta;

  const parent: StateElement = yield select(selectElementById(parentId));

  const newParentChildren = [
    ...parent.children.filter((id) => id !== elementId),
    wrapperId,
  ];

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

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: [elementId] },
    id: wrapperId,
  });
  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: newParentChildren },
    id: parentId,
  });

  yield put(
    Actions.setUndoActions(
      Actions.unwrapFromContainer(elementId, wrapperId, parentId, { screenId }),
    ),
  );
}
