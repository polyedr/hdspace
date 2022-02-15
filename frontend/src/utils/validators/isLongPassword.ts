const isLongPassword = (value: string) =>
  value?.length >= 8 ? undefined : 'Make it at least 8 characters long';

export default isLongPassword;
