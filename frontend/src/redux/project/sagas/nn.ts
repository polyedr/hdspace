// @ts-nocheck
import { put, call, select, takeEvery } from 'redux-saga/effects';
import {
  selectAnnotatedElementId,
  selectBlockType,
  selectVIAData,
  selectVIARegionsAsArray,
} from '@Redux/project/selectors/via';
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
  NNBlockType,
  VIAFile,
  VIAData,
  VIARegions,
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
import { omit } from 'ramda';
import logger from 'loglevel';
import { selectCurrentScreenId } from '../selectors/screen';

const recognizeImageSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
)(function* ({
  payload: { file, parentId, blockType },
}: ReturnType<typeof Actions.recognizeImage>) {
  try {
    yield put(Actions.setAnalyzerLoader(true));

    const recognizeFormData = new FormData();

    recognizeFormData.append('image', file.file, file.name);
    recognizeFormData.append('name', file.name);
    recognizeFormData.append(
      'screen_data_json',
      JSON.stringify({ block_type: blockType }),
    );

    const { result: recognizeResult, error: recognizeError }: Result<Screen> =
      yield call(reqWrapper, recognizeImgUsingNN, {
        data: recognizeFormData,
        contentType: 'multipart/form-data',
      });

    if (recognizeResult) {
      if (!recognizeResult.screenData.nnResult) {
        throw new Error('No VIA data has been received');
      }
      const viaData = {} as VIAData;
      const viaRegions = {} as VIARegions;
      Object.keys(recognizeResult.screenData.nnResult).forEach(
        (value: string) => {
          if (!['fdict', 'fordict', 'opencvdict', 'cnndict'].includes(value))
            return;
          if (recognizeResult.screenData.nnResult) {
            const [viaKey, viaFile]: any = Object.entries(
              recognizeResult.screenData.nnResult[value],
            )[0];
            const s = omit(['regions'], viaFile);
            viaData[value] = {
              key: viaKey,
              s,
            };
            viaRegions[value] = arrayToMap(
              addLayerProperty(
                viaFile.regions.map((region) => addId(region) as VIARegion),
              ),
            );
          }
        },
      );

      yield put(Actions.setVIAData(viaData));
      yield put(Actions.setBlockType(blockType));
      yield put(Actions.setVIARegions(viaRegions));
      yield put(Actions.setAnnotatedElementId(parentId));
      yield put(Actions.setAnnotatedImageFile(file));
      yield put(Actions.setVIAMode(true));
    }
    if (recognizeError) throw new Error(recognizeError);
  } catch (e) {
    logger.error('Could not upload image for NN. Error: ', e.message);
    if (process.env.NODE_ENV === 'development') {
      logger.trace(e);
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

const assembleImageSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
  withActionsHistory,
)(function* () {
  try {
    const parentId: string = yield select(selectAnnotatedElementId);
    const screenId: number = yield select(selectCurrentScreenId);
    const blockType: NNBlockType = yield select(selectBlockType);
    const viaData: Record<string, VIAFile> = yield select(selectVIAData);

    yield put(Actions.setAnalyzerLoader(true));

    const updatedRegions: VIARegion[] = yield select(selectVIARegionsAsArray);

    const [viaKey, viaFile] = Object.entries(viaData)[0];

    const assembleFormData = new FormData();
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
      const convertedElements = getElementsArray(assembleResult).map(
        (element) => convertElementToPatchRequest(element),
      );

      const { result, error }: Result<ServerElement<any>> = yield call(
        reqWrapper,
        apiUpdateElements,
        { data: convertedElements },
      );

      if (result) {
        yield put(
          Actions.addStateElements([{ elements: [assembleResult], parentId }], {
            screenId,
          }),
        );

        yield put(Actions.setVIAResultId(assembleResult.id));

        yield put(
          Actions.addHistoryActions({
            undo: [
              Actions.deleteElement(assembleResult.id, {
                screenId,
              }),
            ],
            redo: [
              Actions.restoreElement(assembleResult.id, {
                screenId,
              }),
            ],
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

    if (assembleError) throw new Error(assembleError);
  } catch (e) {
    yield put(
      enqueueSnackbar({
        message: e.message,
        options: { variant: 'error' },
      }),
    );
  } finally {
    yield put(Actions.setAnalyzerLoader(false));
    yield put(Actions.setVIAMode(false));
  }
});

const autoAnalyzeImageSaga = compose(
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
      logger.error(`You have to provide metainformation for action ${type}`);
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

    const { result: nnContainer, error: nnError }: Result<LibraryElement<any>> =
      yield call(reqWrapper, parseImgUsingNN, {
        data: formData,
        contentType: 'multipart/form-data',
      });
    if (nnContainer) {
      const convertedElements = getElementsArray(nnContainer).map((element) =>
        convertElementToPatchRequest(element),
      );

      const { result, error }: Result<ServerElement<any>> = yield call(
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
    logger.error('Could not upload image for NN. Error: ', e.message);
    if (process.env.NODE_ENV === 'development') {
      logger.trace(e);
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

const cancelAnnotationSaga = compose(
  withRequiredPermissions(
    UserProjectPermission.VIEW_PROJECT,
    UserProjectPermission.CHANGE_PROJECT,
  ),
)(function* () {
  yield put(Actions.setVIAMode(false));
});

export default function* nnSaga() {
  yield takeEvery(TYPES.AUTO_ANALYZE_IMAGE, autoAnalyzeImageSaga);
  yield takeEvery(TYPES.RECOGNIZE_IMAGE, recognizeImageSaga);
  yield takeEvery(TYPES.ASSEMBLE_VIA_REGIONS, assembleImageSaga);
  yield takeEvery(TYPES.CANCEL_RECOGNIZING, cancelAnnotationSaga);
}
