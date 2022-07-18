import { takeLatest } from 'redux-saga/effects';
import {
  GetScreenFormMarketplaceSaga,
  searchTemplatesSaga,
} from './marketplaceSaga';
import TYPES from '../../actionTypes';

export default function* TemplateSaga() {
  yield takeLatest(TYPES.LOAD_TEMPLATES, GetScreenFormMarketplaceSaga);
  yield takeLatest(TYPES.SEARCH_TEMPLATES, searchTemplatesSaga);
}
