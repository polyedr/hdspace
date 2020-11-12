/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';
import {
  selectCustomElementsPagination,
  selectCurrentProject,
  selectElementParameters,
  selectElementStyles,
  selectElementsForScreen,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
  selectCurrentRootId,
  selectActiveElementId,
} from '../selectors';
import * as Actions from '../actions';
import { convertElementToPatchRequest } from '../../../api/converters/toRequest';
import {
  getElementsArray,
  getTreeWithDefaultStylesAndParams,
} from '../../../utils/ElementsTreeHelper';
import {
  apiChangeElement,
  apiChangeRecursiveElement,
  apiSaveElements,
  parseImgUsingNN,
  apiGetCustomLibraryElements,
} from '../../../api/element';
import generateUniqueName from '../../../utils/generateUniqueName';
import getSavedValue from '../../../utils/getSavedValue';
import { addProjectStyles } from '../../../utils/ProjectClassesHelper';
import { KEEP_RP_TAB_ELEMENTS } from '../../../constants/defaultParams';
import {
  LibraryElement,
  Normalized,
  ReturnPromisedType,
  RightPanelTab,
  StateElement,
} from '../../../types';
import { reqWrapper, updateProject } from './shared';

export function* moveElementSaga(
  action: ReturnType<typeof Actions.moveElement>,
) {
  const { indices, elementId, parents } = action.payload;

  const { newParentId, oldParentId } = parents;
  const { newIndex, oldIndex } = indices;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  if (!undo) {
    yield put(
      Actions.setUndoActions([
        Actions.removeBorderedElementRef(elementId),
        Actions.removeBorderedElementRef(oldParentId),
        Actions.removeBorderedElementRef(newParentId),
        Actions.moveElement(
          elementId,
          { oldIndex: newIndex, newIndex: oldIndex },
          { oldParentId: newParentId, newParentId: oldParentId },
          { screenId },
        ),
      ]),
    );
  }

  yield put(
    Actions.moveStateElement(elementId, indices, parents, {
      ...action.meta,
      sourceAction: action,
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

  yield call(reqWrapper, apiSaveElements, { data: convertedElements });

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedNewParent.children.map((el) => el.id) },
    id: newParentId,
  });
}

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
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  if (!undo) {
    if (type === 'add') {
      yield put(
        Actions.setUndoActions(
          Actions.removeElementClassName(elementId, newClassName, { screenId }),
        ),
      );
    } else {
      yield put(
        Actions.setUndoActions(
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
      { ...action.meta, sourceAction: action },
    ),
  );

  const updatedElement: LibraryElement<any> = yield select(
    selectElementAsTree(elementId),
  );

  const convertedElement = convertElementToPatchRequest(updatedElement);

  yield call(reqWrapper, apiChangeElement, {
    data: convertedElement,
    id: elementId,
  });
}

function* removeElementStyles(
  id: string,
  cssPropertiesNames: string[],
  action: ReturnType<
    typeof Actions.removeElementStyles | typeof Actions.copyElementStyles
  >,
) {
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
      { ...action.meta, sourceAction: action },
    ),
  );

  const updatedElement: LibraryElement<any> = yield select(
    selectElementAsTree(id),
  );

  const convertedElement = convertElementToPatchRequest(updatedElement);
  yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
}

export function* copyElementStylesSaga(
  action: ReturnType<typeof Actions.copyElementStyles>,
) {
  const { elementType, elementID, styles } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const currentProject: ReturnType<typeof selectCurrentProject> = yield select(
    selectCurrentProject,
  );

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
  yield call(updateProject, newProject);

  yield call(removeElementStyles, elementID, Object.keys(styles), action);

  const { screenId, undo } = action.meta;

  if (!undo) {
    yield put(
      Actions.setUndoActions([
        Actions.removeElementClassName(elementID, uniqueClassName, {
          screenId,
        }),
        Actions.updateProject(currentProject),
        Actions.updateElementStyles(elementID, styles, { screenId }),
      ]),
    );
  }
}

export function* addElementClassNameSaga(
  action: ReturnType<typeof Actions.addElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'add');
}

export function* removeElementClassNameSaga(
  action: ReturnType<typeof Actions.removeElementClassName>,
) {
  const { elementID, className } = action.payload;
  yield call(updateElementClassNames, elementID, className, action, 'remove');
}

function* updateOrReplaceElementStyles(
  action: ReturnType<
    typeof Actions.updateElementStyles | typeof Actions.replaceElementStyles
  >,
  type: 'replace' | 'update',
) {
  const { id, styles } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { screenId, undo } = action.meta;

  if (!undo) {
    const oldStyles = yield select(selectElementStyles(id));
    yield put(
      Actions.setUndoActions(
        Actions.replaceElementStyles(id, oldStyles, { screenId }),
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
      { ...action.meta, sourceAction: action },
    ),
  );

  const updatedElement: LibraryElement<any> = yield select(
    selectElementAsTree(id),
  );

  const convertedElement = convertElementToPatchRequest(updatedElement);
  yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
}

export function* updateElementStyles(
  action: ReturnType<typeof Actions.updateElementStyles>,
) {
  yield call(updateOrReplaceElementStyles, action, 'update');
}

export function* replaceElementStylesSaga(
  action: ReturnType<typeof Actions.replaceElementStyles>,
) {
  yield call(updateOrReplaceElementStyles, action, 'replace');
}

export function* removeElementStylesSaga(
  action: ReturnType<typeof Actions.removeElementStyles>,
) {
  const { id, cssPropertiesNames } = action.payload;

  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }

  const { screenId, undo } = action.meta;

  if (!undo) {
    const oldStyles = yield select(selectElementStyles(id));
    yield put(
      Actions.setUndoActions(
        Actions.updateElementStyles(id, oldStyles, { screenId }),
      ),
    );
  }

  yield call(removeElementStyles, id, cssPropertiesNames, action);
}

