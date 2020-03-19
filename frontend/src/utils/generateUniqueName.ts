function generateUniqueName(newName: string, names: string[]) {
  if (!names.includes(newName)) {
    return newName;
  }

  const nameWithoutNumber = newName.replace(/\s+\d+$/, '');

  const sameNamesNumbers: number[] = names
    .map((name) => {
      const sameNameNumberRegExp = name.match(/\s+\d+$/);
      const sameNameNumber = sameNameNumberRegExp ? Number(sameNameNumberRegExp[0]) : 0;
      return { number: sameNameNumber, name: name.replace(/\s+\d+$/, '') };
    })
    .filter(screen => screen.name === nameWithoutNumber)
    .map(screen => screen.number);

  const sameScreenNumber = Math.max(...sameNamesNumbers);
  const nameNumberRegExp = newName.match(/\s+\d+$/);
  const nameNumber = nameNumberRegExp ? parseInt(nameNumberRegExp[0]) : 0;
  const newNumber = sameScreenNumber < nameNumber ? nameNumber : sameScreenNumber + 1;
  const numberedName = newNumber ? `${nameWithoutNumber} ${newNumber}` : `${newName}`;

  return numberedName;
}

export { generateUniqueName };