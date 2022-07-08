// @ts-nocheck
import { put, call, select } from 'redux-saga/effects';
import {
  selectElementParameters,
  selectElementStyles,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
  selectElementsByIds,
} from '@Redux/project/selectors/element';
import {
  convertElementToPatchRequest,
  convertStateElementToPatchRequest,
} from '@Api/converters/toRequest';
import {
  apiChangeRecursiveMultipleElements,
  apiCreateElements,
  apiUpdateElement,
  apiUpdateElements,
} from '@Api/element';
import getSavedValue from '@Utils/getSavedValue';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import { ElementHistoryMeta } from '@Redux/types';
import { isElementCanBeAdded } from '@Utils/AvailableChildrenHelper';
import { convertToRecursiveServerElement } from '@Utils/converters';
import {
  ElementsToCreate,
  Entity,
  LibraryElement,
  Normalized,
  RecursiveElement,
  RecursiveServerElement,
  Result,
  ReturnPromisedType,
  ServerElement,
  StateElement,
  UpdateDataActionType,
} from '@Src/types';
import logger from 'loglevel';
import { reqWrapper } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { selectFreeCanvasOffsetList } from '../selectors/base';

export function* updateOrReplaceMultipleElementsParameters(
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
    if (e instanceof Error) {
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
}

export function* updateOrReplaceElementStyles(
  action: ReturnType<
    typeof Actions.updateElementStyles | typeof Actions.replaceElementStyles
  >,
  type: 'replace' | 'update',
) {
  try {
    const { id, styles } = action.payload;
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
          Actions.replaceElementStyles(id, oldStyles, { ...action.meta }),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);
    yield put(
      Actions.updateStateElement(id, {
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
      }),
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
    if (e instanceof Error) {
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
}

export function* updateOrReplaceElementParameters(
  action: ReturnType<
    | typeof Actions.updateElementParameters
    | typeof Actions.replaceElementParameters
  >,
  type: UpdateDataActionType.REPLACE | UpdateDataActionType.UPDATE,
) {
  try {
    const { elementId, parameters } = action.payload;
    if (!action.meta) {
      logger.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { useHistory } = action.meta;

    if (!useHistory) {
      const oldParameters = yield select(selectElementParameters(elementId));
      yield put(
        Actions.addUndoActions(
          Actions.replaceElementParameters(elementId, oldParameters, {
            ...action.meta,
          }),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(selectAllElements);

    const parametersToUpdate =
      type === UpdateDataActionType.REPLACE
        ? { ...parameters }
        : { ...state[elementId].parameters, ...parameters };

    yield put(
      Actions.updateStateElement(elementId, {
        parameters: parametersToUpdate,
      }),
    );

    const updatedElement: StateElement = yield select(
      selectElementById,
      elementId,
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
    if (e instanceof Error) {
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
}

export function* createElements<T extends Entity>(
  elementsToCreate: ElementsToCreate<T>[],
  meta: ElementHistoryMeta,
) {
  try {
    const { useHistory } = meta;

    // bind elements to its parents
    elementsToCreate.forEach((elsToCreate) => {
      const { elements, parent } = elsToCreate;
      elements.forEach((element) => {
        element.parameters = {
          ...element.parameters,
          parentId: parent.id,
        };
      });
    });

    // check if we can add elements
    const allowToAdd = elementsToCreate.reduce((allowAll, elsToCreate) => {
      const { elements, parent } = elsToCreate;
      return (
        allowAll &&
        elements.reduce((allow, element) => {
          return allow && isElementCanBeAdded(parent, element.struct_type);
        }, true)
      );
    }, true);

    if (!allowToAdd) {
      yield put(
        enqueueSnackbar({
          message: 'Creation of some elements is not allowed',
          options: { variant: 'warning' },
        }),
      );
      return;
    }

    const parentIds = elementsToCreate.map(
      (elToCreate) => elToCreate.parent.id,
    );

    const offsetList = yield select(selectFreeCanvasOffsetList(parentIds));

    const allElementsToCreate = elementsToCreate
      .map((elsToCreate) => elsToCreate.elements)
      .reduce((allEls, parentEls) => [...allEls, ...parentEls], []);

    const {
      result: newElements,
      error: createElementsError,
    }: ReturnPromisedType<typeof apiCreateElements> = yield call(
      reqWrapper,
      apiCreateElements,
      { data: allElementsToCreate },
    );
    if (!newElements) {
      if (createElementsError) {
        throw new Error(createElementsError);
      } else if (allElementsToCreate.length) {
        throw new Error('Failed to create new elements');
      }
      return;
    }
    if (!useHistory) {
      yield put(
        Actions.addUndoActions(
          newElements.map((el: any) =>
            Actions.deleteElement(el.id, { ...meta }),
          ),
        ),
      );
    }

    const recursiveElements: RecursiveServerElement[] = elementsToCreate.map(
      (elsToCreate) => {
        const { parent } = elsToCreate;
        const newChildElements = newElements.filter(
          (el) => el.parameters.parentId === parent.id,
        );
        return convertToRecursiveServerElement({
          id: parent.id,
          name: parent.name,
          children: [
            ...parent.children.map((childEl) => childEl.id),
            ...newChildElements.map((childEl) => childEl.id),
          ],
        });
      },
    );

    const {
      result,
      error: updateRecursiveError,
    }: Result<RecursiveElement> = yield call(
      reqWrapper,
      apiChangeRecursiveMultipleElements,
      {
        elements: recursiveElements,
      },
    );
    if (updateRecursiveError) {
      throw new Error(updateRecursiveError);
    }
    if (!result) {
      throw new Error('Can not update recursive elements');
    }

    const stateElementsToAdd = elementsToCreate.map((element) => {
      const { parent, index } = element;
      const elements = newElements
        .filter((el) => el.parameters.parentId === parent.id)
        .map((el) => ({
          ...el,
          parameters: {
            ...Object.keys(el.parameters)
              .filter((paramName) => paramName !== 'parentId')
              .reduce(
                (allParams, paramName) => ({
                  ...allParams,
                  [paramName]: el.parameters[paramName],
                }),
                {},
              ),
            freeCanvas: {
              ...(el.parameters.freeCanvas || {}),
              left: el.parameters.freeCanvas?.left || offsetList[parent.id],
              top: el.parameters.freeCanvas?.top || offsetList[parent.id],
            },
          },
        }));
      return {
        elements,
        parentId: parent.id,
        index,
      };
    });
    yield put(Actions.addStateElements(stateElementsToAdd, { ...meta }));
    if (!useHistory) {
      yield put(
        Actions.addRedoActions(
          elementsToCreate.map((elToCreate) => {
            const { parent } = elToCreate;
            return Actions.restoreElementChildren(
              parent.id,
              newElements
                .filter((el) => el.parameters.parentId === parent.id)
                .map((el) => el.id),
              { ...meta },
            );
          }),
        ),
      );
    }

    // comment code temporarily
    const allElements = yield select(selectAllElements);

    // eslint-disable-next-line no-restricted-syntax
    for (const parentId of parentIds) {
      const parent = allElements[parentId];
      yield put(
        Actions.updateLastElements(
          parentId,
          parent.children,
          offsetList[parentId],
        ),
      );
    }

    const elementsWithUpdatedBuoyancy = parentIds.reduce(
      (createdElements, parentId) => {
        const childElements = allElements[parentId].children.map((childId) => {
          const createdRequestElement = convertStateElementToPatchRequest(
            allElements[childId],
          );
          return createdRequestElement;
        });
        return [...createdElements, ...childElements];
      },
      [] as ServerElement<Entity>[],
    );
    const { result: createdElements, error } = yield call(
      reqWrapper,
      apiUpdateElements,
      {
        data: elementsWithUpdatedBuoyancy,
      },
    );
    if (createdElements) {
      // eslint-disable-next-line consistent-return
      return createdElements.map((el) => String(el.id));
    }
    if (error) throw new Error(error);
  } catch (e) {
    if (e instanceof Error) {
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
}

export function* createLibraryElements<T extends Entity>(
  elementsToCreate: ElementsToCreate<T>[],
  meta: ElementHistoryMeta,
) {
  try {
    const { useHistory } = meta;

    const allElementsToCreate = elementsToCreate
      .map((elsToCreate) => elsToCreate.elements)
      .reduce((allEls, parentEls) => [...allEls, ...parentEls], []);

    const {
      result: newElements,
      error: createElementsError,
    }: ReturnPromisedType<typeof apiCreateElements> = yield call(
      reqWrapper,
      apiCreateElements,
      { data: allElementsToCreate },
    );
    if (!newElements) {
      if (createElementsError) {
        throw new Error(createElementsError);
      } else if (allElementsToCreate.length) {
        throw new Error('Failed to create new elements');
      }
      return;
    }
    if (!useHistory) {
      yield put(
        Actions.addUndoActions(
          newElements.map((el: any) =>
            Actions.deleteElement(el.id, { ...meta }),
          ),
        ),
      );
    }
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
