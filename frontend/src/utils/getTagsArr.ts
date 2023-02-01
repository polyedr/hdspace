const getTagArr = (tags) => {
  if (!tags) {
    return [];
  }
  const result = tags.split(',');
  return result.map((e) => e.trim()).filter(Boolean);
};

export default getTagArr;
