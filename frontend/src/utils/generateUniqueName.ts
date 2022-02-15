function generateUniqueName(newName: string, names: string[]): string {
  if (!names.includes(newName)) {
    return newName;
  }

  const nameNumberRegExp = newName.split('-')[newName.split('-').length - 1];
  const nameNumber = nameNumberRegExp ? parseInt(nameNumberRegExp[0]) : 0;

  const newNumber = nameNumber + 1;
  const numberedName = newNumber
    ? `${newName.replace(nameNumberRegExp, newNumber.toString())}`
    : `${newName}`;

  return generateUniqueName(numberedName, names);
}

export default generateUniqueName;
