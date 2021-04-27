import React, { useMemo } from 'react';

import { RendererProps, DefaultEventHandlers } from '../RenderElements/types';

const useEventHandlers = (
  props: RendererProps,
  defaultHandlers: DefaultEventHandlers = {},
  skipHandlers: string[] = [],
): any => {
  const eventNames = Object.keys(props).filter((name) => {
    return name.startsWith('on') && props[name] instanceof Function;
  });

  const handlers = useMemo(
    () => {
      return {
        ...defaultHandlers,
        ...eventNames.reduce((acc, eventName) => {
          if (skipHandlers.includes(eventName)) {
            return acc;
          }
          const handler = defaultHandlers[eventName]
            ? (event: React.SyntheticEvent<HTMLElement>) => {
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

  return handlers;
};

export default useEventHandlers;
