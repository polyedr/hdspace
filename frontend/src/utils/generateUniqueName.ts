function generateUniqueName(newName: string, names: string[]): string {
  if (!names.includes(newName)) {
    return newName;
  }
  const nameReplaced = newName.replace(/.-/gi, ' ');
  const nameNumberRegExp = nameReplaced.match(/\s+\d+$/);
  const nameNumber = nameNumberRegExp ? parseInt(nameNumberRegExp[0]) : 0;

  const newNumber = nameNumber + 1;
  const numberedName = nameNumber
    ? `${newName.replace(nameNumber.toString(), newNumber.toString())}`
    : `${newName}-${newNumber}`;

  return generateUniqueName(numberedName, names);
}

export default generateUniqueName;
