// @ts-nocheck
import { put, call, select, putResolve } from 'redux-saga/effects';
import { compose } from 'redux';
import logger from 'loglevel';
import {
  selectCustomElementsPagination,
  selectElementStyles,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
  selectIsElementSelected,
  selectElementsByIds,
  selectSelectedElementsIds,
  selectTreeChildElementsIds,
  selectMasterGroupsElementId,
  selectActiveElement,
  selectEnabledPseudoClass,
  selectActiveElementId,
} from '@Redux/project/selectors/element';
import {
  selectCurrentDropTargetParams,
  selectCurrentProject,
} from '@Redux/project/selectors/base';
import {
  convertElementToPatchRequest,
  convertElementToRequest,
} from '@Api/converters/toRequest';
import {
  apiUpdateElement,
  apiChangeRecursiveElement,
  apiUpdateElements,
  apiGetCustomLibraryElements,
} from '@Api/element';
import generateUniqueName from '@Utils/generateUniqueName';
import { addProjectStyles } from '@Utils/ProjectClassesHelper';
import { ALL_ELEMENTS_INDEX, CONTAINER_GROUPS } from '@Constants/defaultParams';
import {
  Entity,
  DuplicateElementsData,
  LibraryElement,
  Normalized,
  PaginatedResponse,
  RecursiveElement,
  Result,
  ReturnPromisedType,
  ServerElement,
  StateElement,
  UpdateDataActionType,
  UserProjectPermission,
  ElementData,
} from '@Src/types';
import { ElementHistoryMeta } from '@Redux/types';
import { apiGetFile } from '@Api/import';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';
import { DropPosition, ElementType } from '@Constants/dragAndDrop';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import withActionsHistory from '../wrappers/withActionsHistory';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
} from '../selectors/asset';
import { selectCurrentScreenId } from '../selectors/screen';
import { reqWrapper, projectUpdateHelperSaga } from './shared';
import { wrapIntoContainer } from './scenario';
import { uploadAssetHelper } from './asset';
import {
  updateOrReplaceElementParameters,
  updateOrReplaceElementStyles,
  updateOrReplaceMultipleElementsParameters,
  createElements,
} from './common';

// eslint-disable-next-line consistent-return
export function* duplicateElements(
  { itemsToCopyInfo, targetParent }: DuplicateElementsData,
  meta: ElementHistoryMeta,
) {
  try {
    const elements: Array<LibraryElement<any>> = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const el of itemsToCopyInfo) {
      const element = yield select(selectElementAsTree(el.id));
      elements.push(element);
    }

    const convertedItemsToDuplicate = elements.map((item) =>
      convertElementToRequest(item, (originalEl, convertedEl) => ({
        ...convertedEl,
        parameters: {
          ...convertedEl.parameters,
          originalElementId: originalEl.id,
        },
      })),
    );

    return yield call(
      createElements,
      [{ elements: convertedItemsToDuplicate, parent: targetParent }],
      { ...meta },
    );
  } catch (e) {
    yield put(
      enqueueSnackbar(
        {
          message: e.message,
          options: {
            variant: 'error',
          },
        },
        e,
      ),
    );
  }
}

export const moveElementSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.moveElement>) {
  try {
    const { indices, elementId, parents } = action.payload;

    const { newParentId, oldParentId } = parents;
    const { newIndex, oldIndex } = indices;

    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { useHistory } = action.meta;

    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.moveElement(
            elementId,
            { oldIndex: newIndex, newIndex: oldIndex },
            { oldParentId: newParentId, newParentId: oldParentId },
            { ...action.meta },
          ),
        ]),
      );
    }

    yield put(
      Actions.moveStateElement(elementId, indices, parents, {
        ...action.meta,
      }),
    );

    yield put(Actions.setCurrentDropTargetParams(null));

    const updatedOldParent: LibraryElement<any> = yield select(
      selectElementAsTree(oldParentId),
    );

    const updatedNewParent: LibraryElement<any> = yield select(
      selectElementAsTree(newParentId),
    );

    const convertedElements = [
      ...new Set([
        ...updatedNewParent.children.map((child) =>
          convertElementToPatchRequest(child),
        ),
        ...updatedOldParent.children.map((child) =>
          convertElementToPatchRequest(child),
        ),
      ]),
    ];

    const { error: elementsError }: Result<ServerElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data: convertedElements,
      },
    );

    if (elementsError) throw new Error(elementsError);

    const { error: recursiveError }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        data: { children: updatedNewParent.children.map((el) => el.id) },
        id: newParentId,
      },
    );
    if (recursiveError) throw new Error(recursiveError);
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

