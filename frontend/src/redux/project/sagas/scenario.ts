import { call, put, select } from 'redux-saga/effects';
import * as R from 'ramda';

import * as Actions from '$redux/project/actions';
import { convertCreatedElementToRequest, convertElementToPatchRequest, convertElementToRequest } from '$api/converters/toRequest';
import {
  apiAddElements,
  apiDelElements,
  apiSaveElements,
  apiChangeRecursiveElement,
} from '$api/element';
import {
  apiAddScenarios,
} from '$api/scenario';
import { LibraryElement, ServerElement, LibraryElementUnion } from '$api/types';
import { convertElementFromResponse } from '$api/converters/fromResponse';
import { Entity } from '$domain/core';
import { DEFAULT_INDENTS } from '$constants/defaultParams';
import { DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT, DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT } from '$features/notification/types';
import { reqWrapper } from '$redux/project/sagas/index';
import { ReturnPromisedType } from '$shared/types';
import { isElementCanBeRemove, isElementCanBeAdded } from '$utils/AvailableChildrenHelper';

import { selectors, T } from '../';
import { updateSavedElementsValues } from './screen';
import { findParentByChildID, findChildByID, moveElement, addChildrenToElement, removeChildrenFromElement, updateElementParameters, getElementsArray } from '$utils/ElementsTreeHelper';
import { setUndoActions } from '$redux/project/actions';

export function* updateElementsTree(root: LibraryElement<'root'>, skip: boolean = false, sourceAction: T.Action | null = null) {
  const elementsArray = getElementsArray(root);

  yield call(updateSavedElementsValues, elementsArray as LibraryElementUnion[]);
  yield put(Actions.updateElementsTree(root, skip, sourceAction));
}

export function* createContainer(scenario?: Partial<T.IScenarioItem>) {
  const currentScreen: ReturnType<typeof selectors.selectCurrentScreen> = yield select(
    selectors.selectCurrentScreen
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
    reqWrapper, apiAddScenarios, { data: [R.omit(['id'], containerToCreate)] }
  );

  return createdContainers[0];
}

export function* createElements(elements: ServerElement<Entity>[], parent: LibraryElement<Entity>, undo: boolean = false) {
  const disallowedElements = elements.filter(element => !isElementCanBeAdded(parent, element.struct_type));
    
  if (disallowedElements.length) {
    yield put(Actions.setNotification(DISALLOW_ADD_ELEMENT_NOTIFICATION_TEXT));
  };
    
  const allowedElements = elements.filter(element => isElementCanBeAdded(parent, element.struct_type));

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  
  const newElements: ReturnPromisedType<typeof apiAddElements> = yield call(reqWrapper, apiAddElements, { data: allowedElements });

  yield put(Actions.setUndoActions(newElements.map((el: any) => Actions.deleteElement(el.id, true))));

  const elementData = {
    name: parent.name,
    children: [...parent.children.map(child => child.id), ...newElements.map(element => element.id)],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: parent.id });

  const updatedElements = addChildrenToElement(parent.id, newElements, root);
  yield call(updateElementsTree, updatedElements, undo);

  const elementsWithUpdatedBuoyancy = findChildByID(updatedElements, parent.id)?.children.map(child => convertElementToPatchRequest(child));
  yield call(reqWrapper, apiSaveElements, { data: elementsWithUpdatedBuoyancy });

  return newElements.map(el => el.id)
}

export function* createElementsSaga(action: ReturnType<typeof Actions.createElements>) {
  const { createdElements } = action.payload;

  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const activeItemElement = findChildByID(root, activeItem.itemId);

  if (activeItemElement) {
    const convertedCreatedElements = createdElements.map(element => convertCreatedElementToRequest(element.type, null));
    yield call(createElements, convertedCreatedElements, activeItemElement);

  } else {
    console.error(`Active item ${activeItem.itemId} not found in elements tree!`);
  }
}

export function* addChildToElementSaga(action: ReturnType<typeof Actions.addChildToElement>) {
  const { childType, elementID, parameters, undo } = action.payload;

  const convertedCreatedChild = convertCreatedElementToRequest(childType, null);
  const createdChild = convertElementFromResponse(convertedCreatedChild);
  const childWithUpdatedParameters = updateElementParameters('-1', parameters, createdChild);
  const convertedChildWithUpdatedParameters = convertElementToRequest(childWithUpdatedParameters);

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const parent = findChildByID(root, elementID);

  if (!parent) {
    console.error(`Could not find parent ${elementID} of ${childType}!`);
  } else {
    yield call(createElements, [convertedChildWithUpdatedParameters], parent, undo);
  }
}

export function* deleteChildFromElementSaga(action: ReturnType<typeof Actions.deleteChildFromElement>) {
  const { id } = action.payload;
  yield call(removeElement, id);
}

export function* deleteElementSaga(action: ReturnType<typeof Actions.deleteElement>) {
  const { id, undo } = action.payload;
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  const element = findChildByID(root, id);
  if (!element) {
    console.error(`Can not find removed element ${id} in the tree!`);
    return
  }

  const parent = findParentByChildID(root, id);
  console.log(parent);

  if (!parent) {
    console.error(`Can not find parent of removed element  ${id} in the tree!`);
    return
  }
  const children = parent.children.map(child => child.id);

  if (!undo) {
    yield put(setUndoActions([
      // @ts-ignore
      Actions.addChildToElement(element.type, parent.id, element.parameters, true),
    ]));
  }

  const updatedRoot = removeChildrenFromElement(parent.id, [element], root);

  yield put(Actions.updateElementsTree(updatedRoot, undo));

  const filtered = children.filter(childId => childId !== id);

  const elementData = {
    children: filtered
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: parent.id });
}

