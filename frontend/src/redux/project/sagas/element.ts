/* eslint-disable no-console */
import { put, call, select, all } from 'redux-saga/effects';
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
  selectCurrentRoot,
} from '@Redux/project/selectors/element';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import {
  convertElementToPatchRequest,
  convertElementToRequest,
} from '@Api/converters/toRequest';
import { getElementsArray } from '@Utils/ElementsTreeHelper';
import {
  apiUpdateElement,
  apiChangeRecursiveElement,
  apiUpdateElements,
  parseImgUsingNN,
  apiGetCustomLibraryElements,
  recognizeImgUsingNN,
} from '@Api/element';
import generateUniqueName from '@Utils/generateUniqueName';
import { addProjectStyles } from '@Utils/ProjectClassesHelper';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
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
  Screen,
  VIAFile,
} from '@Src/types';
import { ElementHistoryMeta } from '@Redux/types';
import { convertVIARegionToLibraryElement } from '@Api/converters/fromResponse';
import { apiGetFile } from '@Api/import';
import { reqWrapper, projectUpdateHelperSaga } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { createElements, wrapIntoContainer } from './scenario';
import withActionsHistory from '../wrappers/withActionsHistory';
import { uploadAsset } from './asset';
import {
  updateOrReplaceElementParameters,
  updateOrReplaceElementStyles,
  updateOrReplaceMultipleElementsParameters,
} from './common';

// eslint-disable-next-line consistent-return
export function* duplicateElements(
  { itemsToCopyInfo, targetParent }: DuplicateElementsData,
  meta: ElementHistoryMeta,
) {
  try {
    const elements: LibraryElement<any>[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const el of itemsToCopyInfo) {
      const element = yield select(selectElementAsTree(el.id));
      elements.push(element);
    }

    const convertedItemsToDuplicate = elements.map((item) =>
      convertElementToRequest(item!, (originalEl, convertedEl) => {
        return {
          ...convertedEl,
          parameters: {
            ...convertedEl.parameters,
            originalElementId: originalEl.id,
          },
        };
      }),
    );

    return yield call(
      createElements,
      { elements: convertedItemsToDuplicate },
      targetParent,
      {
        ...meta,
      },
    );
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

export const moveElementSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.moveElement>,
) {
  try {
    const { indices, elementId, parents } = action.payload;

    const { newParentId, oldParentId } = parents;
    const { newIndex, oldIndex } = indices;

    if (!action.meta) {
      console.error(
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
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
      console.error(
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
      Actions.updateStateElement(
        elementId,
        {
          styles: {
            ...state[elementId].styles,
            classNames:
              type === 'add'
                ? [state[elementId].styles.classNames[0], newClassName]
                : state[elementId].styles.classNames.filter(
                    (name) => name !== newClassName,
                  ),
          },
        },
        { ...action.meta },
      ),
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
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
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);
    yield put(
      Actions.updateStateElement(
        id,
        {
          styles: {
            ...state[id].styles,
            ownStyles: Object.fromEntries(
              Object.entries(state[id].styles.ownStyles).filter(([rule]) =>
                cssPropertiesNames.every((name) => name !== rule),
              ),
            ),
          },
        },
        { ...action.meta },
      ),
    );

    const updatedElement: LibraryElement<any> = yield select(
      selectElementAsTree(id),
    );

    const convertedElement = convertElementToPatchRequest(updatedElement);
    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElement,
      { data: convertedElement, id },
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

export const copyElementStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.copyElementStyles>,
) {
  try {
    const { elementType, elementID, styles } = action.payload;

    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const currentProject: ReturnType<
      typeof selectCurrentProject
    > = yield select(selectCurrentProject);

    const sharedClassNames = currentProject.projectData.classes.map(
      (cssClass) => cssClass.className,
    );
    const uniqueClassName = generateUniqueName(
      `${elementType} group 1`,
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const addElementClassNameSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.addElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'add');
});

export const removeElementClassNameSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.removeElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'remove');
});

export const updateElementStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.updateElementStyles>,
) {
  try {
    yield call(updateOrReplaceElementStyles, action, 'update');
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const updateMultipleElementsStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.updateMultipleElementsStyles>,
) {
  try {
    const { ids, styles } = action.payload;

    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const stateElements = yield select(selectElementsByIds(ids));
    if (!action.meta.useHistory) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.addUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            ...action.meta,
          }),
        ),
      );
    }

    const elementsToUpdate = stateElements.map((element) => {
      return {
        ...element,
        styles: {
          ...element.styles,
          ownStyles: {
            ...element.styles.ownStyles,
            ...(styles[element.id] || styles[ALL_ELEMENTS_INDEX]),
          },
        },
      };
    });

    const elements = elementsToUpdate.reduce((acc, element) => {
      return {
        ...acc,
        [element.id]: element,
      };
    }, {});
    yield put(Actions.updateMultipleStateElements(elements));

    const data = Object.values(elementsToUpdate).map((el) =>
      convertElementToPatchRequest(el as LibraryElement<Entity>),
    );

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      { data },
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

