
export default function createTypes(types) {
  const newTypes = { ...types };
  Object.keys(newTypes).forEach((key) => {
    newTypes[key] = key;
  });
  return newTypes;
}
