/* eslint-disable no-console */
import { put, call, select } from 'redux-saga/effects';
import {
  selectElementParameters,
  selectElementStyles,
  selectElementsForScreen,
  selectElementById,
  selectElementAsTree,
  selectAllElements,
  selectElementsByIds,
} from '@Redux/project/selectors/element';
import { convertElementToPatchRequest } from '@Api/converters/toRequest';
import { apiUpdateElement, apiUpdateElements } from '@Api/element';
import getSavedValue from '@Utils/getSavedValue';
import { ALL_ELEMENTS_INDEX } from '@Constants/defaultParams';
import {
  LibraryElement,
  Normalized,
  Result,
  StateElement,
  UpdateDataActionType,
} from '@Src/types';
import { reqWrapper } from './shared';
import { enqueueSnackbar } from '../../notification/actions';
import * as Actions from '../actions';
import { replaceElementParameters } from '../actions';

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
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
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
      console.error(
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
      console.error(
        `You have to provide metainformation for action ${action.type}`,
      );
      return;
    }
    const { screenId, useHistory } = action.meta;

    if (!useHistory) {
      const oldParameters = yield select(selectElementParameters(elementId));
      console.log('OLD PARAMETERS!!', oldParameters);
      yield put(
        Actions.addUndoActions(
          Actions.replaceElementParameters(elementId, oldParameters, {
            ...action.meta,
          }),
        ),
      );
    }

    const state: Normalized<StateElement> = yield select(
      selectElementsForScreen(screenId),
    );

    const parametersToUpdate =
      type === UpdateDataActionType.REPLACE
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
