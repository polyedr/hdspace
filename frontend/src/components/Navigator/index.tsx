/* eslint-disable */
import React from 'react';
import useProfunctorState from '@staltz/use-profunctor-state';
import TreeView, {
  makeTree,
  node,
  deselect,
  addNode,
  removeSelectedNode,
} from './components/TreeView';

import './styles.css';

const initialTree = makeTree([
  node('First parent', {}, [
    node('Child one', {}, []),
    node('Child two', {}, []),
  ]),
  node('Second parent', { stuff: 789 }, [
    node('Child one', {}, []),
    node('Child two', {}, []),
  ]),
]);

function Navigator() {
  const appState = useProfunctorState({ tree: initialTree });

  const treeState = appState.promap(
    (state) => state.tree,
    (tree, state) => ({ ...state, tree }),
  );

  return (
    <div
      onClick={(e) => {
        if (
          // @ts-ignore
        !e.target.matches('.tree > div *') &&
          // @ts-ignore
        !e.target.matches('[role=toolbar] *')
        )
          deselect(treeState);
      }}
    >
      <div className="component-pane">
        <h1>Tree View</h1>

        <div
          role="toolbar"
          aria-controls="tree"
          aria-label="add or remove components"
        >
          <button
            disabled={!treeState.state.selectedItem}
            onClick={() => removeSelectedNode(treeState)}
            aria-label="remove component"
          >
            −
          </button>

          <button
            onClick={() => addNode(treeState, node('New item', {}, []))}
            aria-label="add component"
          >
            +
          </button>
        </div>

        <TreeView
          addNode={(selected) => addNode(treeState, node('New item', {}, []))}
          {...treeState}
        />
      </div>
    </div>
  );
}

export default Navigator;
