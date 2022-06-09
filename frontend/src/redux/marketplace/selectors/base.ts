import { AppReduxState } from '../../types';

export const selectMarketplacesData = ({ marketplace }: AppReduxState) =>
  marketplace?.data?.marketplaceData?.results;

export const selectTemplatessDataNext = ({ marketplace }: AppReduxState) =>
  marketplace.data.marketplaceData.next;

export const selectTemplatesSearchParameter = ({
  marketplace,
}: AppReduxState) => marketplace.data.marketplaceData.parameter;

export const selectAreTemplatesLoading = ({ marketplace }: AppReduxState) =>
  marketplace.data.marketplaceData.loading;
