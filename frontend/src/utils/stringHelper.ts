export const splitWords = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');

export const kebabToCamel = (str: string) =>
  str
    .split('-')
    .map((word, i) => (i ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join('');

export const getHTMLBodyContent = (htmlString: string) => {
  const match = htmlString.match(/<body.*?>([\s\S]*)<\/body>/);
  if (!match) throw new Error("Can not find document's body");
  return match[1];
};

export const removeTag = (str: string, tag: string) =>
  str.replace(new RegExp(`<${tag}.*?>[\\s\\S]*?</${tag}>`, 'g'), '');
