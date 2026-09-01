const isPassword = (value: string) =>
  /^[\S\d]+$/.test(value)
    ? undefined
    : 'ADEVI Login Failed. Please enter a valid Password';

export default isPassword;
