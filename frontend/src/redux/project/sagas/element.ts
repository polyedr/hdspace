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
  selectActiveElement,
} from '@Redux/project/selectors/element';
import { selectCurrentProject } from '@Redux/project/selectors/base';

import {
  convertElementToPatchRequest,
  convertCreatedElementToRequest,
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
  LibraryElement,
  Normalized,
  PaginatedResponse,
  RecursiveElement,
  Result,
  ReturnPromisedType,
  ServerElement,
  StateElement,
} from '@Src/types';
import { reqWrapper, projectUpdateHelperSaga } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { createElements } from './scenario';

export function* moveElementSaga(
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
    const { screenId, undo } = action.meta;

    if (!undo) {
      yield put(
        Actions.setUndoActions([
          Actions.moveElement(
            elementId,
            { oldIndex: newIndex, newIndex: oldIndex },
            { oldParentId: newParentId, newParentId: oldParentId },
            { screenId, sourceAction: action },
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
  try {
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
            Actions.removeElementClassName(elementId, newClassName, {
              screenId,
            }),
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
        { ...action.meta, sourceAction: action },
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

export function* copyElementStylesSaga(
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
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
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
  try {
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

export function* updateElementStylesSaga(
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
}

export function* updateMultipleElementsStylesSaga(
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

    const { screenId, undo } = action.meta;

    const stateElements = yield select(selectElementsByIds(ids));
    if (!undo) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.setUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            screenId,
            sourceAction: action,
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
}

export function* removeMultipleElementsStylesSaga(
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
    const { screenId, undo } = action.meta;

    if (!undo) {
      const stylesState = stateElements.reduce((acc, element) => {
        return {
          ...acc,
          [element.id]: element.styles.ownStyles,
        };
      }, {});
      yield put(
        Actions.setUndoActions(
          Actions.updateMultipleElementsStyles(ids, stylesState, {
            screenId,
            sourceAction: action,
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
}

export function* replaceElementStylesSaga(
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
}

export function* removeElementStylesSaga(
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
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}

export function* updateElementImageSaga(
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
}

export function* updateElementParameters(
  action: ReturnType<typeof Actions.updateElementParameters>,
) {
  try {
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
          Actions.updateElementParameters(elementId, oldParameters, {
            screenId,
          }),
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

export function* uploadFileSaga({
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

    const { screenId } = meta;

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
          Actions.setUndoActions(
            Actions.deleteElement(nnContainerWithDefaultParams.id, {
              screenId,
            }),
          ),
        );

        yield put(
          Actions.addStateElements([nnContainerWithDefaultParams], parentId, {
            ...meta,
            sourceAction: Actions.restoreElement(
              nnContainerWithDefaultParams.id,
              {
                screenId,
              },
            ),
          }),
        );

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
}

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
    const canCreateGroup =
      !!selectedElements.length &&
      selectedElements.every((el) => el.parent === element.parent);
    yield put(Actions.setCanCreateGroup(canCreateGroup));
    yield put(Actions.addSelectedElement(action.payload.id));
  } else {
    yield put(Actions.removeSelectedElement(action.payload.id));
  }
}

export function* createElementsGroupSaga(
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

  try {
    const activeElement = yield select(selectActiveElement);
    const parentTree = yield select(selectElementAsTree(activeElement.parent));
    const selectedElements: StateElement[] = yield select(
      selectElementsByIds(ids),
    );
    const minBuoyancy = Math.min(...selectedElements.map((el) => el.buoyancy));

    yield call(
      createElements,
      {
        elements: [
          convertCreatedElementToRequest('group', activeElement.parent, name, {
            container: true,
          }),
        ],
        index: minBuoyancy,
      },
      parentTree,
      action.meta,
    );

    /* const state = yield select(selectElementsForScreen(screenId));
    console.log('STATE!!!', state);

    const parentElement = yield select(selectElementById(activeElement.parent));
    console.log('CHILDREN!!', parentElement.children, minBuoyancy);
    const groupId = parentElement.children[minBuoyancy];
    console.log('CONTAINER ID!!', groupId);

    const sortedIds = selectedElements
      .sort((a, b) => {
        if (a.buoyancy < b.buoyancy) {
          return 1;
        }
        if (a.buoyancy > b.buoyancy) {
          return -1;
        }
        return 0;
      })
      .map((el) => el.id);

    console.log('SORTED IDS!!', sortedIds);

    const { error: groupError } = yield call(
      reqWrapper,
      apiChangeRecursiveElement,
      {
        id: groupId,
        data: {
          children: sortedIds,
        },
      },
    );

    if (groupError) throw groupError;
    /*  
    const convertedCreatedGroup = convertCreatedElementToRequest(
      'group',
      activeElement.parent,
      name,
    );

    const {
      result: elementsGroup,
      error,
    }: Result<LibraryElement<any>> = yield call(reqWrapper, apiCreateElement, {
      data: convertedCreatedGroup,
    });

    if (error) throw new Error(error);

    if (!elementsGroup) {
      console.error('Element is undefined!');
      return;
    }
    yield put(
      Actions.addStateElements(
        [elementsGroup],
        activeElement.parent,
        {
          screenId,
        },
        minBuoyancy,
      ),
    );

    const state = yield select(selectElementsForScreen(screenId));
    yield put(
      Actions.updateElementsTree(removeMapElements(state, selectedElements), {
        ...action.meta,
      }),
    );

    yield put(
      Actions.updateElementsTree(
        addMapElements(state, selectedElements, elementsGroup.id),
        action.meta,
      ),
    );

    const parentElement = yield select(
      selectElementByChildId(activeElement.id),
    );

    const elementsToUpdate: LibraryElement<Entity>[] = [];

    const childElements = yield select(
      selectElementsByIds(parentElement.children),
    );
    parentElement.children = [
      elementsGroup.id,
      ...parentElement.children.filter((childId) => !ids.includes(childId)),
    ];

    elementsToUpdate.push(parentElement);
    let childBuoyancy = 0;
    let groupBuoyancy = 0;
    childElements.forEach((element) => {
      if (ids.includes(element.id)) {
        element.buoyancy = groupBuoyancy;
        groupBuoyancy += 1;
      } else {
        element.buoyancy = childBuoyancy;
        childBuoyancy += 1;
      }
      elementsToUpdate.push(element);
    });
    elementsGroup.buoyancy = minBuoyancy;
    elementsGroup.children = ids;
    elementsToUpdate.push(elementsGroup);

    const convertedElements = elementsToUpdate.map((el) =>
      convertElementToPatchRequest(el),
    );

    const { error: updateError } = yield call(reqWrapper, apiUpdateElements, {
      data: convertedElements,
    });
    if (updateError) throw updateError; */
  } catch (e) {
    console.error(e);
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  }
}
