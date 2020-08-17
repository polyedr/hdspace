export const isPasswordsMatch = (firstValue: string, secondValue: string) =>
  firstValue !== '' && secondValue !== '' && firstValue !== secondValue
    ? 'Passwords does not match'
    : undefined;
