import { takeLatest } from 'redux-saga/effects';
import TYPES from '../../actionTypes';
import {
  GetScreenFormMarketplaceSaga,
  searchTemplatesSaga,
} from './marketplaceSaga';

export default function* TemplateSaga() {
  yield takeLatest(TYPES.LOAD_TEMPLATES, GetScreenFormMarketplaceSaga);
  yield takeLatest(TYPES.SEARCH_TEMPLATES, searchTemplatesSaga);
}
