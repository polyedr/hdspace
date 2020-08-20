import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { selectCurrentScreenId } from '$redux/project/selectors';

const mapState = (state: AppReduxState) => {
  return {
    rootElement: selectors.selectRootElement(state),
  };
};

const mapDispatch = {
  deleteActiveItem: actionsCreators.deleteItem,
  wrapIntoContainer: actionsCreators.wrapIntoContainer,
  copyActiveItem: actionsCreators.copyActiveItem,
  pasteCopiedItem: actionsCreators.pasteCopiedItem,
  undo: actionsCreators.undoAction,
  redo: actionsCreators.redoAction,
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
  const { itemId } = useSelector(selectors.selectActiveItem);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 8) {
        deleteActiveItem(itemId, currentScreenId);
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, deleteActiveItem, itemId, currentScreenId]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'KeyC' && event.altKey) {
        wrapIntoContainer(itemId);
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, wrapIntoContainer, itemId]);

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
        pasteCopiedItem(currentScreenId);
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
