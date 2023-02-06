import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { selectIsPrototypeMode } from '@Redux/user/selectors';

import { RendererProps, EventHandlers } from '../RenderElements/types';

const useEventHandlers = <T extends HTMLElement>(
  props: RendererProps,
  defaultHandlers: EventHandlers<T> = {},
  skipHandlers: string[] = [],
): EventHandlers<T> => {
  const eventNames = Object.keys(props).filter(
    (name) => name.startsWith('on') && props[name] instanceof Function,
  );
  const isPrototypeMode = useSelector(selectIsPrototypeMode);

  const handlers = useMemo(
    () => {
      if (!isPrototypeMode) {
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
      }
      return {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventNames.length, defaultHandlers, skipHandlers, isPrototypeMode],
  );

  return handlers;
};

export default useEventHandlers;
