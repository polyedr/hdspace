const emailRegexp =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const isValidEmail = (value: string) =>
  emailRegexp.test(value) ? undefined : 'It`s not a valid e-mail address';

export default isValidEmail;
