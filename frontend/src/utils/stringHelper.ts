export const splitWords = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');

export const kebabToCamel = (str: string) =>
  str
    .split('-')
    .map((word, i) => (i ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join('');

export const extractStyles = (htmlString: string) => {
  const match = [...htmlString.matchAll(/<style.*?>([\s\S]*?)<\/style>/g)];
  const styles = match.reduce((acc, curr) => acc + curr[1], '');
  return styles;
};

export const toClassName = (str: string): string | null =>
  !str ? null : str.replaceAll(' ', '_').toLowerCase();
