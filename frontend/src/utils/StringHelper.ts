import * as R from 'ramda';

export const isIncludes = (search: string, from: string) =>
  R.includes(search.toLowerCase(), from.toLowerCase());

export const checkFormFieldValidity = (string: string) =>
  /^[A-Za-z0-9]+$/.test(string);

export const checkPasswordFieldValidity = (string: string) =>
  /^[A-Za-z0-9]+$/.test(string);

export const checkEmailFieldValidity = (string: string) =>
  /.+@.+\..+/.test(string);

export const getPathFromPathname = (pathname: string) => pathname.split('/')[1];

export const splitWords = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');