export function* removeElement(elementToRemoveID: string, undo: boolean = false) {
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const removedElement = findChildByID(root, elementToRemoveID);

  if (!removedElement) {
    console.error(`Can not find removed element ${elementToRemoveID} in tree!`);
    return;
  };

  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  const itemToRemoveParent = findParentByChildID(root, elementToRemoveID);

  if (!itemToRemoveParent) {
    console.error(`Can not find removed element parent ${itemToRemoveParent} in tree!`);
    return;
  };

  if (!isElementCanBeRemove(itemToRemoveParent, removedElement.type)) {
    yield put(Actions.setNotification(DISALLOW_REMOVE_ELEMENT_NOTIFICATION_TEXT));
    return;
  };

  const itemToRemoveParentID = itemToRemoveParent.id;

  if (activeItem.itemId === elementToRemoveID) {
    const { type, name } = itemToRemoveParent;

    yield put(Actions.setActiveItem({
      itemId: itemToRemoveParentID,
      itemType: type,
      name,
    }));
  }

  const updatedRoot = removeChildrenFromElement(itemToRemoveParentID, [removedElement], root);
  
  yield put(Actions.updateElementsTree(updatedRoot, undo));

  const newActiveElemAfterDeletion = document.querySelector<HTMLElement>(`[data-ls-id='${itemToRemoveParentID}']`);
  newActiveElemAfterDeletion?.focus();
  yield call(reqWrapper, apiDelElements, { list: [removedElement?.id] });
}

export function* softDeleteSaga() {
  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  if (['root', 'none'].includes(activeItem.itemType)) return;

  const element = findChildByID(root, activeItem.itemId);
  if (!element) {
    console.error(`Can not find removed element ${activeItem.itemId} in the tree!`);
    return
  }

  const parent = findParentByChildID(root, activeItem.itemId);

  if (!parent) {
    console.error(`Can not find parent of removed element  ${activeItem.itemId} in the tree!`);
    return
  }
  const children = parent.children.map(child => child.id);

  yield put(setUndoActions([
    Actions.restoreElementChildren(parent.id, children)
  ]));

  const updatedRoot = removeChildrenFromElement(parent.id, [element], root);

  yield put(Actions.updateElementsTree(updatedRoot, false));

  const filtered = children.filter(id => id !== activeItem.itemId);

  const elementData = {
    children: filtered
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: parent.id });
}

export function* restoreElementSaga(action: T.RestoreElementChildren) {
  const { elementId, childrenIds } = action.payload;

  const elementData = {
    children: childrenIds,
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: elementId});
}

export function* deleteActiveItemSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);
  if (['root', 'none'].includes(activeItem.itemType)) return;
  yield call(removeElement, activeItem.itemId);
}

export function* addElementToElement(element: LibraryElement<Entity>, parent: LibraryElement<Entity>) {
  const elementData = {
    name: parent.name,
    children: [...parent.children.map(child => child.id), element.id],
  };

  yield call(reqWrapper, apiChangeRecursiveElement, { data: elementData, id: parent.id });
}

export function* wrapIntoContainerSaga() {
  const activeItem: ReturnType<typeof selectors.selectActiveItem> = yield select(selectors.selectActiveItem);

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);

  const wrappedItemParent = findParentByChildID(root, activeItem.itemId);
  const wrappedItem = findChildByID(root, activeItem.itemId);

  if (!wrappedItemParent) {
    console.error(`Can not find parent of wrappedItem ${activeItem.itemId} in tree!`);
    return;
  };

  if (!wrappedItem) {
    console.error(`Can not find wrappedItem ${activeItem.itemId} in tree!`);
    return;
  };

  const serverContainer = convertCreatedElementToRequest('container', null);

  const createdElements: ReturnPromisedType<typeof apiAddElements> = yield call(
    reqWrapper, apiAddElements, { data: [serverContainer] },
  );

  const [createdContainer] = createdElements;

  yield put(Actions.setUndoActions([Actions.unwrapFromContainer(activeItem.itemId, createdContainer.id, wrappedItemParent.id)]));

  yield call(addElementToElement, createdContainer, wrappedItemParent);

  yield call(addElementToElement, wrappedItem, createdContainer);

  const rootWithUpdatedParent = moveElement(wrappedItemParent.id, createdContainer, root, wrappedItem.buoyancy);
  const rootWithUpdatedContainer = moveElement(createdContainer.id, wrappedItem, rootWithUpdatedParent, 0);
  yield put(Actions.updateElementsTree(rootWithUpdatedContainer, false));
}

export function* unwrapFromContainerSaga(action: T.UnwrapFromContainer) {
  const {elementID, wrapperID, parentID} = action.payload;

  const root: ReturnType<typeof selectors.selectRootElement> = yield select(selectors.selectRootElement);
  const element = findChildByID(root, elementID);
  const parent = findChildByID(root, parentID);

  if (!element) {
    console.error(`Can not find element ${elementID} in tree!`);
    return
  }

  if (!parent) {
    console.error(`Can not find parent of wrapper ${wrapperID} in tree!`);
    return
  }

  yield call(addElementToElement, element, parent);

  yield call(reqWrapper, apiDelElements, {list: [wrapperID]});
}
