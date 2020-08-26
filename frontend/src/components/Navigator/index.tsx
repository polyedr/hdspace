/* eslint-disable */
import React, { useEffect } from "react";
import useProfunctorState from '@staltz/use-profunctor-state';
import TreeView, {
  deselect,
  addNode,
  removeSelectedNode,
} from "./components/TreeView";
import {
  makeTree,
  node,
  convertTree
} from './utils'

const styles = require('./Navigator.scss');
import { useSelector } from "react-redux";
import { selectCurrentScreenElement } from "$redux/project/selectors";

const initialTree = makeTree([
  node('First parent', {}, [
    node('Child one', {}, [
      node('Subchild 1', {}, [])
    ]),
    node('Child two', {}, []),
  ]),
  node('Second parent', { stuff: 789 }, [
    node('Child one', {}, []),
    node('Child two', {}, []),
  ]),
]);

const Navigator: React.FC = () => {
  const rootElement = useSelector(selectCurrentScreenElement);

  const appState = useProfunctorState({ tree: makeTree([convertTree(rootElement)]) });

  useEffect(() => {
    appState.setState(() => ({tree: makeTree([convertTree(rootElement)])}));
  }, [rootElement]);

  const treeState = appState.promap(
    (state) => state.tree,
    (tree, state) => ({ ...state, tree }),
  );

  return (
    <div
      // onClick={(e) => {
      //   if (
      //     // @ts-ignore
      //   !e.target.matches('.tree > div *') &&
      //     // @ts-ignore
      //   !e.target.matches('[role=toolbar] *')
      //   ) {
      //     deselect(treeState);
      //   }
      // }}
    >
      <div className={styles.componentPane}>
        <div
          className={styles.toolbar}
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
