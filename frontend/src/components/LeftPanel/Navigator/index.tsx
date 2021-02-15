/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React, { useEffect, useState } from 'react';
import { TreeData } from '@atlaskit/tree';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  selectElementsForCurrentScreen,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';
import Tree from '@Components/LeftPanel/Navigator/components/Tree';
import {
  selectMasterElements,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/masterScreen';
import { makeTree, updateTree, convertElements } from './utils';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const Navigator: React.FC = () => {
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const masterElements = useSelector(selectMasterElements);
  const screenElements = useSelector(selectElementsForCurrentScreen);
  const screenRootId = useSelector(selectCurrentRootId);

  const rootId = masterScreenEnabled ? 'masterRoot' : screenRootId;

  const elements = masterScreenEnabled ? masterElements : screenElements;

  const [tree, setTree] = useState<TreeData>(
    makeTree(convertElements(elements), rootId),
  );

  useEffect(() => {
    const newTree = makeTree(convertElements(elements), rootId);
    setTree(updateTree(tree, newTree));
  }, [elements, rootId]);

  // const expandParents = useCallback((itemId) => {
  //   if (itemId === 'root') return;
  //   // @ts-ignore
  //   const parentId = tree.items[itemId]?.parent;
  //   if (!parentId) return;

  //   setTree((prevTree) => mutateTree(prevTree, parentId, { isExpanded: true }));
  //   expandParents(parentId);
  // }, []);

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
