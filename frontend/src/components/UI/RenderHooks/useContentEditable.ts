import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateElementParameters } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { useDebouncedCallback } from 'use-debounce';
import { EventHandlers } from '../RenderElements/types';

export type ContentEditableProps = {
  contentEditable: boolean;
  tabIndex?: number;
};

export type ContentEditableConfig<T extends HTMLElement> = {
  props: ContentEditableProps;
  events: EventHandlers<T>;
};

const useContentEditable = <T extends HTMLElement>(
  elementId: string,
  textContent: string,
): ContentEditableConfig<T> => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectCurrentScreenId);
  const [contentEditable, setContentEditable] = useState<boolean>(false);

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

  const config = useMemo(
    () => ({
      props: {
        contentEditable,
      },
      events: {
        onClick: () => {
          if (!contentEditable) {
            setContentEditable(true);
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
        onBlur: (event: React.SyntheticEvent) => {
          if (contentEditable) {
            setContentEditable(false);
            debouncedCallback.cancel();
            debouncedCallback.callback(
              (event.target as HTMLElement).innerHTML.trim(),
            );
          }
        },
      },
    }),
    [contentEditable, debouncedCallback, saveElementContent],
  );

  return config;
};

export default useContentEditable;
