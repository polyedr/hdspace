import React, { useMemo } from 'react';

import { RendererProps, EventHandlers } from '../RenderElements/types';

const useEventHandlers = <T extends HTMLElement>(
  props: RendererProps,
  defaultHandlers: EventHandlers<T> = {},
  skipHandlers: string[] = [],
): EventHandlers<T> => {
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
            ? (event: React.SyntheticEvent<T>) => {
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
