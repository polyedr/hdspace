import { useEffect } from 'react';
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
    const listener = (event: KeyboardEvent) => {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && event.metaKey)
      ) {
        dispatch(deleteItem(id, { screenId: currentScreenId }));
        ref.current?.focus();
      }
    };

    ref.current?.addEventListener('keydown', listener);
    return () => ref.current?.removeEventListener('keydown', listener);
  }, [ref, id, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.altKey) {
        dispatch(wrapIntoContainer(id, { screenId: currentScreenId }));
        ref.current?.focus();
      }
    };

    ref.current?.addEventListener('keydown', listener);
    return () => ref.current?.removeEventListener('keydown', listener);
  }, [ref, id, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        event.code === 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
        ref.current?.focus();
      }
    };

    ref.current?.addEventListener('keydown', listener);
    return () => ref.current?.removeEventListener('keydown', listener);
  }, [ref]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        event.code === 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        dispatch(pasteCopiedElement({ screenId: currentScreenId }));
        ref.current?.focus();
      }
    };

    ref.current?.addEventListener('keydown', listener);
    return () => ref.current?.removeEventListener('keydown', listener);
  }, [ref, currentScreenId]);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && !ev.shiftKey) {
        dispatch(undoAction());
        ref.current?.focus();
      }

      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && ev.shiftKey) {
        dispatch(redoAction());
        ref.current?.focus();
      }
    };

    ref.current?.addEventListener('keydown', listener);
    return () => ref.current?.removeEventListener('keydown', listener);
  }, [ref]);
};

export default useHotKeys;
