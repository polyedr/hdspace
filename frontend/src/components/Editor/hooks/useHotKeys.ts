import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElementId,
  selectCurrentScreenId,
} from '../../../redux/project/selectors';
import {
  copyActiveItem,
  deleteItem,
  pasteCopiedElement,
  redoAction,
  undoAction,
  wrapIntoContainer,
} from '../../../redux/project/actions';

const useHotKeys = (ref: React.RefObject<HTMLElement>) => {
  const currentScreenId = useSelector(selectCurrentScreenId);
  const id = useSelector(selectActiveElementId);
  const dispatch = useDispatch();

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && event.metaKey)
      ) {
        dispatch(deleteItem(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, id, currentScreenId, dispatch]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.altKey) {
        dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, id, currentScreenId, dispatch]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        event.code === 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        dispatch(copyActiveItem());
        navigator.clipboard.writeText('');
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref]);

  useEffect(() => {
    const element = ref.current;

    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        event.code === 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        dispatch(pasteCopiedElement({ screenId: currentScreenId }));
        element?.focus();
      }
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, currentScreenId, dispatch]);

  useEffect(() => {
    const element = ref.current;

    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey)) {
        dispatch(ev.shiftKey ? redoAction() : undoAction());
        element?.focus();
      }

      /* if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && ev.shiftKey) {
        dispatch(redoAction());
        element?.focus();
      } */
    };

    element?.addEventListener('keydown', listener);
    return () => element?.removeEventListener('keydown', listener);
  }, [ref, dispatch]);
};

export default useHotKeys;
