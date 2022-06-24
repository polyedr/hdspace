import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';

export const useDebouncedRichInputChange = (
  richContent: any,
  id: number,
  cb: (...args: any) => void,
  delay: number = 500,
) => {
  const content = richContent || '';
  const [state, setState] = useState<{ editor: any; id: number }>({
    editor: EditorState.createWithContent(convertFromHTML(content)),
    id,
  });

  useEffect(() => {
    setState({
      editor: EditorState.createWithContent(convertFromHTML(content)),
      id,
    });
  }, [content, id]);

  const debounced = useDebouncedCallback(cb, delay);

  const handleChange = (value: EditorState) => {
    // @ts-ignore
    setState({
      editor: value,
      id,
    });
    if (debounced.pending()) {
      debounced.cancel();
    }
    debounced.callback(value, id);
  };

  return [state, handleChange];
};

export const useDebouncedInputChange = (
  value: any,
  cb: (...args: any) => void,
  delay: number = 500,
) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    setState(value);
  }, [value]);

  const debounced = useDebouncedCallback(cb, delay);

  const handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setState(value);
    if (debounced.pending()) {
      debounced.cancel();
    }
    debounced.callback(value);
  };

  return [state, handleChange];
};

export const useDebouncedValueChange = <T>(
  value: T,
  cb: (newValue: T) => void,
  delay: number = 250,
) => {
  const [state, setState] = useState<T>(value);
  useEffect(() => {
    setState(value);
  }, [value]);

  const debounced = useDebouncedCallback(cb, delay);

  const handleChange: (value: T) => void = (value) => {
    setState(value);
    if (debounced.pending()) {
      debounced.cancel();
    }
    debounced.callback(value);
  };
  return [state, handleChange];
};
