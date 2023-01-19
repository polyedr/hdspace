import {
  PaginatedResponse,
  Marketplace,
  TemplatesSearchParameter,
  DateRange,
} from '@Src/types';
import {
  LoadTemlates,
  SetMarketplaceListLoader,
  SetTemplateSearchParameter,
  SearchTemplates,
  LoadTemplatesSuccess,
  SetUsersSearchTemplateValue,
} from '../types';
import TYPES from '../actionTypes';

export const getTemplatesLists = (): LoadTemlates => ({
  type: TYPES.LOAD_TEMPLATES,
});
export const setUsersSearchTemplateValue = (
  search: string,
): SetUsersSearchTemplateValue => ({
  type: TYPES.SET_USERS_SEARCH_TEMPLATES,
  payload: { search },
});

export const searchTemplates = (): SearchTemplates => ({
  type: TYPES.SEARCH_TEMPLATES,
});

export const setTemplatesSearchParameter = (
  parameter: [TemplatesSearchParameter, string | DateRange],
): SetTemplateSearchParameter => ({
  type: TYPES.SET_TEMPLATE_SEARCH_PARAMETER,
  payload: parameter,
});

export const setTemplatesList = (
  marketplace: Marketplace[],
): LoadTemplatesSuccess => ({
  type: TYPES.SET_TEMPLATES_LIST,
  payload: { marketplace },
});

export const setMarketplaceScreensData = (
  data: PaginatedResponse<Marketplace>,
) => ({
  type: TYPES.SET_MARKETPLACE_DATA,
  payload: data,
});
export const setMarketplaceListLoader = (
  active: boolean,
): SetMarketplaceListLoader => ({
  type: TYPES.SET_MARKETPLACE_LIST_LOADER,
  payload: { active },
});
