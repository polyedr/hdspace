/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import useProfunctorState from '@staltz/use-profunctor-state';
import { useSelector } from 'react-redux';
import TreeView from './components/TreeView';
import { makeTree, convertTree } from './utils';
import {
  selectActiveItem,
  selectCurrentScreenElement,
} from '$redux/project/selectors';
import { Tree } from '$components/Navigator/types';

const styles = require('./Navigator.scss');

export type State = {
  tree: Tree;
};

const Navigator: React.FC = () => {
  const rootElement = useSelector(selectCurrentScreenElement);
  const { itemId: activeItemId } = useSelector(selectActiveItem);

  const appState = useProfunctorState<State>({
    tree: makeTree([convertTree(rootElement)]),
  });

  useEffect(() => {
    appState.setState(() => ({
      tree: {
        ...appState.state.tree,
        selectedItem: activeItemId,
      },
    }));
  }, [activeItemId]);

  useEffect(() => {
    appState.setState(() => ({ tree: makeTree([convertTree(rootElement)]) }));
  }, [rootElement]);

  const treeState = appState.promap(
    (state) => state.tree,
    (tree, state) => ({ ...state, tree }),
  );

  return (
    <div className={styles.componentPane}>
      <div
        className={styles.toolbar}
        role="toolbar"
        aria-controls="tree"
        aria-label="add or remove components"
      >
        <button
          disabled={!treeState.state.selectedItem}
          onClick={() => {}}
          type="button"
          aria-label="remove component"
        >
          −
        </button>

        <button onClick={() => {}} type="button" aria-label="add component">
          +
        </button>
      </div>

      <TreeView
        // addNode={(selected) => addNode(treeState, node('New item', {}, []))}
        {...treeState}
      />
    </div>
  );
};

export default Navigator;
