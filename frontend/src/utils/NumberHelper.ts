type TIsNumber = (value: string | number) => boolean;
type TStrToNumber = (value: string) => number;

export const isNumber: TIsNumber = (value) =>
  (value && !Number.isNaN(Number(value))) || false;

export const strToNumber: TStrToNumber = (value) =>
  (isNumber(value) && parseInt(value)) || 0;

export const getPermissibleValue = (
  value: number,
  min: number,
  max: number,
): number => {
  if (value < min) return min;

  if (value > max) return max;

  return value;
};

export const safeParseFloat = (value: string | undefined) =>
  value !== undefined ? parseFloat(value) : 0;

export const safeMatch = (value: string | undefined) => {
  if (value === undefined) return null;
  return value.match(/px|%/i);
};

export const generateRandomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;
