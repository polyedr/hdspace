const isOnlyNumeric = (value: string) =>
  new RegExp('^[0-9]+$').test(value)
    ? 'This password is entirely numeric'
    : undefined;

export default isOnlyNumeric;
