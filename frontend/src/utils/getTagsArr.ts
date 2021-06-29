const getTagArr = (tags) => {
  if (!tags) {
    return [];
  }
  const resultTags: Array<string> = [];
  const strArr: Array<string> = tags.split(',');
  for (let i = 0; i < strArr.length; i++) {
    resultTags.push(strArr[i].trim());
  }
  return resultTags.filter(Boolean);
};

export default getTagArr;
