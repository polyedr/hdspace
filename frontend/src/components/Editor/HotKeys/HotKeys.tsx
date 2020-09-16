import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentScreenId,
  selectCurrentRootElement,
} from '../../../redux/project/selectors';
import { AppReduxState } from '../../../shared/types/app';
import {
  copyActiveItem,
  deleteItem,
  pasteCopiedElement,
  redoAction,
  undoAction,
  wrapIntoContainer,
} from '../../../redux/project/actions';

const mapState = (state: AppReduxState) => {
  return {
    rootElement: selectCurrentRootElement(state),
  };
};

const mapDispatch = {
  deleteActiveItem: deleteItem,
  wrapIntoContainer,
  copyActiveItem,
  pasteCopiedItem: pasteCopiedElement,
  undo: undoAction,
  redo: redoAction,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

export const Component = ({
  rootElement,
  deleteActiveItem,
  wrapIntoContainer,
  copyActiveItem,
  pasteCopiedItem,
  undo,
  redo,
}: Props) => {
  const root = document.getElementById('root');
  const currentScreenId = useSelector(selectCurrentScreenId);
  const { id } = useSelector(selectActiveElement);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && event.metaKey)
      ) {
        deleteActiveItem(id, { screenId: currentScreenId });
        root?.focus();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, deleteActiveItem, id, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.altKey) {
        wrapIntoContainer(id, { screenId: currentScreenId });
        root?.focus();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, wrapIntoContainer, id, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        event.code === 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
        root?.focus();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, copyActiveItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent =
        event.code === 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        pasteCopiedItem({ screenId: currentScreenId });
        root?.focus();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, pasteCopiedItem, currentScreenId]);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && !ev.shiftKey) {
        undo();
        root?.focus();
      }

      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && ev.shiftKey) {
        redo();
        root?.focus();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, undo]);
  return null;
};

export const HotKeys = connect(mapState, mapDispatch)(Component);