export const removeMultipleElementsStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.removeMultipleElementsStyles>,
) {
  const { ids, cssPropertiesNames } = action.payload;

  if (!ids || !ids.length) {
    console.error(
      `You have to provide list of elements' IDs for action ${action.type}`,
    );
    return;
  }

  if (!cssPropertiesNames || !cssPropertiesNames.length) {
    console.error(
      `You have to provide list of CSS properties for action ${action.type}`,
    );
  }

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  try {
    const stateElements = yield select(selectElementsByIds(ids));

    if (!action.meta.useHistory) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.addUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            ...action.meta,
          }),
        ),
      );
    }

    const elementsToUpdate = stateElements.map((elToUpdate) => {
      return {
        ...elToUpdate,
        styles: {
          ...elToUpdate.styles,
          ownStyles: Object.keys(elToUpdate.styles.ownStyles)
            .filter((ruleName) => !cssPropertiesNames.includes(ruleName))
            .map((ruleName) => ({
              [ruleName]: elToUpdate.styles.ownStyles[ruleName],
            })),
        },
      };
    });

    yield put(
      Actions.updateMultipleStateElements(
        elementsToUpdate.reduce((acc, element) => {
          return { ...acc, [element.id]: element };
        }, {}),
      ),
    );

    const data = elementsToUpdate.map((element: LibraryElement<any>) =>
      convertElementToPatchRequest(element),
    );

    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      { data },
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

export const replaceElementStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.replaceElementStyles>,
) {
  try {
    yield call(updateOrReplaceElementStyles, action, 'replace');
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const removeElementStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.removeElementStyles>,
) {
  try {
    const { id, cssPropertiesNames } = action.payload;

    if (!action.meta) {
      console.error(
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const updateElementImageSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.updateElementImage>,
) {
  try {
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { itemID, image } = action.payload;

    const parsedID = parseInt(itemID);
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
          itemID,
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
          { ...action.meta },
        ),
        UpdateDataActionType.UPDATE,
      );
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

export const updateElementParametersSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.updateElementParameters>,
) {
  yield call(
    updateOrReplaceElementParameters,
    action,
    UpdateDataActionType.UPDATE,
  );
});

export const replaceElementParametersSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.replaceElementParameters>,
) {
  yield call(
    updateOrReplaceElementParameters,
    action,
    UpdateDataActionType.REPLACE,
  );
});

export const updateMultipleElementsParametersSaga = withActionsHistory(
  function* (
    action: ReturnType<typeof Actions.updateMultipleElementsParameters>,
  ) {
    yield call(
      updateOrReplaceMultipleElementsParameters,
      action,
      UpdateDataActionType.UPDATE,
    );
  },
);

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

