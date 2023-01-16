export const splitWords = (str: string) =>
  str?.toString().replace(/([a-z])([A-Z])/g, '$1 $2');

export const kebabToCamel = (str: string) =>
  str
    .split('-')
    .map((word, i) => (i ? `${word[0]?.toUpperCase()}${word.slice(1)}` : word))
    .join('');

export const extractStyles = (htmlString: string) => {
  const match = [...htmlString.matchAll(/<style.*?>([\s\S]*?)<\/style>/g)];
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const styles = match.reduce((acc, curr) => acc + curr[1], '');
  return styles;
};

export const toClassName = (str: string): string =>
  !str ? '' : str.replaceAll(' ', '-');

export const getUnitFromValue = (value: string) =>
  value.replace(/[0-9, \d+.\d+]/g, '');

export const capitalize = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
