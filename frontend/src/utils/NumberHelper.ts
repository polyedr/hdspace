type TIsNumber = (value: string | number) => boolean;
type TStrToNumber = (value: string) => number;

export const isNumber: TIsNumber = value => (value && !Number.isNaN(Number(value))) || false;

export const strToNumber: TStrToNumber = value => (isNumber(value) && parseInt(value, 10)) || 0;

export const getDecimals = (a) => {
  if (!Number.isFinite(a)) return 0;

  let e = 1;
  let p = 0;

  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p += 1;
  }

  return p;
};

export const average = (a, b) => (a + b) * 0.5;

export const getPermissibleValue = (value: number, min: number, max: number): number => {
  if (value < min) return min;

  if (value > max) return max;

  return value;
};

export const getBuoyancy = (listEl = []): number => (
  listEl.reduce((a, b) => ((a + b.dynamic_buoyancy || 0), 0) / listEl.length, 0)
);

export const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

export const uniqueId = (idx?: number) => <number>(strToNumber(`${new Date().getTime()}${idx || 0}`));

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
