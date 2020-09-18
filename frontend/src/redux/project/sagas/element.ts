/* eslint-disable no-console */

import { put, call, select } from 'redux-saga/effects';

import * as Actions from '../actions';

import { reqWrapper } from './index';
import { ReturnPromisedType } from '../../../shared/types';
import { convertElementToPatchRequest } from '../../../api/converters/toRequest';
import { LibraryElement } from '../../../api/types';
import {
  selectCurrentProject,
  selectElementParameters,
  selectElementStyles,
  selectCurrentScreen,
  selectScreenRootElement,
  selectElementsForScreen,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
} from '../selectors';

import {
  addElementClassName,
  findChildByID,
  getElementsArray,
  getTreeWithDefaultStylesAndParams,
  moveElement,
  removeElementClassName,
  replaceElementStyles,
  removeElementStyles as removeStyles,
  updateElementStyles as updateStyles,
} from '../../../utils/ElementsTreeHelper';

import {
  apiChangeElement,
  apiChangeRecursiveElement,
  apiSaveElements,
  parseImgUsingNN,
} from '../../../api/element';

import generateUniqueName from '../../../utils/generateUniqueName';
import { CssLikeStyles } from '../../../utils/StyleHelper';
import getSavedValue from '../../../utils/getSavedValue';
import { addProjectStyles } from '../../../utils/ProjectClassesHelper';
import { updateProject } from './project';
import { updateElementsTree } from './scenario';
import { Map, StateElement } from '../types';
import {
  moveStateElement,
  updateStateElement,
} from '../../../utils/normalizedStateHelpers';

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

  // we can get rid of this code block when we will get better Sortable.js implementation
  /* if (!undo) {
    if (isRemote) {
      yield put(
        Actions.setUndoActions(
          Actions.moveElement(
            { newIndex: oldIndex, oldIndex: newIndex },
            elementId,
            parentID,
            false,
            { screenId },
          ),
        ),
      );

      yield put(Actions.setRemoteMove(true));
    } else {
      const add = yield select(selectRemoteMove);

      yield put(
        Actions.setUndoActions(
          Actions.moveElement(
            { newIndex: oldIndex, oldIndex: newIndex },
            elementId,
            parentID,
            add,
            { screenId },
          ),
        ),
      );
      yield put(Actions.setRemoteMove(false));
    }
  } */

  if (!undo) {
    yield put(
      Actions.setUndoActions([
        Actions.moveElement(
          elementId,
          { oldIndex: newIndex, newIndex: oldIndex },
          { oldParentId: newParentId, newParentId: oldParentId },
          { screenId },
        ),
      ]),
    );
  }

  const state: Map<StateElement> = yield select(selectAllElements);
  yield put(
    Actions.updateElements(
      moveStateElement(state, elementId, indices, parents),
    ),
  );

  /* const updatedTree = moveElement(
    targetParent.id,
    elementToMove,
    root,
    newIndex,
  ); */
  const root = yield select(selectScreenRootElement(screenId));
  const updatedTree = yield select(selectElementAsTree(root.id));
  yield put(Actions.updateElementsTree(updatedTree, action, action.meta));

  // yield put(Actions.setGroupActionsUp(isRemote));

  /* const updatedParent = findChildByID(updatedTree, parentID);

  if (!updatedParent) {
    console.error(`Can not find updatedParent ${parentID} in tree`);
    return;
  } */

  const updatedNewParent = yield select(selectElementAsTree(newParentId));

  const convertedElements = updatedNewParent.children.map((child) =>
    convertElementToPatchRequest(child),
  );
  yield call(reqWrapper, apiSaveElements, { data: convertedElements });

  // if (isRemote) return;

  // const elementData = {
  //   name: targetParent.name,
  //   children: [...targetParent.children.map((child) => child.id), elementId],
  // };

  yield call(reqWrapper, apiChangeRecursiveElement, {
    data: { children: updatedNewParent.children.map((el) => el.id) },
    id: newParentId,
  });
}