function* updateElementClassNames(
  elementId: string,
  newClassName: string,
  action: ReturnType<
    | typeof Actions.addElementClassName
    | typeof Actions.removeElementClassName
    | typeof Actions.copyElementStyles
  >,
  type: 'add' | 'remove',
) {
  try {
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { useHistory } = action.meta;

    if (!useHistory) {
      if (type === 'add') {
        yield put(
          Actions.addUndoActions(
            Actions.removeElementClassName(elementId, newClassName, {
              ...action.meta,
            }),
          ),
        );
      } else {
        yield put(
          Actions.addUndoActions(
            Actions.addElementClassName(elementId, newClassName, {
              ...action.meta,
            }),
          ),
        );
      }
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);

    yield put(
      Actions.updateStateElement(elementId, {
        styles: {
          ...state[elementId].styles,
          classNames:
            type === 'add'
              ? [state[elementId].styles.classNames[0], newClassName]
              : state[elementId].styles.classNames.filter(
                  (name) => name !== newClassName,
                ),
        },
      }),
    );

    const updatedElement: LibraryElement<any> = yield select(
      selectElementAsTree(elementId),
    );

    const convertedElement = convertElementToPatchRequest(updatedElement);

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElement,
      {
        data: convertedElement,
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

function* removeElementStyles(
  id: string,
  cssPropertiesNames: string[],
  action: ReturnType<
    typeof Actions.removeElementStyles | typeof Actions.copyElementStyles
  >,
) {
  try {
    if (!action.meta) {
      logger.error(
        `You have to provide meta information for action ${action.type}`,
      );
      return;
    }

    const element: StateElement = yield select(selectElementById, id);

    const pseudoClass: string | null = yield select(selectEnabledPseudoClass);

    const stylesToRemove = pseudoClass
      ? element.styles.pseudoClassStyles[pseudoClass]
      : element.styles.ownStyles;

    const updatedStyles = Object.fromEntries(
      Object.entries(stylesToRemove).filter(([rule]) =>
        cssPropertiesNames.every((name) => name !== rule),
      ),
    );

    yield put(
      Actions.updateStateElement(id, {
        styles: {
          ...element.styles,
          ...(pseudoClass
            ? {
                pseudoClassStyles: {
                  ...element.styles.pseudoClassStyles,
                  [pseudoClass]: updatedStyles,
                },
                pseudoClassViewStyles: {
                  ...element.styles.ownStyles,
                  ...updatedStyles,
                },
              }
            : {
                ownStyles: updatedStyles,
              }),
        },
      }),
    );

    const updatedElement: LibraryElement<any> = yield select(
      selectElementAsTree(id),
    );

    const convertedElement = convertElementToPatchRequest(updatedElement);
    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElement,
      {
        data: convertedElement,
        id,
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

export const copyElementStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.copyElementStyles>) {
  try {
    const { elementType, elementID, styles } = action.payload;

    if (!action.meta) {
      logger.error(
        `You have to provide meta information for action ${action.type}`,
      );
      return;
    }

    const currentProject: ReturnType<typeof selectCurrentProject> =
      yield select(selectCurrentProject);

    const sharedClassNames = currentProject.projectData.classes.map(
      (cssClass) => cssClass.className,
    );
    const uniqueClassName = generateUniqueName(
      `${elementType}-group-1`,
      sharedClassNames,
    );

    yield call(
      updateElementClassNames,
      elementID,
      uniqueClassName,
      action,
      'add',
    );

    const newProject = addProjectStyles(
      currentProject,
      uniqueClassName,
      elementType,
      styles as Required<React.CSSProperties>,
    );
    yield call(projectUpdateHelperSaga, newProject);

    yield call(removeElementStyles, elementID, Object.keys(styles), action);

    if (!action.meta.useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.removeElementClassName(elementID, uniqueClassName, {
            ...action.meta,
          }),
          Actions.updateProject(currentProject, { ...action.meta }),
          Actions.updateElementStyles(elementID, styles, { ...action.meta }),
        ]),
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

export const addElementClassNameSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.addElementClassName>) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'add');
});

export const removeElementClassNameSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeElementClassName>) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'remove');
});

