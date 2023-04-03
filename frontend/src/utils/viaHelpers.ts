import { v4 } from 'uuid';
import { VIARegion } from '@Src/types';

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
