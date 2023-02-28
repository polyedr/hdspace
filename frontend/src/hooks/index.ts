import React, { useEffect, useRef } from 'react';

export const useUpdatedEffect = (
  callback: React.EffectCallback,
  deps: React.DependencyList,
) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return callback();
    } else {
      isMounted.current = true;
    }
  }, deps);
};
