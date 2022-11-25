import { DateRange, TemplatesSearchParameter } from '@Src/types';

const getTemplatesSearchParams = ([key, value]: [
  TemplatesSearchParameter | 'tags__name',
  string | DateRange,
]) => {
  const isDate =
    key === TemplatesSearchParameter.created ||
    key === TemplatesSearchParameter.updated;

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

export default getTemplatesSearchParams;