export const updateElementStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateElementStyles>) {
  try {
    yield call(updateOrReplaceElementStyles, action, 'update');
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

export function* updateOrReplaceMultipleElementsStyles(
  action: ReturnType<
    | typeof Actions.updateMultipleElementsStyles
    | typeof Actions.replaceMultipleElementsStyles
  >,
  type: 'replace' | 'update',
) {
  if (!action.meta) {
    logger.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  try {
    const { ids, styles } = action.payload;

    const stateElements = yield select(selectElementsByIds(ids));

    if (!action.meta.useHistory) {
      const stylesState = stateElements.reduce(
        (acc, element) => ({
          ...acc,
          [element.id]: element.styles.ownStyles,
        }),
        {},
      );
      yield put(
        Actions.addUndoActions(
          Actions.replaceMultipleElementsStyles(ids, stylesState, {
            ...action.meta,
          }),
        ),
      );
    }

    const pseudoClass = yield select(selectEnabledPseudoClass);

    const elementsToUpdate = stateElements.map((element: StateElement) => {
      const stylesToUpdate = pseudoClass
        ? element.styles.pseudoClassStyles[pseudoClass]
        : element.styles.ownStyles;

      const updatedStyles =
        type === 'replace'
          ? {
              ...(styles[element.id] || styles[ALL_ELEMENTS_INDEX]),
            }
          : {
              ...stylesToUpdate,
              ...(styles[element.id] || styles[ALL_ELEMENTS_INDEX]),
            };
      const updatedElement = {
        ...element,
        styles: {
          ...element.styles,
          ...(pseudoClass
            ? {
                pseudoClassStyles: {
                  ...element.styles.pseudoClassStyles,
                  [pseudoClass]: updatedStyles,
                },
                pseudoClassViewStyles: {
                  ...element.styles.ownStyles,
                  ...updatedStyles,
                },
              }
            : {
                ownStyles: updatedStyles,
                pseudoClassViewStyles: null,
              }),
        },
      };
      return updatedElement;
    });

    const elements = elementsToUpdate.reduce(
      (acc, element) => ({
        ...acc,
        [element.id]: element,
      }),
      {},
    );
    yield put(Actions.updateMultipleStateElements(elements));

    const data = Object.values(elementsToUpdate).map((el) =>
      convertElementToPatchRequest(el as LibraryElement<Entity>),
    );

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data,
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

export const updateMultipleElementsStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateMultipleElementsStyles>) {
  yield call(updateOrReplaceMultipleElementsStyles, action, 'update');
});

export const replaceMultipleElementsStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.replaceMultipleElementsStyles>) {
  yield call(updateOrReplaceMultipleElementsStyles, action, 'replace');
});

export const removeMultipleElementsStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeMultipleElementsStyles>) {
  const { ids, cssPropertiesNames } = action.payload;

  if (!ids || !ids.length) {
    logger.error(
      `You have to provide list of elements' IDs for action ${action.type}`,
    );
    return;
  }

  if (!cssPropertiesNames || !cssPropertiesNames.length) {
    logger.error(
      `You have to provide list of CSS properties for action ${action.type}`,
    );
  }

  if (!action.meta) {
    logger.error(
      `You have to provide meta information for action ${action.type}`,
    );
    return;
  }

  try {
    const stateElements = yield select(selectElementsByIds(ids));

    if (!action.meta.useHistory) {
      const stylesState = stateElements.reduce(
        (acc, element) => ({
          ...acc,
          [element.id]: element.styles.ownStyles,
        }),
        {},
      );
      yield put(
        Actions.addUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            ...action.meta,
          }),
        ),
      );
    }

    const elementsToUpdate = stateElements.map((elToUpdate) => ({
      ...elToUpdate,
      styles: {
        ...elToUpdate.styles,
        ownStyles: Object.keys(elToUpdate.styles.ownStyles)
          .filter((ruleName) => !cssPropertiesNames.includes(ruleName))
          .map((ruleName) => ({
            [ruleName]: elToUpdate.styles.ownStyles[ruleName],
          })),
      },
    }));

    yield put(
      Actions.updateMultipleStateElements(
        elementsToUpdate.reduce(
          (acc, element) => ({ ...acc, [element.id]: element }),
          {},
        ),
      ),
    );

    const data = elementsToUpdate.map((element: LibraryElement<any>) =>
      convertElementToPatchRequest(element),
    );

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data,
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

