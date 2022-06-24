/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React, { useEffect, useState, useCallback } from 'react';
import { mutateTree, TreeData } from '@atlaskit/tree';
import { useSelector } from 'react-redux';

import {
  selectCurrentRootId,
  selectAllElements,
} from '@Redux/project/selectors/element';
import Tree from '@Components/LeftPanel/Navigator/components/Tree';
import { selectMasterScreenEnabled } from '@Redux/project/selectors/screen';
import { makeTree, updateTree, convertElements } from './utils';
import {
  StyledAccordion,
  StyledAccordionDetails,
} from '../../styledComponents';

const Navigator: React.FC = () => {
  const elements = useSelector(selectAllElements);
  const rootId = useSelector(selectCurrentRootId);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const [tree, setTree] = useState<TreeData>(
    makeTree(convertElements(elements, masterScreenEnabled), rootId),
  );

  useEffect(() => {
    const newTree = makeTree(convertElements(elements), rootId);
    const updatedTree = updateTree(tree, newTree);
    setTree(updatedTree);
  }, [rootId, elements]);

  const expandParents = useCallback(
    (itemId) => {
      if (itemId === 'root') return;
      // @ts-ignore
      const parentId = tree.items[itemId]?.parent;
      if (!parentId) return;
      setTree((prevTree) => {
        return mutateTree(prevTree, parentId, { isExpanded: true });
      });
      expandParents(parentId);
    },
    [tree],
  );
  const styles = {
    '& .MuiAccordionDetails-root': {
      boxShadow: 'none',
      backgroundColor: '#ffffff',
    },
  };
  return (
    <StyledAccordion defaultExpanded sx={styles}>
      <StyledAccordionDetails>
        <Tree tree={tree} setTree={setTree} elements={elements} />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default React.memo(Navigator);
