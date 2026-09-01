const isLatinOrNumbers = (value: string) =>
  /^[A-Za-z0-9]+$/.test(value)
    ? undefined
    : 'Field must contain only latin letters and numbers';

export default isLatinOrNumbers;
