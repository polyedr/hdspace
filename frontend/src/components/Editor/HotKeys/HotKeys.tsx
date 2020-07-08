import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { selectors, actionsCreators } from '$redux/project';
import { AppReduxState } from '$shared/types/app';

type StateProps = {
  rootID: string;
};

const mapDispatch = {
  deleteActiveItem: actionsCreators.deleteActiveItem,
  wrapIntoContainer: actionsCreators.wrapIntoContainer,
  copyActiveItem: actionsCreators.copyActiveItem,
  pasteCopiedItem: actionsCreators.pasteCopiedItem,
};

const mapState = (state: AppReduxState): StateProps => ({
  rootID: selectors.selectRootElement(state).id,
});

type Props = StateProps & typeof mapDispatch;

export const Component = (props: Props) => {
  const {
    deleteActiveItem,
    wrapIntoContainer,
    copyActiveItem,
    pasteCopiedItem,
    rootID,
  } = props;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.keyCode === 8) {
        deleteActiveItem();
      }
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('keydown', listener);
    return () => rootElement?.removeEventListener('keydown', listener);
  }, [deleteActiveItem, rootID]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code == 'KeyC' && event.altKey) {
        wrapIntoContainer();
      }
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('keydown', listener);
    return () => { rootElement?.removeEventListener('keydown', listener); }
  }, [wrapIntoContainer, rootID]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemCopyEvent = event.code == 'KeyC' && (event.metaKey || event.ctrlKey);

      if (isItemCopyEvent) {
        copyActiveItem();
        navigator.clipboard.writeText('');
      }
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('keydown', listener);
    return () => rootElement?.removeEventListener('keydown', listener);
  }, [copyActiveItem, rootID]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const isItemPasteEvent = event.code == 'KeyV' && (event.metaKey || event.ctrlKey);

      if (isItemPasteEvent) {
        pasteCopiedItem();
      }
    };

    const rootElement = document.getElementById('root');
    rootElement?.addEventListener('keydown', listener);
    return () => rootElement?.removeEventListener('keydown', listener);
  }, [pasteCopiedItem, rootID]);

  return null;
};

export const HotKeys = connect(mapState, mapDispatch)(Component);
