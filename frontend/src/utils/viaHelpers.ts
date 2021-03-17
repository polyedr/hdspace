import { VIARegion } from '@Src/types';
import { v4 } from 'uuid';

type HasId<T> = T extends { id: unknown } ? T : T & { id: unknown };

const a = { type: 'a', id: 1 };
const b = { type: 'b' };

type S = HasId<typeof a>;
type U = HasId<typeof b>;

export const addId = <T extends Record<string, any>>(item: T) => {
  if (
    'id' in item &&
    (typeof item.id === 'string' || typeof item.id === 'number')
  ) {
    return item;
  }

  return {
    ...item,
    id: v4(),
  };
};

export const addZIndices = (regions: VIARegion[]): VIARegion[] =>
  regions.map((region, i) => ({
    ...region,
    zIndex: regions.length - i,
  }));
