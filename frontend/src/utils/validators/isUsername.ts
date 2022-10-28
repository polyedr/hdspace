// /^[a-zA-Z][a-zA-Z0-9]+/

const isValidEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

const isUsername = (value: string) => {
  return /^[0-9a-zA-Z@]+$/.test(value) || isValidEmail(value)
    ? undefined
    : 'ADEVI Login Failed. Please enter a valid User name';
};

export default isUsername;
