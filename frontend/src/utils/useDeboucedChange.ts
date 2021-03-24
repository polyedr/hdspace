import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useDebouncedChange = (
  value: any,
  cb: (...args: any) => void,
  delay: number = 500,
) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    setState(value);
  }, [value]);

  const debounced = useDebouncedCallback(cb, delay);

  const handleChange = ({ target: { value } }) => {
    setState(value);
    debounced.callback(value);
  };

  return [state, handleChange];
};

export default useDebouncedChange;