export const uploadFileSaga = withActionsHistory(function* ({
  type,
  payload: { file, parentId, blockType },
  meta,
}: ReturnType<typeof Actions.uploadFile>) {
  try {
    if (!meta) {
      console.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    yield put(Actions.setAnalyzerLoader(true));

    const { screenId, useHistory } = meta;

    const formData = new FormData();

    formData.append('image', file.file, file.name);
    // formData.append('parent_id', parentId);
    // formData.append('struct_type', 'container');
    // formData.append('func_type', 'container');
    formData.append('name', 'image');
    // formData.append('screen', screenId.toString());
    formData.append(
      'screen_data_json',
      JSON.stringify({ block_type: blockType }),
    );
    // formData.append(
    //   'parameters',
    //   JSON.stringify({
    //     block_type: blockType,
    //     styles_on: file.stylesOn === true ? '1' : '0',
    //   }),
    // );
    // formData.append('styles', '{}');

    const {
      result: recognizeResult,
      error: recognizeError,
    }: Result<Screen> = yield call(reqWrapper, recognizeImgUsingNN, {
      data: formData,
      contentType: 'multipart/form-data',
    });

    if (recognizeResult) {
      if (!recognizeResult.screen_data_json) {
        throw new Error('No VIA data has been received');
      }

      const root: StateElement = yield select(selectCurrentRoot);

      yield all(
        root.children.map((childId) =>
          // put(Actions.deleteElement(childId, { screenId })),
          put(Actions.removeStateElement(childId, { screenId })),
        ),
      );

      yield put(Actions.changeFreeCanvasMode(true));
      yield put(Actions.setActiveElement(root.id));

      const viaFile = Object.values(
        JSON.parse(recognizeResult.screen_data_json) as {
          [key: string]: VIAFile;
        },
      )[0];

      const regions = viaFile.regions.map((region) =>
        convertVIARegionToLibraryElement(region),
      );

      yield put(Actions.addStateElements(regions, root.id, { screenId }));

      // console.log(viaFile);
      /*  const convertedElements = getElementsArray(recognizeResult).map((element) =>
        convertElementToPatchRequest(element),
      );

      const {
        result,
        error,
      }: Result<ServerElement<any>> = yield call(
        reqWrapper,
        apiUpdateElements,
        { data: convertedElements },
      );

      if (result) {
        yield put(
          Actions.addStateElements([recognizeResult], parentId, {
            ...meta,
          }),
        );

        if (!useHistory) {
          yield put(
            Actions.addHistoryActions({
              undo: [
                Actions.deleteElement(recognizeResult.id, {
                  screenId,
                }),
              ],
              redo: [
                Actions.restoreElement(recognizeResult.id, {
                  screenId,
                }),
              ],
            }),
          );
        }

        yield put(
          enqueueSnackbar({
            message: 'Image uploaded successfully',
            options: { variant: 'success' },
          }),
        );
      }
      if (error) throw new Error(error); */
    }
    if (recognizeError) throw new Error(recognizeError);
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
    if (process.env.NODE_ENV === 'development') {
      console.trace(e);
    }
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  } finally {
    yield put(Actions.setAnalyzerLoader(false));
  }
});

export function* loadCustomElementsSaga(
  action: ReturnType<typeof Actions.loadCustomElements>,
) {
  try {
    const pagination = yield select(selectCustomElementsPagination);
    yield put(Actions.updateElementsLoading(true));
    const {
      result,
      error,
    }: Result<PaginatedResponse<LibraryElement<Entity>>> = yield call(
      reqWrapper,
      apiGetCustomLibraryElements,
      {
        params: {
          cursor: pagination.next,
          page_size: pagination.pageSize,
        },
      },
    );
    if (result) {
      yield put(Actions.addCustomElementsPage(result, action.payload.initial));
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

export function* setActiveElementSaga(
  action: ReturnType<typeof Actions.setActiveElement>,
) {
  yield put(Actions.setEditableStyles('ownStyles'));
  yield put(Actions.setActiveElementId(action.payload));
  yield put(Actions.setCanCreateGroup(false));
  yield put(Actions.resetElementEditState());
  yield put(Actions.setSelectedElements([action.payload]));
}

export function* toggleSelectedElementSaga(
  action: ReturnType<typeof Actions.toggleSelectedElement>,
) {
  const isElementSelected = yield select(selectIsElementSelected);
  if (isElementSelected) {
    const element = yield select(selectElementById(action.payload.id));
    const selectedElementsIds = yield select(selectSelectedElementsIds);
    const selectedElements = yield select(
      selectElementsByIds(selectedElementsIds),
    );

    const buoyancies = [element, ...selectedElements].map((el) => el.buoyancy);
    const minBuoyancy = Math.min(...buoyancies);
    const maxBuoyancy = Math.max(...buoyancies);
    const canCreateGroup =
      !!selectedElements.length &&
      selectedElements.every((el) => el.parent === element.parent) &&
      maxBuoyancy - minBuoyancy === selectedElements.length;
    yield put(Actions.setCanCreateGroup(canCreateGroup));
    yield put(Actions.addSelectedElement(action.payload.id));
  } else {
    yield put(Actions.removeSelectedElement(action.payload.id));
  }
}

export const createElementsGroupSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.createElementsGroup>,
) {
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

    const idsToUpdate: Array<string> = [];
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
      const oldElementsParams = idsToUpdate.reduce((allParams, id) => {
        return {
          ...allParams,
          [id]: state[id].parameters,
        };
      }, {});
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
            { ...action.meta, useHistory: true },
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
            { ...action.meta, useHistory: true },
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});

export const uploadElementImageByUrlSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.uploadImageByUrl>,
) {
  if (!action.meta) {
    yield put(
      enqueueSnackbar({
        message: 'No meta information is provided',
        options: { variant: 'error' },
      }),
    );
    return;
  }

  const { elementId, url, listId } = action.payload;

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
      uploadAsset,
      {
        assetFile: null,
        listId,
        fileName: assetName,
        imageURL: backendImageURL,
      },
      { ...action.meta },
    );

    yield call(
      updateOrReplaceElementParameters,
      Actions.updateElementParameters(
        elementId,
        { imageURL: backendImageURL },
        { ...action.meta },
      ),
      UpdateDataActionType.UPDATE,
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

export const unbindGroupElementStylesSaga = withActionsHistory(function* (
  action: ReturnType<typeof Actions.unbindGroupElementStyles>,
) {
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
    const element = yield select(selectElementById(id));
    const sourceElement = yield select(
      selectElementById(element.parameters.sourceElementId),
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
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
});
