// eslint-disable-next-line import/prefer-default-export
export const splitWords = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');

export const kebabToCamel = (str: string) =>
  str
    .split('-')
    .map((word, i) => (i ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join('');
