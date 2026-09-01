import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { updateElementParameters } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { EventHandlers } from '../RenderElements/types';

export interface ContentEditableProps {
  contentEditable: boolean;
  tabIndex?: number;
}

export interface ContentEditableConfig<T extends HTMLElement> {
  props: ContentEditableProps;
  events: EventHandlers<T>;
}

const useContentEditable = <T extends HTMLElement>(
  elementId: string,
  textContent: string,
): ContentEditableConfig<T> => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);
  const [contentEditable, setContentEditable] = useState<boolean>(false);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);

  const saveElementContent = useCallback(
    (newTextContent: string) => {
      if (textContent !== newTextContent) {
        dispatch(
          updateElementParameters(
            elementId,
            {
              textContent: newTextContent,
            },
            { screenId },
          ),
        );
      }
    },
    [dispatch, elementId, screenId, textContent],
  );

  const debouncedCallback = useDebouncedCallback(saveElementContent, 500);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = useMemo(
    () => ({
      props: {
        contentEditable,
      },
      events: {
        onClick: () => {
          if (!contentEditable && !isPrototypeMode) {
            setContentEditable(false);
            if (timer.current) {
              clearTimeout(timer.current);
              timer.current = null;
            }
            timer.current = setTimeout(() => {
              setContentEditable(false);
              timer.current = null;
            }, 500);
          }
        },
        onKeyDown: (event: React.SyntheticEvent<HTMLElement>) => {
          const e = event as React.KeyboardEvent<HTMLElement>;
          if (e.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
            setContentEditable(false);
            saveElementContent((event.target as HTMLElement).innerHTML.trim());
          } else if (e.key === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            setContentEditable(false);
          }
        },
        onFocus: () => {
          if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
          }
        },
        onBlur: (event: React.SyntheticEvent) => {
          setContentEditable(false);
          debouncedCallback.cancel();
          debouncedCallback.callback(
            (event.target as HTMLElement).innerHTML.trim(),
          );
        },
      },
    }),
    [contentEditable, debouncedCallback, saveElementContent, isPrototypeMode],
  );

  return config;
};

export default useContentEditable;
