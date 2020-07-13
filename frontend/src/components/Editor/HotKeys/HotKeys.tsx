import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { actionsCreators } from '$redux/project';

const mapDispatch = {
  deleteActiveItem: actionsCreators.deleteActiveItem,
  wrapIntoContainer: actionsCreators.wrapIntoContainer,
  copyActiveItem: actionsCreators.copyActiveItem,
  pasteCopiedItem: actionsCreators.pasteCopiedItem,
};

type Props = typeof mapDispatch;

export const Component = (props: Props) => {
  const {
    deleteActiveItem,
    wrapIntoContainer,
    copyActiveItem,
    pasteCopiedItem,
  } = props;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 8) { // TODO not working when create new project
        deleteActiveItem();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [deleteActiveItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code == 'KeyC' && event.altKey) {
        wrapIntoContainer();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [wrapIntoContainer]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent = event.code == 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [copyActiveItem]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent = event.code == 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        pasteCopiedItem();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [pasteCopiedItem]);

  return null;
};

export const HotKeys = connect(null, mapDispatch)(Component);
