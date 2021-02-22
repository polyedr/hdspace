/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React, { useEffect, useState, useCallback } from 'react';
import { mutateTree, TreeData } from '@atlaskit/tree';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  selectElementsForCurrentScreen,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';
import Tree from '@Components/LeftPanel/Navigator/components/Tree';
import { selectMasterScreenEnabled } from '@Redux/project/selectors/screen';
import { makeTree, updateTree, convertElements } from './utils';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const Navigator: React.FC = () => {
  const elements = useSelector(selectElementsForCurrentScreen);
  const rootId = useSelector(selectCurrentRootId);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const [tree, setTree] = useState<TreeData>(
    makeTree(convertElements({ ...elements }, masterScreenEnabled), rootId),
  );

  useEffect(() => {
    if (masterScreenEnabled) {
      return;
    }
    const newTree = makeTree(convertElements(elements), rootId);
    setTree(updateTree(tree, newTree));
  }, [elements, masterScreenEnabled, rootId, tree]);

  const expandParents = useCallback(
    (itemId) => {
      if (itemId === 'root') return;
      // @ts-ignore
      const parentId = tree.items[itemId]?.parent;
      if (!parentId) return;
      if (!tree.items[parentId].isExpanded) {
        setTree((prevTree) => {
          return mutateTree(prevTree, parentId, { isExpanded: true });
        });
      }
      expandParents(parentId);
    },
    [tree],
  );

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Navigator
      </StyledAccordionSummary>

      <StyledAccordionDetails>
        <Tree tree={tree} setTree={setTree} elements={elements} />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default Navigator;
