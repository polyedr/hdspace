import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TreeData } from '@atlaskit/tree/types';
import TreeView from './components/TreeView';
import { makeTree, convertTree } from './utils';
import { selectCurrentScreenElement } from '$redux/project/selectors';

const styles = require('./Navigator.scss');

const Navigator: React.FC = () => {
  const rootElement = useSelector(selectCurrentScreenElement);

  const [tree, setTree] = useState<TreeData>(
    makeTree([convertTree(rootElement)]),
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    setTree(makeTree([convertTree(rootElement)]));
  }, [rootElement]);

  return (
    <div className={styles.componentPane}>
      <TreeView
        tree={tree}
        setTree={setTree}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
    </div>
  );
};

export default Navigator;