export function* updateElementImage(
  action: ReturnType<typeof Actions.updateElementImage>,
) {
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

  const changedElement: ReturnPromisedType<typeof apiChangeElement> = yield call(
    reqWrapper,
    apiChangeElement,
    { data: formData, id: parsedID },
  );

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
      },
      { screenId },
    ),
  );
}

export function* updateElementParameters(
  action: ReturnType<typeof Actions.updateElementParameters>,
) {
  const { elementId, parameters } = action.payload;
  if (!action.meta) {
    console.error(
      `You have to provide metainformation for action ${action.type}`,
    );
    return;
  }
  const { screenId, undo } = action.meta;

  if (!undo) {
    const oldParameters = yield select(selectElementParameters(elementId));
    yield put(
      Actions.setUndoActions(
        Actions.updateElementParameters(elementId, oldParameters, { screenId }),
      ),
    );
  }

  const state: Normalized<StateElement> = yield select(
    selectElementsForScreen(screenId),
  );
  yield put(
    Actions.updateStateElement(
      elementId,
      {
        parameters: { ...state[elementId].parameters, ...parameters },
      },
      {
        ...action.meta,
        sourceAction: action,
      },
    ),
  );

  const updatedElement: StateElement = yield select(
    selectElementById(elementId),
  );

  yield put(
    Actions.updateSavedElementValues(elementId, getSavedValue(updatedElement)),
  );

  const updatedElementTree: LibraryElement<any> = yield select(
    selectElementAsTree(elementId),
  );

  const convertedElement = convertElementToPatchRequest(updatedElementTree);
  yield call(reqWrapper, apiChangeElement, {
    data: convertedElement,
    id: elementId,
  });
}

export function* uploadFileSaga({
  type,
  payload: { file, parentId, blockType },
  meta,
}: ReturnType<typeof Actions.uploadFile>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  yield put(Actions.setAnalyzerLoader(true));
  const { screenId } = meta;
  try {
    const formData = new FormData();
    formData.append('image', file.file, file.name);
    formData.append('parent_id', parentId);
    formData.append('struct_type', 'container');
    formData.append('func_type', 'container');
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', screenId.toString());
    formData.append('parameters', JSON.stringify({ block_type: blockType }));
    formData.append('styles', '{}');

    const nnContainer: LibraryElement<any> = yield call(
      reqWrapper,
      parseImgUsingNN,
      {
        data: formData,
        contentType: 'multipart/form-data',
      },
    );

    const nnContainerWithDefaultParams = getTreeWithDefaultStylesAndParams(
      nnContainer,
    );

    const convertedElements = getElementsArray(
      nnContainerWithDefaultParams,
    ).map((element) => convertElementToPatchRequest(element));

    yield call(reqWrapper, apiSaveElements, { data: convertedElements });

    yield put(
      Actions.setUndoActions(
        Actions.deleteItem(nnContainerWithDefaultParams.id, { screenId }),
      ),
    );

    yield put(
      Actions.addStateElements([nnContainerWithDefaultParams], parentId, {
        ...meta,
        sourceAction: Actions.restoreElement(nnContainerWithDefaultParams.id, {
          screenId,
        }),
      }),
    );
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
    if (process.env.NODE_ENV === 'development') {
      console.trace(e);
    }
  } finally {
    yield put(Actions.setAnalyzerLoader(false));
  }
}

export function* loadCustomElementsSaga(
  action: ReturnType<typeof Actions.loadCustomElements>,
) {
  const pagination = yield select(selectCustomElementsPagination);
  yield put(Actions.updateElementsLoading(true));
  const paginatedResult = yield call(reqWrapper, apiGetCustomLibraryElements, {
    params: {
      cursor: pagination.next,
      page_size: pagination.pageSize,
    },
  });
  yield put(
    Actions.addCustomElementsPage(paginatedResult, action.payload.initial),
  );
}

export function* setActiveElementSaga(
  action: ReturnType<typeof Actions.setActiveElement>,
) {
  const element = yield select(selectElementById(action.payload));
  const prevActiveId = yield select(selectActiveElementId);
  const rootID = yield select(selectCurrentRootId);
  if (prevActiveId === action.payload) {
    return;
  }
  if (
    element &&
    !KEEP_RP_TAB_ELEMENTS.includes(element.type) &&
    element.id !== rootID
  ) {
    yield put(Actions.setRightPanelActiveTab(RightPanelTab.PROPERTIES));
  }
  yield put(Actions.setActiveElementId(action.payload));
}
