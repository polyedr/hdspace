/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';
import {
  selectCustomElementsPagination,
  selectElementParameters,
  selectElementStyles,
  selectElementsForScreen,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
  selectIsElementSelected,
  selectElementsByIds,
  selectSelectedElementsIds,
  selectTreeChildElementsIds,
  selectMasterGroupsElementId,
  selectActiveElement,
} from '@Redux/project/selectors/element';
import { selectCurrentProject } from '@Redux/project/selectors/base';

import {
  convertElementToPatchRequest,
  convertElementToRequest,
} from '@Api/converters/toRequest';
import {
  getElementsArray,
  getTreeWithDefaultStylesAndParams,
} from '@Utils/ElementsTreeHelper';
import {
  apiUpdateElement,
  apiChangeRecursiveElement,
  apiUpdateElements,
  parseImgUsingNN,
  apiGetCustomLibraryElements,
} from '@Api/element';
import generateUniqueName from '@Utils/generateUniqueName';
import getSavedValue from '@Utils/getSavedValue';
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
} from '@Src/types';
import { ElementHistoryMeta } from '@Redux/types';
import { reqWrapper, projectUpdateHelperSaga } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { createElements, wrapIntoContainer } from './scenario';
import withActionsHistory from '../wrappers/withActionsHistory';

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
    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.moveElement(
            elementId,
            { oldIndex: newIndex, newIndex: oldIndex },
            { oldParentId: newParentId, newParentId: oldParentId },
            { screenId, useHistory },
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
    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      if (type === 'add') {
        yield put(
          Actions.addUndoActions(
            Actions.removeElementClassName(elementId, newClassName, {
              screenId,
            }),
          ),
        );
      } else {
        yield put(
          Actions.addUndoActions(
            Actions.addElementClassName(elementId, newClassName, { screenId }),
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

    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      yield put(
        Actions.addUndoActions([
          Actions.removeElementClassName(elementID, uniqueClassName, {
            screenId,
          }),
          Actions.updateProject(currentProject),
          Actions.updateElementStyles(elementID, styles, { screenId }),
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

function* updateOrReplaceElementStyles(
  action: ReturnType<
    typeof Actions.updateElementStyles | typeof Actions.replaceElementStyles
  >,
  type: 'replace' | 'update',
) {
  try {
    const { id, styles } = action.payload;

    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }

    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      const oldStyles = yield select(selectElementStyles(id));
      yield put(
        Actions.addUndoActions(
          Actions.replaceElementStyles(id, oldStyles, { screenId, useHistory }),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);
    yield put(
      Actions.updateStateElement(
        id,
        {
          styles: {
            ...state[id].styles,
            ownStyles:
              type === 'replace'
                ? styles
                : {
                    ...state[id].styles.ownStyles,
                    ...styles,
                  },
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

function* updateOrReplaceElementParameters(
  action: ReturnType<
    | typeof Actions.updateElementParameters
    | typeof Actions.replaceElementParameters
  >,
  type: UpdateDataActionType.REPLACE | UpdateDataActionType.UPDATE,
) {
  try {
    const { elementId, parameters } = action.payload;
    if (!action.meta) {
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      const oldParameters = yield select(selectElementParameters(elementId));
      yield put(
        Actions.addUndoActions(
          Actions.replaceElementParameters(elementId, oldParameters, {
            screenId,
          }),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(
      selectElementsForScreen(screenId),
    );

    const parametersToUpdate =
      type === UpdateDataActionType.UPDATE
        ? { ...parameters }
        : { ...state[elementId].parameters, ...parameters };

    yield put(
      Actions.updateStateElement(
        elementId,
        {
          parameters: parametersToUpdate,
        },
        {
          ...action.meta,
        },
      ),
    );

    const updatedElement: StateElement = yield select(
      selectElementById(elementId),
    );

    yield put(
      Actions.updateSavedElementValues(
        elementId,
        getSavedValue(updatedElement),
      ),
    );

    const updatedElementTree: LibraryElement<any> = yield select(
      selectElementAsTree(elementId),
    );

    const convertedElement = convertElementToPatchRequest(updatedElementTree);
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

function* updateOrReplaceMultipleElementsParameters(
  action: ReturnType<
    | typeof Actions.updateMultipleElementsParameters
    | typeof Actions.replaceMultipleElementsParameters
  >,
  type: UpdateDataActionType.REPLACE | UpdateDataActionType.UPDATE,
) {
  if (!action.meta) {
    yield put(
      enqueueSnackbar({
        message: 'Action meta is not defined',
        options: { variant: 'error' },
      }),
    );
    return;
  }
  const { ids, parameters } = action.payload;
  const { useHistory } = action.meta;

  try {
    const elements = yield select(selectElementsByIds(ids));

    const updatedElements = elements.map((elem) => {
      const inputParameters =
        type === UpdateDataActionType.UPDATE ? { ...elem.parameters } : {};
      const parametersToUpdate =
        parameters[elem.id] || parameters[ALL_ELEMENTS_INDEX] || {};
      return {
        ...elem,
        parameters: {
          ...inputParameters,
          ...parametersToUpdate,
        },
      };
    });
    yield put(
      Actions.updateMultipleStateElements(
        updatedElements.reduce(
          (acc, elem) => ({ ...acc, [elem.id]: elem }),
          {},
        ),
      ),
    );

    if (!useHistory) {
      yield put(
        Actions.addUndoActions(
          Actions.replaceMultipleElementsParameters(
            ids,
            elements.reduce(
              (acc, elem) => ({ ...acc, [elem.id]: elem.parameters }),
              {},
            ),
            {
              ...action.meta,
            },
          ),
        ),
      );
    }
    const convertedElements = updatedElements.map((updatedEl) => {
      return convertElementToPatchRequest(updatedEl);
    });
    const { error }: Result<LibraryElement<any>> = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data: convertedElements,
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

    const { screenId, useHistory } = action.meta;

    const stateElements = yield select(selectElementsByIds(ids));
    if (!useHistory) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.addUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            screenId,
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
    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.addUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            screenId,
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

    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      const oldStyles = yield select(selectElementStyles(id));
      yield put(
        Actions.addUndoActions(
          Actions.updateElementStyles(id, oldStyles, { screenId }),
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
    const { screenId } = action.meta;

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
      yield put(
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
          { screenId },
        ),
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
    formData.append('parent_id', parentId);
    formData.append('struct_type', 'container');
    formData.append('func_type', 'container');
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', screenId.toString());
    formData.append(
      'parameters',
      JSON.stringify({
        block_type: blockType,
        styles_on: file.stylesOn === true ? '1' : '0',
      }),
    );
    formData.append('styles', '{}');

    const {
      result: nnContainer,
      error: nnError,
    }: Result<LibraryElement<any>> = yield call(reqWrapper, parseImgUsingNN, {
      data: formData,
      contentType: 'multipart/form-data',
    });
    if (nnContainer) {
      const nnContainerWithDefaultParams = getTreeWithDefaultStylesAndParams(
        nnContainer,
      );

      const convertedElements = getElementsArray(
        nnContainerWithDefaultParams,
      ).map((element) => convertElementToPatchRequest(element));

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
          Actions.addStateElements([nnContainerWithDefaultParams], parentId, {
            ...meta,
          }),
        );

        if (!useHistory) {
          yield put(
            Actions.addHistoryActions({
              undo: [
                Actions.deleteElement(nnContainerWithDefaultParams.id, {
                  screenId,
                }),
              ],
              redo: [
                Actions.restoreElement(nnContainerWithDefaultParams.id, {
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
      if (error) throw new Error(error);
    }
    if (nnError) throw new Error(nnError);
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

    const paramsToUpdate = allGroupIds.reduce((allParams, id) => {
      const groupElement = state[id];
      const instanceElement = state[groupElement.parameters.originalElementId];
      return {
        ...allParams,
        [groupElement.id]: {
          groupElements: [instanceElement.id],
        },
        [instanceElement.id]: {
          sourceElementId: groupElement.id,
        },
      };
    });

    yield call(
      updateOrReplaceMultipleElementsParameters,
      Actions.updateMultipleElementsParameters(allGroupIds, paramsToUpdate, {
        ...action.meta,
        useHistory: true, // prevent setting inner redo actions
      }),
      UpdateDataActionType.UPDATE,
    );

    if (!useHistory) {
      const masterGroupChildrenIds = masterGroupsEl.children.map(
        (child) => child.id,
      );
      const oldElementsParams = allGroupIds.reduce((allParams, id) => {
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
            allGroupIds,
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

/* export function* uploadElementImageByUrlSaga(
  action: ReturnType<typeof Actions.uploadImageByUrl>,
) {} */
