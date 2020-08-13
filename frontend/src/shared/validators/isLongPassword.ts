export const isLongPassword = (value: string) =>
  value.length >= 6 ? undefined : 'Make it at least 6 characters long';
