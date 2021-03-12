import { v4 } from 'uuid';

// const addId = <T>(
//   item: T,
// ): T extends { id: string | number } ? T : T & { id: string } => {
//   if ('id' in item) return item;

//   return {
//     ...item,
//     id: v4(),
//   };
// };

const addId = (item: any) => {
  if ('id' in item) return item;

  return {
    ...item,
    id: v4(),
  };
};

export default addId;
