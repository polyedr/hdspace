// eslint-disable-next-line import/prefer-default-export
export const splitWords = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');
