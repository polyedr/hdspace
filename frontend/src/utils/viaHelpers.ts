import { VIARegion } from '@Src/types/types';
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

export const addLayerProperty = (regions: VIARegion[]): VIARegion[] =>
  regions.map((region, i) => ({
    ...region,
    layer: regions.length - 1 - i,
  }));

export const sortByLayer = <T extends { layer: number }>(a: T, b: T) =>
  a.layer - b.layer;
