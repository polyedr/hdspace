export const isLongPassword = (value: string) =>
  value.length >= 8 ? undefined : 'Make it at least 6 characters long';
