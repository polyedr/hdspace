import { DateRange, ProjectsSearchParameter } from '@Src/types';

const getSearchParams = ([key, value]: [
  ProjectsSearchParameter | 'tags__name',
  string | DateRange,
]) => {
  const isDate =
    key === ProjectsSearchParameter.created ||
    key === ProjectsSearchParameter.updated;

  if (isDate && typeof value === 'object') {
    const { from, to } = value;

    return {
      ...(from && {
        [`${key}__gte`]: from?.toISOString() ?? '',
      }),
      ...(to && {
        [`${key}__lt`]: to?.toISOString() ?? '',
      }),
    };
  }

  return {
    [key]: value,
  };
};

export default getSearchParams;