export const replaceElementStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.replaceElementStyles>) {
  try {
    yield call(updateOrReplaceElementStyles, action, 'replace');
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

export const removeElementStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.removeElementStyles>) {
  try {
    const { id, cssPropertiesNames } = action.payload;

    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    if (!action.meta.useHistory) {
      const oldStyles = yield select(selectElementStyles(id));
      yield put(
        Actions.addUndoActions(
          Actions.updateElementStyles(id, oldStyles, { ...action.meta }),
        ),
      );
    }

    yield call(removeElementStyles, id, cssPropertiesNames, action);
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

export function* updateElementImage(
  elementId: string,
  image: File,
  meta: ElementHistoryMeta,
) {
  const parsedID = parseInt(elementId);
  const formData = new FormData();
  formData.append('image', new Blob([image]), image.name);

  const {
    result: changedElement,
    error,
  }: ReturnPromisedType<typeof apiUpdateElement> = yield call(
    reqWrapper,
    apiUpdateElement,
    { data: formData, id: parsedID },
  );
  if (changedElement) {
    yield call(
      updateOrReplaceElementParameters,
      Actions.updateElementParameters(
        elementId,
        {
          ...changedElement.parameters,
          imageURL: changedElement.image,
          imageSize: {
            width: 0,
            height: 0,
          },
          width: 'auto',
          height: 'auto',
        },
        { ...meta },
      ),
      UpdateDataActionType.UPDATE,
    );
    const selectedListId = yield select(selectCurrentAssetListId);
    const assetLists = yield select(selectAllAssetLists);
    const listId =
      selectedListId || assetLists.length ? assetLists[0].id : null;
    if (listId && changedElement.image) {
      yield put(
        Actions.uploadElementAsset(
          changedElement.id,
          {
            imageURL: changedElement.image,
          },
          listId,
          meta,
        ),
      );
    } else {
      throw new Error(
        !listId ? 'Asset lists are not loaded' : 'Could not save image',
      );
    }
  }
  if (error) throw new Error(error);
}

export const updateElementImageSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateElementImage>) {
  try {
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { itemID, image } = action.payload;
    yield call(updateElementImage, itemID, image, action.meta);
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

export const updateElementParametersSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.updateElementParameters>) {
  yield call(
    updateOrReplaceElementParameters,
    action,
    UpdateDataActionType.UPDATE,
  );
});

export const replaceElementParametersSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.replaceElementParameters>) {
  yield call(
    updateOrReplaceElementParameters,
    action,
    UpdateDataActionType.REPLACE,
  );
});

export const updateMultipleElementsParametersSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (
  action: ReturnType<typeof Actions.updateMultipleElementsParameters>,
) {
  yield call(
    updateOrReplaceMultipleElementsParameters,
    action,
    UpdateDataActionType.UPDATE,
  );
});

export const replaceMultipleElementsParametersSaga = withActionsHistory(
  function* (
    action: ReturnType<typeof Actions.replaceMultipleElementsParameters>,
  ) {
    yield call(
      updateOrReplaceMultipleElementsParameters,
      action,
      UpdateDataActionType.REPLACE,
    );
  },
);

export function* loadCustomElementsSaga(
  action: ReturnType<typeof Actions.loadCustomElements>,
) {
  try {
    const pagination = yield select(selectCustomElementsPagination);
    yield put(Actions.updateElementsLoading(true));
    const { result, error }: Result<PaginatedResponse<LibraryElement<Entity>>> =
      yield call(reqWrapper, apiGetCustomLibraryElements, {
        params: {
          cursor: pagination.next,
          page_size: pagination.pageSize,
        },
      });
    if (result) {
      yield put(Actions.addCustomElementsPage(result, action.payload.initial));
      yield put(Actions.addElements(result.results));
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
}

export const setActiveElementSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
)(function* (action: ReturnType<typeof Actions.setActiveElement>) {
  yield put(Actions.setEnabledPseudoClass(null));
  yield put(Actions.setEditableStyles('ownStyles'));
  yield put(Actions.setActiveElementId(action.payload));
  yield put(Actions.setCanCreateGroup(false));
  yield put(Actions.setSelectedElements([action.payload]));
});

export const setActiveNNModel = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
)(function* (action: ReturnType<typeof Actions.setActiveNNModel>) {
  yield put(Actions.setActiveNNModel(action.payload.model));
});

