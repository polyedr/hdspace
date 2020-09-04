import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TreeData } from '@atlaskit/tree/types';
import TreeView from './components/TreeView';
import { makeTree, convertTree, updateTree, focusTreeItem } from './utils';
import { selectCurrentScreenElement } from '../../redux/project/selectors';

const styles = require('./Navigator.scss');

const Navigator: React.FC = () => {
  const rootElement = useSelector(selectCurrentScreenElement);

  const [tree, setTree] = useState<TreeData>(
    makeTree([convertTree(rootElement)]),
  );
  const [selectedItemId, setSelectedItem] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const newTree = makeTree([convertTree(rootElement)]);
    setTree(updateTree(tree, newTree));
    focusTreeItem(selectedItemId);
  }, [rootElement]);

  return (
    <div className={styles.componentPane}>
      <h3 className={styles.header}>Navigator</h3>

      <TreeView
        tree={tree}
        setTree={setTree}
        selectedItemId={selectedItemId}
        setSelectedItem={setSelectedItem}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
    </div>
  );
};

export default Navigator;
