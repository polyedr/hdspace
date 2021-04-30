import { put, call, select, take, race } from 'redux-saga/effects';
import { selectVIARegionsAsArray } from '@Redux/project/selectors/via';
import { convertElementToPatchRequest } from '@Api/converters/toRequest';
import { getElementsArray } from '@Utils/ElementsTreeHelper';
import {
  apiUpdateElements,
  recognizeImgUsingNN,
  assembleImgUsingNN,
  parseImgUsingNN,
} from '@Api/element';
import {
  LibraryElement,
  Result,
  ServerElement,
  Screen,
  VIARegion,
  UserProjectPermission,
} from '@Src/types';
import { addId, addLayerProperty } from '@Utils/viaHelpers';
import { arrayToMap } from '@Utils/normalizedStateHelpers';
import TYPES from '@Redux/actionTypes';
import { reqWrapper } from '@Redux/project/sagas/shared';
import { enqueueSnackbar } from '@Redux/notification/actions';
import * as Actions from '@Redux/project/actions';
import withActionsHistory from '@Redux/project/wrappers/withActionsHistory';
import { compose } from 'redux';
import withRequiredPermissions from '@Redux/permissions/wrappers/withRequiredPermissions';

export const semiautoAnalyzeImageSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* ({
  type,
  payload: { file, parentId, blockType },
  meta,
}: ReturnType<typeof Actions.semiAutoAnalyzeImage>) {
  try {
    if (!meta) {
      console.error(`You have to provide metainformation for action ${type}`);
      return;
    }
    yield put(Actions.setAnalyzerLoader(true));

    const { screenId, useHistory } = meta;

    const recognizeFormData = new FormData();

    recognizeFormData.append('image', file.file, file.name);
    recognizeFormData.append('name', file.name);
    recognizeFormData.append(
      'screen_data_json',
      JSON.stringify({ block_type: blockType }),
    );

    const {
      result: recognizeResult,
      error: recognizeError,
    }: Result<Screen> = yield call(reqWrapper, recognizeImgUsingNN, {
      data: recognizeFormData,
      contentType: 'multipart/form-data',
    });

    if (recognizeResult) {
      if (!recognizeResult.screenData.nnResult) {
        throw new Error('No VIA data has been received');
      }

      const [viaKey, viaFile] = Object.entries(
        recognizeResult.screenData.nnResult,
      )[0];

      yield put(
        Actions.setVIARegions(
          arrayToMap(
            addLayerProperty(
              viaFile.regions.map((region) => addId(region) as VIARegion),
            ),
          ),
        ),
      );
      yield put(Actions.setAnnotatedElementId(parentId));

      const url = URL.createObjectURL(file.file);

      yield put(Actions.setAnnotatedImageURL(url));

      yield put(Actions.setVIAMode(true));

      yield put(Actions.setAnalyzerLoader(false));

      const { cancel } = yield race({
        assemble: take(TYPES.ASSEMBLE_VIA_REGIONS),
        cancel: take(TYPES.CANCEL_RECOGNIZING),
      });

      if (cancel) {
        return;
      }

      yield put(Actions.setAnalyzerLoader(true));

      const updatedRegions: VIARegion[] = yield select(selectVIARegionsAsArray);

      const assembleFormData = new FormData();
      assembleFormData.append('image', file.file, file.name);
      assembleFormData.append('name', 'image');
      assembleFormData.append('parent_id', parentId);
      assembleFormData.append('styles', '{}');
      assembleFormData.append('screen', screenId.toString());
      assembleFormData.append(
        'parameters',
        JSON.stringify({
          block_type: blockType,
          annotation: JSON.stringify({
            [viaKey]: {
              ...viaFile,
              regions: updatedRegions.map(
                ({ region_attributes, shape_attributes }) => ({
                  region_attributes,
                  shape_attributes,
                }),
              ),
            },
          }),
        }),
      );

      const {
        result: assembleResult,
        error: assembleError,
      }: Result<LibraryElement<any>> = yield call(
        reqWrapper,
        assembleImgUsingNN,
        {
          data: assembleFormData,
        },
      );
      if (assembleResult) {
        const convertedElements = getElementsArray(
          assembleResult,
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
            Actions.addStateElements(
              [{ elements: [assembleResult], parentId }],
              {
                ...meta,
              },
            ),
          );

          if (!useHistory) {
            yield put(
              Actions.addHistoryActions({
                undo: [
                  Actions.deleteElement(assembleResult.id, {
                    ...meta,
                  }),
                ],
                redo: [
                  Actions.restoreElement(assembleResult.id, {
                    ...meta,
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

      if (assembleError) throw new Error(assembleError);
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
    yield put(Actions.finishAnnotation());
  }
});

export const autoAnalyzeImageSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* ({
  type,
  payload: { file, parentId, blockType },
  meta,
}: ReturnType<typeof Actions.autoAnalyzeImage>) {
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
      const convertedElements = getElementsArray(nnContainer).map((element) =>
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
          Actions.addStateElements([{ elements: [nnContainer], parentId }], {
            ...meta,
          }),
        );

        if (!useHistory) {
          yield put(
            Actions.addHistoryActions({
              undo: [
                Actions.deleteElement(nnContainer.id, {
                  ...meta,
                }),
              ],
              redo: [
                Actions.restoreElement(nnContainer.id, {
                  ...meta,
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
