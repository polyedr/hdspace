import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  selectActiveItem,
  selectCurrentScreenId,
  selectRootElement,
} from '../../../redux/project/selectors';
import { AppReduxState } from '../../../shared/types/app';
import {
  copyActiveItem,
  deleteItem,
  pasteCopiedItem,
  redoAction,
  undoAction,
  wrapIntoContainer,
} from '../../../redux/project/actions';

const mapState = (state: AppReduxState) => {
  return {
    rootElement: selectRootElement(state),
  };
};

const mapDispatch = {
  deleteActiveItem: deleteItem,
  wrapIntoContainer,
  copyActiveItem,
  pasteCopiedItem,
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
  const { itemId } = useSelector(selectActiveItem);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (
        event.key === 'Delete' ||
        (event.key === 'Backspace' && event.metaKey)
      ) {
        deleteActiveItem(itemId, { screenId: currentScreenId });
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, deleteActiveItem, itemId, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.altKey) {
        wrapIntoContainer(itemId, { screenId: currentScreenId });
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, wrapIntoContainer, itemId, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent =
        event.code === 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
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
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, pasteCopiedItem, currentScreenId]);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && !ev.shiftKey) {
        undo();
      }

      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && ev.shiftKey) {
        redo();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, undo]);
  return null;
};

export const HotKeys = connect(mapState, mapDispatch)(Component);
