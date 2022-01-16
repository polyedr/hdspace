// type = 'Password' | 'Username'
const isLongLength = (value: string, type: string = 'Password') => {
  console.log('value', value);
  const minLength = type === 'Password' ? 8 : 5;
  return value?.length >= minLength && value?.length <= 30
    ? undefined
    : `${type} should consists of 4 to 30 characters`;
};

export default isLongLength;