export const toggleSelectedElementSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
)(function* (action: ReturnType<typeof Actions.toggleSelectedElement>) {
  const isElementSelected = yield select(selectIsElementSelected);
  if (isElementSelected) {
    const element = yield select(selectElementById, action.payload.id);
    const selectedElementsIds = yield select(selectSelectedElementsIds);
    const selectedElements = yield select(
      selectElementsByIds(selectedElementsIds),
    );
    if (selectedElements[0].type === element.type) {
      const buoyancies = [element, ...selectedElements].map(
        (el) => el.buoyancy,
      );
      const minBuoyancy = Math.min(...buoyancies);
      const maxBuoyancy = Math.max(...buoyancies);
      const canCreateGroup =
        !!selectedElements.length &&
        selectedElements.every((el) => el.parent === element.parent) &&
        maxBuoyancy - minBuoyancy === selectedElements.length &&
        !selectedElements.filter(
          (groupEl) =>
            !!groupEl.parameters.groupElements ||
            !!groupEl.parameters.sourceElementId,
        ).length;
      yield put(Actions.setCanCreateGroup(canCreateGroup));
      yield put(Actions.addSelectedElement(action.payload.id));
    }
  } else {
    yield put(Actions.removeSelectedElement(action.payload.id));
  }
});

export const createElementsGroupSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.createElementsGroup>) {
  if (!action.meta) {
    yield put(
      enqueueSnackbar({
        message: `You should provide meta information for action ${action.type}`,
        options: { variant: 'error' },
      }),
    );
  }
  const { name, ids } = action.payload;
  const { screenId, useHistory } = action.meta;

  try {
    // create group container
    const activeElement = yield select(selectActiveElement);
    const wrappers = yield call(
      wrapIntoContainer,
      {
        containerType: 'group',
        name,
        ids,
      },
      {
        ...action.meta,
        useHistory: true, // prevent setting inner redo actions
      },
    );

    const wrapperGroupId = wrappers[0];
    const masterGroupsElId = yield select(selectMasterGroupsElementId);
    const masterGroupsEl = yield select(selectElementAsTree(masterGroupsElId));

    const copiedGroupResult = yield call(
      duplicateElements,
      {
        itemsToCopyInfo: [{ id: wrapperGroupId, screenID: screenId }],
        targetParent: masterGroupsEl,
      },
      {
        ...action.meta,
        useHistory: true, // prevent setting inner redo actions
      },
    );

    const existingGroupsIds = masterGroupsEl.children.map(({ id }) => id);
    const groupId = `${copiedGroupResult.find(
      (id) => !existingGroupsIds.includes(id),
    )}`;

    const childIds = yield select(selectTreeChildElementsIds(groupId));
    const allGroupIds = [groupId, ...childIds];
    const state = yield select(selectAllElements);

    const idsToUpdate: string[] = [];
    const paramsToUpdate = allGroupIds.reduce((allParams, id) => {
      const groupElement = state[id];
      const instanceElement = state[groupElement.parameters.originalElementId];
      idsToUpdate.push(groupElement.id, instanceElement.id);
      return {
        ...allParams,
        [groupElement.id]: {
          groupElements: [instanceElement.id],
          ...(groupElement.id === groupId ? { isGroup: true } : {}),
        },
        [instanceElement.id]: {
          sourceElementId: groupElement.id,
        },
      };
    }, {});

    yield call(
      updateOrReplaceMultipleElementsParameters,
      Actions.updateMultipleElementsParameters(idsToUpdate, paramsToUpdate, {
        ...action.meta,
        useHistory: true, // prevent setting inner redo actions
      }),
      UpdateDataActionType.UPDATE,
    );

    if (!useHistory) {
      const masterGroupChildrenIds = masterGroupsEl.children.map(
        (child) => child.id,
      );
      const oldElementsParams = idsToUpdate.reduce(
        (allParams, id) => ({
          ...allParams,
          [id]: state[id].parameters,
        }),
        {},
      );
      yield put(
        Actions.addUndoActions([
          Actions.unwrapFromContainer(
            ids,
            wrapperGroupId,
            activeElement.parent,
            {
              ...action.meta,
              useHistory: true,
            },
          ),
          Actions.deleteElement(groupId, { ...action.meta, useHistory: true }),
          Actions.replaceMultipleElementsParameters(
            idsToUpdate,
            oldElementsParams,
            {
              ...action.meta,
              useHistory: true,
            },
          ),
        ]),
      );
      yield put(
        Actions.addRedoActions([
          Actions.redoWrapIntoContainer(
            ids,
            wrapperGroupId,
            activeElement.parent,
            {
              ...action.meta,
              useHistory: true,
            },
          ),
          Actions.restoreElementChildren(
            masterGroupsEl.id,
            [...masterGroupChildrenIds, groupId],
            {
              ...action.meta,
              useHistory: true,
            },
          ),
          Actions.updateMultipleElementsParameters(
            allGroupIds,
            paramsToUpdate,
            {
              ...action.meta,
              useHistory: true,
            },
          ),
        ]),
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

export const uploadElementImageByUrlSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.uploadImageByUrl>) {
  if (!action.meta) {
    yield put(
      enqueueSnackbar({
        message: 'No meta information is provided',
        options: { variant: 'error' },
      }),
    );
    return;
  }

  const { elementId, imageData, listId } = action.payload;
  const { url, useInBackground } = imageData;
  try {
    const assetName = url.slice(url.lastIndexOf('/') + 1);
    const { error: uploadError, filename: backendImageURL } = yield call(
      reqWrapper,
      apiGetFile,
      {
        fileUrl: url,
      },
    );

    if (uploadError) {
      yield put(
        enqueueSnackbar({
          message: uploadError.message,
          options: { variant: 'error' },
        }),
      );
      return;
    }

    yield call(
      uploadAssetHelper,
      {
        assetFile: null,
        listId,
        fileName: assetName,
        imageURL: backendImageURL,
      },
      { ...action.meta },
    );

    if (useInBackground) {
      yield call(
        updateOrReplaceElementStyles,
        Actions.updateElementStyles(
          elementId,
          {
            backgroundImage: `url(${backendImageURL})`,
          },
          { ...action.meta },
        ),
        UpdateDataActionType.UPDATE,
      );
    } else {
      yield call(
        updateOrReplaceElementParameters,
        Actions.updateElementParameters(
          elementId,
          { imageURL: backendImageURL },
          { ...action.meta },
        ),
        UpdateDataActionType.UPDATE,
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

export const unbindGroupElementStylesSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* (action: ReturnType<typeof Actions.unbindGroupElementStyles>) {
  const { id, styles } = action.payload;
  if (!action.meta) {
    yield put(
      enqueueSnackbar({
        message: 'Action meta was not provided',
        options: { variant: 'error' },
      }),
    );
    return;
  }
  try {
    const element = yield select(selectElementById, id);
    const sourceElement = yield select(
      selectElementById,
      element.parameters.sourceElementId,
    );
    const { groupElements } = sourceElement.parameters;
    const paramsToUpdate = {
      [sourceElement.id]: {
        ...sourceElement.parameters,
        groupElements: groupElements.filter((elId) => elId !== id),
      },
      [element.id]: {
        ...Object.keys(element.parameters)
          .filter((paramName) => paramName !== 'sourceElementId')
          .reduce(
            (allParams, paramName) => ({
              ...allParams,
              [paramName]: element.parameters[paramName],
            }),
            {},
          ),
      },
    };
    yield call(
      updateOrReplaceMultipleElementsParameters,
      Actions.replaceMultipleElementsParameters(
        [id, sourceElement.id],
        paramsToUpdate,
        action.meta,
      ),
      UpdateDataActionType.REPLACE,
    );
    yield call(
      updateOrReplaceElementStyles,
      Actions.updateElementStyles(id, styles, action.meta),
      UpdateDataActionType.UPDATE,
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

export function* processDropTargetParamsSaga(
  action: ReturnType<typeof Actions.processDropTargetParams>,
) {
  const { elementId, rect, isHorizontal, offset } = action.payload;
  const element = yield select(selectElementById, elementId);
  const dropTargetParams = yield select(selectCurrentDropTargetParams);

  const elementIsContainer =
    !element.parent || CONTAINER_GROUPS.includes(element?.parameters.group);

  let newDropPosition = DropPosition.INSIDE;

  let offsetParam = offset.y;
  let sizeParam = rect.height;
  let posParam = rect.y;
  if (isHorizontal) {
    offsetParam = offset.x;
    posParam = rect.x;
    sizeParam = rect.width;
  }

  if (
    offsetParam > posParam &&
    offsetParam < posParam + (elementIsContainer ? 10 : sizeParam / 2)
  ) {
    newDropPosition = isHorizontal ? DropPosition.BEFORE : DropPosition.ABOVE;
  } else if (elementIsContainer && offsetParam < posParam + sizeParam - 10) {
    newDropPosition = DropPosition.INSIDE;
  } else {
    newDropPosition = isHorizontal ? DropPosition.AFTER : DropPosition.BELOW;
  }

  if (
    dropTargetParams?.id !== elementId ||
    dropTargetParams.position !== newDropPosition
  ) {
    yield putResolve(
      Actions.setCurrentDropTargetParams(elementId, newDropPosition),
    );
  }
}

export function* processDropElementSaga(
  action: ReturnType<typeof Actions.processDropElement>,
) {
  const { dragSource, dropType } = action.payload;
  const dropTargetParams = yield select(selectCurrentDropTargetParams);
  if (
    dropType === ElementType.ELEMENT &&
    dropTargetParams.id === dragSource.id
  ) {
    return;
  }
  const screenId = yield select(selectCurrentScreenId);
  const dropTarget = yield select(selectElementById, dropTargetParams.id);
  const elementIsContainer =
    !dropTarget.parent ||
    CONTAINER_GROUPS.includes(dropTarget.parameters.group);

  let dropBuoyancy = dropTarget.buoyancy;
  if (dropTargetParams.position === DropPosition.INSIDE) {
    dropBuoyancy = dropTarget.children.length;
  } else if (
    [DropPosition.AFTER, DropPosition.BELOW].includes(dropTargetParams.position)
  ) {
    dropBuoyancy = dropTarget.buoyancy + 1;
  }
  const newParentId = elementIsContainer ? dropTarget.id : dropTarget.parent;
  if (dropType === ElementType.ELEMENT) {
    const dragSourceEl = dragSource as StateElement;
    yield put(
      Actions.moveElement(
        dragSourceEl.id,
        {
          oldIndex: (dragSource as StateElement).buoyancy,
          newIndex: dropBuoyancy,
        },
        {
          oldParentId: (dragSource as StateElement).parent || '',
          newParentId,
        },
        { screenId },
      ),
    );
  } else {
    const { id, type, name, custom, parameters } = dragSource as ElementData;
    yield put(
      Actions.createElements(
        {
          createdElements: [{ id, type, name, custom, parameters }],
          parentId: newParentId,
          index: dropBuoyancy,
        },
        { screenId },
      ),
    );
  }
  yield put(Actions.setCurrentDropTargetParams(null));
}

export const setEnabledPseudoClass = function* (
  action: ReturnType<typeof Actions.setEnabledPseudoClass>,
) {
  const { pseudoClass, elementId } = action.payload;
  const previousPseudoClass = yield select(selectEnabledPseudoClass);
  if (pseudoClass === previousPseudoClass) {
    return;
  }
  const activeElementId = yield select(selectActiveElementId);
  const element = yield select(selectElementById, elementId || activeElementId);
  if (element) {
    const pseudoClassViewStyles = pseudoClass
      ? {
          ...element.styles.ownStyles,
          ...(element.styles.pseudoClassStyles &&
          element.styles.pseudoClassStyles[pseudoClass]
            ? element.styles.pseudoClassStyles[pseudoClass]
            : {}),
        }
      : null;
    yield put(
      Actions.updateStateElement(element.id, {
        styles: {
          ...element.styles,
          pseudoClassViewStyles,
        },
      }),
    );
  }
  yield put(Actions.setStatePseudoClass(pseudoClass));
};

export const setEnabledPseudoClassSaga = withRequiredPermissions(
  UserProjectPermission.VIEW_PROJECT,
)(setEnabledPseudoClass);
