import { TemplatesSearchParameter } from '@Src/types';
import { MarketplaceDataState } from '../types';

export const initialmarketplaceData: MarketplaceDataState = {
  marketplaceData: {
    next: null,
    previous: null,
    parameter: [TemplatesSearchParameter.name, ''],
    results: {},
    pageSize: 10,
    loading: false,
  },
};
