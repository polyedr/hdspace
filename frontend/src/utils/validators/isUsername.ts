// /^[a-zA-Z][a-zA-Z0-9]+/
const isUsername = (value: string) =>
  /^[a-zA-Z]+$/.test(value)
    ? undefined
    : 'ADEVI Login Failed. Please enter a valid User name';

export default isUsername;
