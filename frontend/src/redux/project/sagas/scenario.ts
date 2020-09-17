/* eslint-disable no-console */

import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';
import * as Actions from '../actions';
import { selectors, T } from '..';
import { updateSavedElementsValues } from './screen';
import { ElementHistoryMeta } from '../types';
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
  addChildrenToElement,
  findChildByID,
  findParentByChildID,
  getElementsArray,
  moveElement,
  removeChildrenFromElement,
  updateElementName,
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
  apiGetElement,
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
  addStateElements,
  buildElementsTree,
} from '../../../utils/normalizedStateHelpers';
import {
  selectActiveElementId,
  selectElementAsTree,
  selectElementsForCurrentScreen,
} from '../selectors';

export function* updateElementsTree(
  root: LibraryElement<'root'>,
  sourceAction: T.Action | null = null,
  meta: ElementHistoryMeta,
) {
  const elementsArray = getElementsArray(root);

  yield call(updateSavedElementsValues, elementsArray as LibraryElementUnion[]);
  yield put(Actions.updateElementsTree(root, sourceAction, meta));
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

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenRootElement(screenId),
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

  const state = yield select(selectElementsForCurrentScreen);
  const updatedState = addStateElements(state, newElements, parent.id);
  yield put(Actions.updateElements(updatedState));

  const updatedElements = addChildrenToElement(parent.id, newElements, root);
  yield call(
    updateElementsTree,
    updatedElements,
    Actions.restoreElementChildren(
      parent.id,
      newElements.map((element) => element.id),
      { screenId },
    ),
    { screenId, undo },
  );

  // const elementsWithUpdatedBuoyancy = findChildByID(
  //   updatedElements,
  //   parent.id,
  // )?.children.map((child) => convertElementToPatchRequest(child));

  const elementsWithUpdatedBuoyancy = buildElementsTree(
    updatedState,
    parent.id,
  ).children.map((child) => convertElementToPatchRequest(child));

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

export function* softDeleteSaga(action: T.DeleteItem) {
  const { id } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenRootElement(screenId),
  );
  const element = findChildByID(root, id);
  if (!element) {
    console.error(`Can not find removed element ${id} in the tree!`);
    return;
  }
  if (['root', 'none'].includes(element.type)) return;

  const parent = findParentByChildID(root, id);
  if (!parent) {
    console.error(`Can not find parent of removed element  ${id} in the tree!`);
    return;
  }

  if (!isElementCanBeRemove(parent, element.type)) {
    yield put(
      Actions.setNotification(DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT),
    );
    return;
  }

  const childrenIds = parent.children.map((child) => child.id);

  if (!undo) {
    yield put(
      setUndoActions(
        Actions.restoreElementChildren(parent.id, [id], { screenId }),
      ),
    );
  }

  const activeItem: ReturnType<typeof selectors.selectActiveElement> = yield select(
    selectors.selectActiveElement,
  );

  if (activeItem.id === id) {
    yield put(Actions.setActiveElementId(parent.id));
  }

  const updatedRoot = removeChildrenFromElement(parent.id, [element], root);

  yield put(Actions.updateElementsTree(updatedRoot, action, action.meta));
  yield put(Actions.removeElements([id]));

  const filtered = childrenIds.filter((childId) => childId !== id);

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: filtered },
    id: parent.id,
  });
}

export function* restoreElementSaga(action: T.RestoreElementChildren) {
  const { elementId, childrenIds } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  const root = yield select(selectors.selectScreenRootElement(screenId));

  const element = findChildByID(root, elementId);
  if (!element) {
    console.error(`Can not find removed element ${elementId} in the tree!`);
    return;
  }

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: {
      children: [...element.children.map((child) => child.id), ...childrenIds],
    },
    id: elementId,
  });

  if (!undo) {
    yield put(
      Actions.setUndoActions(
        childrenIds.map((id) => Actions.deleteItem(id, { screenId })),
      ),
    );
  }

  const updatedRoot = yield call(reqWrapper, apiGetElement, { id: root.id });

  yield put(Actions.updateElementsTree(updatedRoot, action, action.meta));

  // yield put(Actions.addElements([updatedRoot]));
}

