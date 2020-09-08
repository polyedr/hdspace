type Map<T> = {
  [id: number]: T;
};

export const arrayToMap = <T extends { id: any }>(arr: T[]): Map<T> => {
  const res = {};
  arr.forEach((item) => {
    res[item.id] = item;
  });
  return res;
};

export const mapToArr = <T>(map: Map<T>): T[] => Object.values(map);
