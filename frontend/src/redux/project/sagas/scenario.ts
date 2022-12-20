// @ts-nocheck
import { omit } from 'ramda';
import { call, put, select } from 'redux-saga/effects';
import { convertElementFromResponse } from '@Api/converters/fromResponse';
import {
  convertCreatedElementToRequest,
  convertElementToPatchRequest,
  convertElementToRequest,
} from '@Api/converters/toRequest';
import {
  apiChangeRecursiveElement,
  apiChangeRecursiveMultipleElements,
  apiCreateElements,
  apiUpdateElement,
  apiUpdateElements,
} from '@Api/element';
import { apiCreateScenarios } from '@Api/scenario';
import {
  isElementCanBeRemove,
  canElementHaveAllChildren,
} from '@Utils/AvailableChildrenHelper';
import { updateElementParameters } from '@Utils/ElementsTreeHelper';
import getSavedValue from '@Utils/getSavedValue';
import {
  removeMapElement,
  removeMapElements,
  restoreMapElement,
  restoreMapElementChildren,
} from '@Utils/normalizedStateHelpers';
import logger from 'loglevel';
import { DEFAULT_INDENTS } from '@Domain/libraryElements/defaultStyles';
import {
  ElementsToCreate,
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
  UserProjectPermission,
} from '@Src/types';
import {
  Action,
  ElementHistoryMeta,
  WrapIntoContainerData,
} from '@Redux/types';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { compose } from 'redux';
import * as Actions from '../actions';
import { enqueueSnackbar } from '../../notification/actions';
import { selectCurrentScreen } from '../selectors/screen';
import { reqWrapper } from './shared';
import {
  selectActiveElement,
  selectActiveElementId,
  selectAllElements,
  selectCustomLibraryElements,
  selectElementAsTree,
  selectElementById,
  selectElementsAsTrees,
  selectElementsByIds,
  selectElementsChildren,
  selectElementTreeGroups,
  selectMasterGroupsElementId,
  selectScreenRootElement,
  selectTreeChildIdsByParentsIds,
} from '../selectors/element';
import withActionsHistory from '../wrappers/withActionsHistory';
import {
  createElements,
  createLibraryElements,
  updateOrReplaceMultipleElementsParameters,
} from './common';

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
      { data: [omit(['id'], containerToCreate)] },
    );

    if (result) {
      return result[0];
    }

    if (error) {
      throw new Error(error);
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message || 'Failed to create scenarios',
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* createGroupsBinding(
  elementsIds: string[],
  meta: ElementHistoryMeta,
) {
  const updatedElements = yield select(selectElementsByIds(elementsIds));
  // get list of group elements
  const newGroupElements = updatedElements.filter((el) => {
    return !!el.parameters.sourceElementId;
  });

  if (!newGroupElements.length) {
    return;
  }

  // get list of all groups' children
  const allGroupIds = yield select(
    selectTreeChildIdsByParentsIds(
      newGroupElements.reduce(
        (allChildIds, element) => {
          return [...allChildIds, ...element.children];
        },
        newGroupElements.map((group) => group.id),
      ),
    ),
  );

  const elements = yield select(selectAllElements);

  const paramsToUpdate = allGroupIds.reduce((params, childId) => {
    const newElement = elements[childId];
    const sourceElement = elements[newElement.parameters?.sourceElementId];
    if (!sourceElement) {
      return params;
    }
    return {
      ...params,
      [sourceElement.id]: {
        groupElements: [
          ...new Set([
            ...(sourceElement.parameters?.groupElements || []),
            newElement.id,
          ]),
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
        ...meta,
      },
    ),
    UpdateDataActionType.UPDATE,
  );
}

export const createElementsSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.createElements>) {
  try {
    const { createdElements, parentId, index } = action.payload;

    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const activeElement = yield select(selectActiveElement);
    const parentElement = yield select(
      selectElementById,
      parentId || activeElement.id,
    );
    if (createdElements[0].shared) {
      yield put(
        Actions.createLibraryElements(
          { createdElements, parentId: parentId || activeElement.id, index },
          { ...action.meta },
        ),
      );
      yield put(Actions.loadCustomElements(true));
      return;
    }
    if (!parentElement) {
      yield put(
        enqueueSnackbar({
          message: 'Parent element is not defined',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    if (parentElement.parameters.groupElements) {
      yield put(
        Actions.createGroupChildren(
          { createdElements, parentId: parentId || activeElement.id, index },
          { ...action.meta },
        ),
      );
    } else {
      yield put(
        Actions.createChildElements(
          { createdElements, parentId: parentId || activeElement.id, index },
          { ...action.meta },
        ),
      );
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const createChildElementsSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.createChildElements>,
) {
  try {
    if (!action.meta) {
      logger.error(
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
    const convertedCreatedElements = createdElements.map((dEl) => {
      if (dEl.custom) {
        return convertElementToRequest(
          customLibraryElements.find((element) => element.id === dEl.id),
        );
      }
      if (dEl.parameters?.isGroup) {
        const group = elementGroups.find((group) => group.id === dEl.id);
        return convertElementToRequest({
          ...group,
          parameters: {
            ...group.parameters,
            isGroup: false,
            sourceElementId: group.id,
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
      [
        {
          elements: convertedCreatedElements,
          parent: activeElementTree,
          index,
        },
      ],
      {
        ...action.meta,
      },
    );

    yield call(createGroupsBinding, elementsIds, action.meta);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const createLibraryElementsSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.createChildElements>,
) {
  try {
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const { createdElements, parentId, index } = action.payload;

    const activeElementId: string = yield select(selectActiveElementId);
    const activeElementTree: LibraryElement<Entity> = yield select(
      selectElementAsTree(parentId || activeElementId),
    );

    const convertedCreatedElements = createdElements.map((dEl) => {
      return convertCreatedElementToRequest(
        dEl.type as Entity,
        dEl.name || null,
        null,
        dEl.parameters,
        dEl.shared,
        dEl.styles,
      );
    });
    yield call(
      createLibraryElements,
      [
        {
          elements: convertedCreatedElements,
          parent: activeElementTree,
          index,
        },
      ],
      {
        ...action.meta,
      },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const createGroupChildrenSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.createGroupChildren>) {
  const { createdElements, parentId, index } = action.payload;
  if (!action.meta) {
    logger.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  if (!parentId) {
    yield put(
      enqueueSnackbar({
        message: 'Group child can not be root',
        options: { variant: 'error' },
      }),
    );
    return;
  }
  const parentElement = yield select(selectElementAsTree(parentId));
  const { groupElements } = parentElement.parameters;

  if (!groupElements) {
    yield put(
      enqueueSnackbar({
        message: 'Selected element is not a part of a group',
        options: { variant: 'warning' },
      }),
    );
    return;
  }

  const linkedElements = yield select(selectElementsAsTrees(groupElements));

  const customLibraryElements = yield select(selectCustomLibraryElements);

  const elementGroups = yield select(selectElementTreeGroups);

  const elementsToCreate = [parentElement, ...linkedElements].map(
    (groupItemParent) => {
      return {
        elements: createdElements.map((dEl) => {
          if (dEl.custom) {
            return convertElementToRequest(
              customLibraryElements.find((element) => element.id === dEl.id),
            );
          }
          if (dEl.parameters?.isGroup) {
            const group = elementGroups.find((group) => group.id === dEl.id);
            return convertElementToRequest({
              ...group,
              parameters: {
                ...Object.keys(group.parameters)
                  .filter((key) => key !== 'isGroup')
                  .map((key) => ({
                    [key]: group.parameters[key],
                  })),
              },
            });
          }
          return convertCreatedElementToRequest(
            dEl.type as Entity,
            dEl.name || null,
            null,
            dEl.parameters,
          );
        }),
        parent: groupItemParent,
        index,
      } as ElementsToCreate<Entity>;
    },
  );

  const elementsIds = yield call(createElements, elementsToCreate, {
    ...action.meta,
  });

  const allElements = yield select(selectAllElements);

  const updatedElements = yield select(selectElementsByIds(elementsIds));

  const createdGroupElement = updatedElements.find(
    (el) =>
      el.parent === parentId &&
      !el.parameters.groupElements &&
      !el.parameters.sourceElementId,
  );

  const createdInstanceElements = updatedElements.filter(
    (el) =>
      !el.parameters.groupElements &&
      el.parent !== parentId &&
      !el.parameters.sourceElementId,
  );

  const getPropertiesToUpdate = (
    groupElementId: string,
    instanceElementsIds: string[],
    allElements: Normalized<StateElement>,
  ) => {
    const groupElement = allElements[groupElementId];
    const instanceElements = instanceElementsIds.map((id) => allElements[id]);
    return {
      [groupElement.id]: {
        groupElements: [...new Set(instanceElementsIds)],
      },
      ...instanceElementsIds.reduce(
        (allIds, id) => ({
          ...allIds,
          [id]: {
            sourceElementId: groupElementId,
          },
        }),
        {},
      ),
      ...groupElement.children.reduce((allChildrenParams, childId, index) => {
        return {
          ...allChildrenParams,
          ...getPropertiesToUpdate(
            childId,
            instanceElements.map((el) => el.children[index]),
            allElements,
          ),
        };
      }, {}),
    };
  };

  const paramsToUpdate = getPropertiesToUpdate(
    createdGroupElement.id,
    createdInstanceElements.map((el) => el.id),
    allElements,
  );

  yield call(
    updateOrReplaceMultipleElementsParameters,
    Actions.updateMultipleElementsParameters(
      Object.keys(paramsToUpdate),
      paramsToUpdate,
      { ...action.meta },
    ),
    UpdateDataActionType.UPDATE,
  );
});

export const addChildrenToElementSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.addChildrenToElement>) {
  try {
    const { children, elementId } = action.payload;
    if (!action.meta) {
      logger.error(
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
      [{ elements: convertedCreatedChildren, parent: element }],
      {
        ...action.meta,
      },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const addChildToElementSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.addChildToElement>) {
  try {
    const { childType, elementId, parameters } = action.payload;
    if (!action.meta) {
      logger.error(
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
      [{ elements: [convertedChildWithUpdatedParameters], parent: element }],
      { ...action.meta },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const deleteElementSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
  UserProjectPermission.CHANGE_PROJECT,
)(function* (action: ReturnType<typeof Actions.deleteElement>) {
  try {
    const { id } = action.payload;
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const element = yield select(selectElementById, id);
    const { groupElements, sourceElementId } = element.parameters;

    if (groupElements) {
      yield put(
        Actions.softDeleteMultipleElements([id, ...groupElements], action.meta),
      );
    } else {
      yield put(Actions.softDeleteElement(id, action.meta));
      if (sourceElementId) {
        const sourceElement = yield select(selectElementById, sourceElementId);
        yield put(
          Actions.updateElementParameters(
            sourceElementId,
            {
              groupElements: [
                ...new Set([
                  ...sourceElement.parameters.groupElements.filter(
                    (elId) => elId !== id,
                  ),
                ]),
              ],
            },
            { ...action.meta },
          ),
        );
      }
    }
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const softDeleteSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.softDeleteElement>) {
  try {
    const { id } = action.payload;
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    const element: StateElement = yield select(selectElementById, id);

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const softDeleteMultipleSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.softDeleteMultipleElements>) {
  try {
    const { ids } = action.payload;

    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      yield put(
        enqueueSnackbar({
          message: `You have to provide metainformation for action ${action.type}`,
          options: { variant: 'error' },
        }),
      );
      return;
    }
    const elements: StateElement[] = yield select(selectElementsByIds(ids));
    const existingElements = elements.filter((el) => !!el);
    const elementsWithoutParent = existingElements.filter(
      (el) => !el.parent && !el.parameters.isGroup,
    );
    if (elementsWithoutParent.length) {
      logger.error(
        `Can not remove elements without parent: ${JSON.stringify(
          elementsWithoutParent,
        )}`,
      );
      throw new Error('Can not remove elements without parent');
    }

    const masterGroupsElId = yield select(selectMasterGroupsElementId);
    const parentsIds: string[] = existingElements
      .filter((el) => !!el.parent)
      .map((el) => {
        const { isGroup } = el.parameters;
        return isGroup ? masterGroupsElId : el.parent;
      }) as string[];

    const parents = yield select(selectElementsAsTrees(parentsIds));

    existingElements.forEach((el) => {
      const parent = parents.find((p) => p.id === el.parent);
      if (!isElementCanBeRemove(parent, el.type as Entity)) {
        throw new Error('Can not remove some elements');
      }
    });

    const state = yield select(selectAllElements);

    yield put(
      Actions.updateElementsTree(
        removeMapElements(
          state,
          existingElements.map((el) => el.id),
        ),
        {
          ...action.meta,
        },
      ),
    );

    const updatedParents = yield select(
      selectElementsAsTrees(parents.map((p) => p.id)),
    );

    const { result, error }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveMultipleElements,
      {
        elements: updatedParents.map((p) => ({
          id: Number(p.id),
          name: p.name,
          children: p.children.map((child) => Number(child.id)),
        })),
      },
    );

    if (result) {
      const convertedElements = updatedParents
        .map((p) => p.children)
        .reduce((allParents, children) => {
          return [
            ...allParents,
            ...children.map((child) => convertElementToPatchRequest(child)),
          ];
        }, []);
      yield call(reqWrapper, apiUpdateElements, { data: convertedElements });
    }
    if (error) throw new Error(error);
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const restoreElementChildrenSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.restoreElementChildren>) {
  try {
    const { elementId, childrenIds } = action.payload;
    if (!action.meta) {
      yield put(
        enqueueSnackbar({
          message: `You have to provide metainformation for action ${action.type}`,
          options: { variant: 'error' },
        }),
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    const element: StateElement = yield select(selectElementById, elementId);

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

// RESTORE MULTIPLE ELEMENTS CHILDREN SAGA
export const restoreMultipleElementsChildrenSaga = withActionsHistory(
  function* (
    action: ReturnType<typeof Actions.restoreMultipleElementsChildren>,
  ) {
    const { elements } = action.payload;

    try {
      if (!action.meta) {
        yield put(
          enqueueSnackbar({
            message: `You have to provide metainformation for action ${action.type}`,
            options: { variant: 'error' },
          }),
        );
        return;
      }
      const state: Normalized<StateElement> = yield select(selectAllElements);

      const ids = elements.map((el) => el.id);

      const updatedTree = elements.reduce(
        (tree, element) => {
          return {
            ...tree,
            ...restoreMapElementChildren(tree, element.id, element.children),
          };
        },
        { ...state },
      );

      yield put(Actions.updateElementsTree(updatedTree, { ...action.meta }));

      const allChildren = yield select(selectElementsChildren(ids));

      const { error: changeError } = yield call(
        reqWrapper,
        apiChangeRecursiveMultipleElements,
        {
          elements: elements.map((el) => ({
            id: el.id,
            children: allChildren
              .filter((child) => child.parent === el.id)
              .sort((a, b) => a.buoyancy - b.buoyancy)
              .map((child) => child.id),
          })),
        },
      );

      if (changeError) throw new Error(changeError);

      const convertedElements = yield select(selectElementsAsTrees(ids));

      const { error: updateError } = yield call(reqWrapper, apiUpdateElements, {
        data: convertedElements,
      });

      if (updateError) throw new Error(updateError);
    } catch (e) {
      yield put(
        enqueueSnackbar(
          {
            message: e.message,
            options: { variant: 'error' },
          },
          e,
        ),
      );
    }
  },
);

export function* restoreElementSaga(
  action: ReturnType<typeof Actions.restoreElement>,
) {
  try {
    const elementId = action.payload;
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { useHistory } = action.meta;
    const element: StateElement = yield select(selectElementById, elementId);

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
}

export function* addElementToElement(elementId: string, parentId: string) {
  try {
    const parent: StateElement = yield select(selectElementById, parentId);

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
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
      logger.error('Can wrap only elements with same parent');
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
      enqueueSnackbar({ message: e.message, options: { variant: 'error' } }, e),
    );
  }
}

export const wrapIntoContainerSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.wrapIntoContainer>) {
  try {
    const { id } = action.payload;
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const element = yield select(selectElementById, id);
    const parent = yield select(selectElementById, element.parent);

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const unwrapFromContainerSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.unwrapFromContainer>) {
  try {
    const { meta } = action;
    if (!meta) {
      logger.error(
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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const updateElementSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateElement>) {
  try {
    const { elementID, data } = action.payload;

    const { useHistory } = action.meta;

    if (!useHistory) {
      const oldElement = yield select(selectActiveElement);

      if (elementID === oldElement.id) {
        yield put(
          Actions.addUndoActions([
            Actions.updateElement(
              {
                elementID,
                data: {
                  ...oldElement,
                },
              },
              {
                ...action.meta,
              },
            ),
          ]),
        );
      }
    }

    yield put(Actions.updateStateElement(elementID, { ...data }));

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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});

export const redoWrapIntoContainerSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.redoWrapIntoContainer>) {
  try {
    if (!action.meta) {
      logger.error(
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
      enqueueSnackbar(
        {
          message: e.message,
          options: { variant: 'error' },
        },
        e,
      ),
    );
  }
});
