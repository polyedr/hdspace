// type = 'Password' | 'Username'
const isLongLength = (value: string, type: string = 'Password') => {
  const minLength = type === 'Password' ? 8 : 5;
  return value?.length >= minLength && value?.length <= 30
    ? undefined
    : `${type} should consists of ${minLength} to 30 characters`;
};

export default isLongLength;
