export const isPasswordsMatch = (firstValue: string, secondValue: string) =>
  firstValue !== '' && secondValue !== '' && firstValue !== secondValue
    ? 'Entered passwords must be identical'
    : undefined;
// TODO remove?
