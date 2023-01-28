const isRequired = (value: string) =>
  value ? undefined : 'This field is required.';

export default isRequired;
