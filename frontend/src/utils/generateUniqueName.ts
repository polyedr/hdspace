function generateUniqueName(newName: string, names: string[]): string {
  if (!names.includes(newName)) {
    return newName;
  }

  const nameWithoutNumber = newName.replace(/\s+\d+$/, '');
  const nameNumberRegExp = newName.match(/\s+\d+$/);
  const nameNumber = nameNumberRegExp ? parseInt(nameNumberRegExp[0]) : 0;

  const newNumber = nameNumber + 1;
  const numberedName = newNumber
    ? `${nameWithoutNumber} ${newNumber}`
    : `${newName}`;

  return generateUniqueName(numberedName, names);
}

export default generateUniqueName;