export function* addElementToElement(
  element: LibraryElement<Entity>,
  parent: LibraryElement<Entity>,
) {
  const elementData = {
    name: parent.name,
    children: [...parent.children.map((child) => child.id), element.id],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: elementData,
    id: parent.id,
  });
}

export function* wrapIntoContainerSaga(action: T.WrapIntoContainer) {
  const { id } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectors.selectScreenRootElement(screenId),
  );

  const wrappedItemParent = findParentByChildID(root, id);
  const wrappedItem = findChildByID(root, id);

  if (!wrappedItemParent) {
    console.error(`Can not find parent of wrappedItem ${id} in tree!`);
    return;
  }

  if (!wrappedItem) {
    console.error(`Can not find wrappedItem ${id} in tree!`);
    return;
  }

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
      Actions.unwrapFromContainer(
        id,
        createdContainer.id,
        wrappedItemParent.id,
        { screenId },
      ),
    ),
  );

  yield call(addElementToElement, createdContainer, wrappedItemParent);

  yield call(addElementToElement, wrappedItem, createdContainer);

  const rootWithUpdatedParent = moveElement(
    wrappedItemParent.id,
    createdContainer,
    root,
    wrappedItem.buoyancy,
  );
  const rootWithUpdatedContainer = moveElement(
    createdContainer.id,
    wrappedItem,
    rootWithUpdatedParent,
    0,
  );
  yield put(
    Actions.updateElementsTree(
      rootWithUpdatedContainer,
      Actions.redoWrapIntoContainer(
        id,
        createdContainer.id,
        wrappedItemParent.id,
        action.meta,
      ),
      action.meta,
    ),
  );
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

  const { elementID, wrapperID, parentID } = action.payload;
  const { screenId } = action.meta;

  const root = yield select(selectors.selectScreenRootElement(screenId));

  const parent = findChildByID(root, parentID);
  if (!parent) {
    console.error(`Can not find parent of wrapper ${wrapperID} in tree!`);
    return;
  }

  const parentChildrenIds = parent.children.map((child) => child.id);
  const newParentChildrenIds = [
    ...parentChildrenIds.filter((id) => id !== wrapperID),
    elementID,
  ];

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: newParentChildrenIds },
    id: parentID,
  });

  const updatedRoot = yield call(reqWrapper, apiGetElement, { id: root.id });
  yield put(
    Actions.updateElementsTree(updatedRoot, action, {
      screenId,
      undo: true,
    }),
  );
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

  const root: ReturnType<typeof selectors.selectCurrentRootElement> = yield select(
    selectors.selectCurrentRootElement,
  );

  const updatedTree = updateElementName(elementID, name, root);
  const updatedElement = findChildByID(updatedTree, elementID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${elementID} in tree`);
  } else {
    const savedValue = getSavedValue(updatedElement as LibraryElementUnion);
    yield put(Actions.updateSavedElementValues(elementID, savedValue));

    yield call(updateElementsTree, updatedTree, null, action.meta);

    yield put(Actions.setActiveElementId(elementID));

    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, {
      data: convertedElement,
      id: elementID,
    });
  }
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

  const root = yield select(selectors.selectScreenRootElement(screenId));

  const parent = findChildByID(root, parentId);
  if (!parent) {
    console.error(`Can not find parent of wrapper ${elementId} in tree!`);
    return;
  }

  const parentChildrenIds = parent.children.map((child) => child.id);
  const index = parentChildrenIds.indexOf(elementId);

  parentChildrenIds.splice(index, 1, wrapperId);
  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: [elementId] },
    id: wrapperId,
  });
  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: parentChildrenIds },
    id: parentId,
  });

  yield put(
    Actions.setUndoActions(
      Actions.unwrapFromContainer(elementId, wrapperId, parentId, { screenId }),
    ),
  );

  const updatedRoot = yield call(reqWrapper, apiGetElement, { id: root.id });
  yield put(
    Actions.updateElementsTree(updatedRoot, action, { screenId, redo: true }),
  );
}
