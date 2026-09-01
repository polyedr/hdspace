const convertDateToRelative = (date: Date) => {
  const insertSIfNecessary = (x: number): 's' | '' => (x === 1 ? '' : 's');

  const m = Math.round((Date.now() - Number(date)) / 1000 / 60);
  const hour = 60;
  const day = hour * 24;
  const month = day * 30;
  const year = month * 12;

  if (m < 1) {
    return 'just now';
  }
  if (m >= 1 && m < hour) {
    return `${m} minute${insertSIfNecessary(m)} ago`;
  }
  if (m >= hour && m < day) {
    const h = Math.round(m / 60);
    return `${h} hour${insertSIfNecessary(h)} ago`;
  }
  if (m >= day && m < month) {
    const d = Math.round(m / 60 / 24);
    return `${d} day${insertSIfNecessary(d)} ago`;
  }
  if (m >= month && m < year) {
    const M = Math.round(m / 60 / 24 / 30);
    return `${M} month${insertSIfNecessary(M)} ago`;
  }
  const y = Math.round(m / 60 / 24 / 30 / 12);
  return y < 2 ? 'last year' : `${y} years ago`;
};

export default convertDateToRelative;