function* updateElementClassNames(
  elementID: string,
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

  const root: LibraryElement<'root'> = yield select(
    selectScreenRootElement(screenId),
  );

  if (!undo) {
    if (type === 'add') {
      yield put(
        Actions.setUndoActions(
          Actions.removeElementClassName(elementID, newClassName, { screenId }),
        ),
      );
    } else {
      yield put(
        Actions.setUndoActions(
          Actions.addElementClassName(elementID, newClassName, { screenId }),
        ),
      );
    }
  }

  const updatedTree =
    type === 'add'
      ? addElementClassName(elementID, newClassName, root)
      : removeElementClassName(elementID, newClassName, root);

  const updatedElement = findChildByID(updatedTree, elementID);

  if (!updatedElement) {
    console.error(`Can not find updated element ${elementID} in tree`);
  } else {
    yield put(Actions.updateElementsTree(updatedTree, action, action.meta));

    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, {
      data: convertedElement,
      id: elementID,
    });
  }
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
  const { screenId } = action.meta;

  const root: LibraryElement<'root'> = yield select(
    selectScreenRootElement(screenId),
  );

  const updatedTree = removeStyles(id, cssPropertiesNames, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
  } else {
    yield put(Actions.updateElementsTree(updatedTree, action, action.meta));

    const convertedElement = convertElementToPatchRequest(updatedElement);
    yield call(reqWrapper, apiChangeElement, { data: convertedElement, id });
  }
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
    styles as Required<CssLikeStyles>,
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

  const root: LibraryElement<'root'> = yield select(
    selectScreenRootElement(screenId),
  );

  if (!undo) {
    const oldStyles = yield select(selectElementStyles(id));
    yield put(
      Actions.setUndoActions(
        Actions.replaceElementStyles(id, oldStyles, { screenId }),
      ),
    );
  }

  const updatedTree =
    type === 'replace'
      ? replaceElementStyles(id, styles, root)
      : updateStyles(id, styles, root);
  const updatedElement = findChildByID(updatedTree, id);

  if (!updatedElement) {
    console.error(`Can not find updated element ${id} in tree`);
    return;
  }
  yield put(Actions.updateElementsTree(updatedTree, action, action.meta));

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

  const state: Map<StateElement> = yield select(
    selectElementsForScreen(screenId),
  );
  yield put(
    Actions.updateElements(
      updateStateElement(state, elementId, {
        parameters: { ...state[elementId].parameters, ...parameters },
      }),
    ),
  );

  // const updatedTree = updateParameters(elementId, parameters, root);
  // const updatedElement = findChildByID(updatedTree, elementId);
  //
  // if (!updatedElement) {
  //   console.error(`Can not find updated element ${elementId} in tree`);
  //   return;
  // }
  const updatedElement: StateElement = yield select(
    selectElementById(elementId),
  );

  yield put(
    Actions.updateSavedElementValues(elementId, getSavedValue(updatedElement)),
  );

  const root: LibraryElement<any> = yield select(
    selectScreenRootElement(screenId),
  );
  const updatedRoot = yield select(selectElementAsTree(root.id));
  const updatedElementTree: LibraryElement<any> = yield select(
    selectElementAsTree(elementId),
  );

  yield call(updateElementsTree, updatedRoot, action, action.meta);

  const convertedElement = convertElementToPatchRequest(updatedElementTree);
  yield call(reqWrapper, apiChangeElement, {
    data: convertedElement,
    id: elementId,
  });
}

export function* uploadFileSaga({
  type,
  payload: { file },
  meta,
}: ReturnType<typeof Actions.uploadFile>) {
  if (!meta) {
    console.error(`You have to provide metainformation for action ${type}`);
    return;
  }
  const { screenId } = meta;
  try {
    // TODO: show loader in addModalElements
    const root: LibraryElement<'root'> = yield select(
      selectScreenRootElement(screenId),
    );

    const formData = new FormData();
    formData.append('image', new Blob([file]), file.name);
    formData.append('parent_id', root.id);
    formData.append('struct_type', 'container');
    formData.append('func_type', 'container');
    formData.append('name', 'TESTING NEURAL NETWORK');
    formData.append('screen', screenId.toString());
    formData.append('parameters', JSON.stringify({}));
    formData.append('styles', JSON.stringify({}));

    const nnRootElement: LibraryElement<'root'> = yield call(
      reqWrapper,
      parseImgUsingNN,
      {
        data: formData,
        contentType: 'multipart/form-data',
      },
    );

    const nnRootWithDefaultParams = getTreeWithDefaultStylesAndParams(
      nnRootElement,
    );

    const convertedElements = getElementsArray(
      nnRootWithDefaultParams,
    ).map((element) => convertElementToPatchRequest(element));

    yield call(reqWrapper, apiSaveElements, { data: convertedElements });

    const updatedElements = moveElement(
      root.id,
      nnRootWithDefaultParams,
      root,
      0,
    );
    yield put(
      Actions.setUndoActions(
        Actions.deleteItem(nnRootWithDefaultParams.id, { screenId }),
      ),
    );

    yield call(
      updateElementsTree,
      updatedElements,
      Actions.restoreElement(nnRootWithDefaultParams.id, { screenId }),
      meta,
    );
  } catch (e) {
    console.error('Could not upload image for NN. Error: ', e.message);
  }
}

export function* saveCustomLibraryElement(
  action: ReturnType<typeof Actions.saveElementToLibrary>,
) {
  const currentScreen = yield select(selectCurrentScreen);
  yield put(Actions.saveLibraryElementToState(action.payload.element));
  yield put(
    Actions.renameElement(
      action.payload.id,
      action.payload.element.name,
      currentScreen.id,
    ),
  );
}
