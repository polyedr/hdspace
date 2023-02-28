import { AxiosResponse } from 'axios';
import { myAxios } from '../config/settings';
import {
  MyAxiosProps,
  PaginatedResponse,
  Marketplace,
  Result,
  ServerMarketplace,
} from '../types';
import { convertTemplatesFromResponse } from './converters/fromResponse';
import { handleError, parseCursor } from './helper';

export const apiGetProjectWithScreensForTemplates = async (
  props: MyAxiosProps,
): Promise<Result<PaginatedResponse<Marketplace>>> =>
  await myAxios({
    ...props,
    method: 'GET',
    url: 'projects/screens-for-project?tags__name=adevitemplate',
  })
    .then((result: AxiosResponse<PaginatedResponse<ServerMarketplace>>) => ({
      result: {
        next: parseCursor(result.data.next),
        previous: parseCursor(result.data.previous),
        results: result.data.results.map(convertTemplatesFromResponse),
      },
    }))
    .catch(handleError);
