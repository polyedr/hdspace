import { v4 } from 'uuid';
/*
const addId = <T extends Record<string, unknown>>(
  item: T,
): T extends { id: string | number } & infer U ? T : U & { id: string } => {
  if ('id' in item) return item;

  return {
    ...item,
    id: v4(),
  };
}; */

const addId = <T extends Record<string, any>>(item: T) => {
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

export default addId;
