import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ActionCreators as undoAC } from 'redux-undo';
import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { selectUndoActions } from '$redux/project/selectors';

const mapState = (state: AppReduxState) => {
  return {
    rootElement: selectors.selectRootElement(state),
  };
};

const mapDispatch = {
  deleteActiveItem: actionsCreators.deleteActiveItem,
  wrapIntoContainer: actionsCreators.wrapIntoContainer,
  copyActiveItem: actionsCreators.copyActiveItem,
  pasteCopiedItem: actionsCreators.pasteCopiedItem,
  undo: undoAC.undo,
  redo: undoAC.redo,
};

type Props = & ReturnType<typeof mapState> & typeof mapDispatch;

export const Component = (props: Props) => {
  const {
    rootElement,
    deleteActiveItem,
    wrapIntoContainer,
    copyActiveItem,
    pasteCopiedItem,
    undo,
    redo
  } = props;
  const dispatch = useDispatch();
  const undos = useSelector(selectUndoActions);
  
  const root = document.getElementById('root');

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 8) {
        deleteActiveItem();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, deleteActiveItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code == 'KeyC' && event.altKey) {
        wrapIntoContainer();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, wrapIntoContainer]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent = event.code == 'KeyC' && (event.metaKey || event.ctrlKey);

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
      const isItemPasteEvent = event.code == 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        pasteCopiedItem();
      }
    };

    root?.addEventListener('keydown', listener);
    return () => root?.removeEventListener('keydown', listener);
  }, [rootElement, root, pasteCopiedItem]);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.code === 'KeyZ' && (ev.metaKey || ev.ctrlKey) && !ev.shiftKey) {
        undo();
        undos.forEach(undo => dispatch(undo))
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
