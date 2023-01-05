// /^[a-zA-Z][a-zA-Z0-9]+/

const isValidEmail = (email: string) =>
  email.match(
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

const isUsername = (value: string) =>
  /^[0-9a-zA-Z@]+$/.test(value) || isValidEmail(value)
    ? undefined
    : 'Invalid username';

export default isUsername;
