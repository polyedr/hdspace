import produce, { Draft } from 'immer';
import { arrayToMap } from '@Utils/normalizedStateHelpers';
import { Marketplace } from '@Src/types';
import { initialmarketplaceData } from '../initial';
import TYPES from '../../actionTypes';
import { Action, MarketplaceDataState } from '../../types';

const marketplaceReducer = produce(
  (
    draft: Draft<MarketplaceDataState> = initialmarketplaceData,
    action: Action,
  ) => {
    switch (action.type) {
      case TYPES.SET_TEMPLATES_LIST: {
        draft.marketplaceData.results = arrayToMap<Marketplace>(
          action.payload.marketplace,
        );
        return draft;
      }

      case TYPES.SET_TEMPLATE_SEARCH_PARAMETER: {
        draft.marketplaceData.parameter = action.payload;
        return draft;
      }

      case TYPES.SET_MARKETPLACE_DATA: {
        const { results, next, previous } = action.payload;
        draft.marketplaceData.results = {
          ...draft.marketplaceData.results,
          ...arrayToMap(results),
        };
        draft.marketplaceData.next = next;
        draft.marketplaceData.previous = previous;
        return draft;
      }

      case TYPES.SET_MARKETPLACE_LIST_LOADER: {
        draft.marketplaceData.loading = action.payload.active;
        return draft;
      }
      default:
        return draft;
    }
  },
);

export default marketplaceReducer;
