/* eslint-disable no-param-reassign,no-return-assign,no-unused-vars,no-shadow */
import React, { useEffect, KeyboardEvent, useState, useCallback } from 'react';
import AtlasTree, {
  mutateTree,
  TreeSourcePosition,
  TreeDestinationPosition,
  TreeData,
  RenderItemParams,
} from '@atlaskit/tree';
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {
  selectActiveElement,
  selectElementsForCurrentScreen,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  copyActiveElement,
  deleteElement,
  moveElement,
  pasteCopiedElement,
  redoAction,
  setActiveElementId,
  undoAction,
} from '@Redux/project/actions';
import { canElementBeAdded } from '@Utils/normalizedStateHelpers';
import { enqueueSnackbar } from '@Redux/notification/actions';
import TreeItem from './components/TreeItem';
import {
  findPrevNodeId,
  findNextNodeId,
  focusTreeItem,
  makeTree,
  updateTree,
  convertElements,
} from './utils';
import Scrollbar from '../../UI/Scrollbar';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const useStyles = makeStyles({
  tree: {
    fontSize: '0.75em',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',

    '& > :first-child': {
      flex: '1',
      overflow: 'auto',
    },
  },
});
const OFFSET = 15;

const Navigator: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const elements = useSelector(selectElementsForCurrentScreen);
  const rootId = useSelector(selectCurrentRootId);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const { id: activeItemId } = useSelector(selectActiveElement);

  const [tree, setTree] = useState<TreeData>(
    makeTree(convertElements(elements), rootId),
  );

  const [selectedItemId, setSelectedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const newTree = makeTree(convertElements(elements), rootId);
    setTree(updateTree(tree, newTree));
  }, [elements, rootId]);

  const expandParents = useCallback((itemId) => {
    if (itemId === 'root') return;
    // @ts-ignore
    const parentId = tree.items[itemId]?.parent;
    if (!parentId) return;

    setTree((prevTree) => mutateTree(prevTree, parentId, { isExpanded: true }));
    expandParents(parentId);
  }, []);

  useEffect(() => {
    setSelectedItem(activeItemId);
    expandParents(activeItemId);
  }, [activeItemId, expandParents]);

  const expand = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: true }));

  const collapse = (itemId) =>
    setTree((state) => mutateTree(state, itemId, { isExpanded: false }));

  const select = (itemId) => {
    if (selectedItemId === itemId) return;

    dispatch(setActiveElementId(itemId));
    setSelectedItem(itemId);
  };

  const deselect = () => {
    setSelectedItem(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (selectedItemId && !isDragging) {
      if (e.keyCode === 38) {
        // ArrowUp
        // TODO: add throttling
        e.preventDefault();
        const prevNodeId = findPrevNodeId(tree, selectedItemId);
        select(prevNodeId);
        focusTreeItem(prevNodeId);
      }

      if (e.keyCode === 40) {
        // ArrowDown
        // TODO: add throttling
        e.preventDefault();
        const nextNodeId = findNextNodeId(tree, selectedItemId);
        focusTreeItem(nextNodeId);
      }

      if (e.keyCode === 39) {
        // ArrowRight
        expand(selectedItemId);
        select(selectedItemId);
      }

      if (e.keyCode === 37) {
        // ArrowLeft
        collapse(selectedItemId);
        select(selectedItemId);
      }

      if (e.keyCode === 32) {
        // Space
        setIsDragging((state) => !state);
      }

      if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + C
        dispatch(copyActiveElement());
      }

      if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + V
        dispatch(pasteCopiedElement({ screenId: currentScreenId }));
      }

      if (e.keyCode === 46 || (e.keyCode === 8 && e.metaKey)) {
        // Delete or Cmd + Backspace
        const prevItemId = findPrevNodeId(tree, selectedItemId);
        dispatch(deleteElement(selectedItemId, { screenId: currentScreenId }));
        focusTreeItem(prevItemId);
      }

      if (e.keyCode === 90 && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        // Ctrl/Cmd + Z
        dispatch(undoAction());
      }

      if (e.keyCode === 90 && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        // Ctrl/Cmd + Shift + Z
        dispatch(redoAction());
      }
    }
  };

  const dragStart = (itemId) => select(itemId);

  const dragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (!destination) {
      setIsDragging(false);
      return;
    }

    const { items } = tree;

    const oldParent = items[source.parentId];
    const newParent = items[destination.parentId];

    if (destination.index === undefined) {
      destination.index =
        newParent.id === oldParent.id
          ? newParent.children.length - 1
          : newParent.children.length;
    }

    const childId = oldParent.children[source.index];
    const child = items[childId];

    const parentElement = elements[newParent.id];

    if (!parentElement) {
      console.error(`No element ${newParent.id}`);
      setIsDragging(false);
      return;
    }
    if (!canElementBeAdded(elements, newParent.id as string, child.data.type)) {
      dispatch(
        enqueueSnackbar({
          message: 'Can not add this element!',
          options: { variant: 'warning' },
        }),
      );
      setIsDragging(false);
      return;
    }

    if (newParent.id === oldParent.id && source.index === destination.index) {
      setIsDragging(false);
      return;
    }

    dispatch(
      moveElement(
        childId as string,
        { newIndex: destination.index as number, oldIndex: source.index },
        {
          newParentId: destination.parentId as string,
          oldParentId: source.parentId as string,
        },
        { screenId: currentScreenId },
      ),
    );
    setIsDragging(false);
    select(
      newParent.isExpanded ? oldParent.children[source.index] : newParent.id,
    );
  };

  const renderItem = (props: RenderItemParams) => {
    const height = 21.25;
    const getRulerHeight = (): number => {
      const { isExpanded, children } = props.item;
      if (!isExpanded) return 0;

      const getExpandedChildrenHeight = (children: string[]) =>
        children.reduce((acc, curr) => {
          if (!tree.items[curr].isExpanded) {
            return acc + height - 0.25;
          }
          return (
            acc +
            height +
            getExpandedChildrenHeight(tree.items[curr].children as string[])
          );
        }, 0);

      return getExpandedChildrenHeight(children as string[]);
    };

    return (
      <TreeItem
        {...props}
        expand={expand}
        select={select}
        deselect={deselect}
        selectedItemId={selectedItemId}
        offset={OFFSET}
        rulerHeight={getRulerHeight()}
      />
    );
  };

  return currentScreenId !== -1 ? (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Navigator
      </StyledAccordionSummary>

      <StyledAccordionDetails>
        <div className={classes.tree} onKeyDown={handleKeyDown}>
          <Scrollbar
            style={{
              height: '300px',
              maxHeight: '300px',
              minHeight: '300px',
            }}
          >
            <AtlasTree
              tree={tree}
              renderItem={renderItem}
              onExpand={expand}
              onCollapse={collapse}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              offsetPerLevel={OFFSET}
              isDragEnabled
              isNestingEnabled
            />
          </Scrollbar>
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  ) : null;
};

export default Navigator;
