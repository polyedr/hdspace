import { useMemo } from 'react';

import { SharedRendererProps } from './types';

type DefaultHandlers = {
  [eventName: string]: (event: React.SyntheticEvent) => void;
};

const useEventHandlers = (
  props: SharedRendererProps,
  defaultHandlers: DefaultHandlers = {},
  skipHandlers: string[] = [],
) => {
  const eventNames = Object.keys(props).filter((name) => {
    return name.startsWith('on') && props[name] instanceof Function;
  });

  return useMemo(
    () => {
      return {
        ...defaultHandlers,
        ...eventNames.reduce((acc, eventName) => {
          if (skipHandlers.includes(eventName)) {
            return acc;
          }
          const handler = defaultHandlers[eventName]
            ? (event: React.SyntheticEvent) => {
                defaultHandlers[eventName](event);
                props[eventName](event);
              }
            : props[eventName];
          return {
            ...acc,
            [eventName]: handler,
          };
        }, {}),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventNames.length, defaultHandlers, skipHandlers],
  );
};

export default useEventHandlers;
