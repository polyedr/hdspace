import React, {
  KeyboardEvent,
  useState,
  MouseEvent,
  useMemo,
  useCallback,
  memo,
} from 'react';
import AtlasTree, {
  mutateTree,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeSourcePosition,
  TreeItem as TreeItemType,
} from '@atlaskit/tree';
import TreeItem from '@Components/LeftPanel/Navigator/components/TreeItem';
import {
  copyActiveElement,
  deleteElement,
  moveElement,
  pasteCopiedElement,
  executeUndoActions,
  setActiveElement,
  executeRedoActions,
} from '@Redux/project/actions';
import {
  findNextNodeId,
  findPrevNodeId,
  focusTreeItem,
  getRulerHeight,
} from '@Components/LeftPanel/Navigator/utils';
import { canElementBeAdded } from '@Utils/normalizedStateHelpers';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  Normalized,
  StateElement,
  UserProjectPermission,
  KeyCode,
} from '@Src/types';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  selectActiveElementId,
  selectMasterCoreElementId,
  selectMasterGroupsElementId,
  selectSelectedElementsIds,
  selectTreeChildElementsIds,
} from '@Redux/project/selectors/element';
import ContextMenu from '@Components/LeftPanel/Navigator/components/ContextMenu';
import { NOT_DRAGGABLE_COMPONENTS } from '@Constants/defaultParams';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { makeStyles } from '@material-ui/core/styles';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import logger from 'loglevel';
import Scrollbar from '../../../UI/Scrollbar';

const useStyles = makeStyles({
  tree: {
    fontSize: '0.75em',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',

    '& > :first-child': {
      flex: '1',
      overflow: 'auto',
    },
  },
});

type Props = {
  tree: TreeData;
  setTree: React.Dispatch<React.SetStateAction<TreeData>>;
  elements: Normalized<StateElement>;
};

type State = {
  mouseX: number | null;
  mouseY: number | null;
  item: TreeItemType | null;
};

const OFFSET = 15;

const Tree: React.FC<Props> = ({ tree, setTree, elements }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedElementsIds = useSelector(selectSelectedElementsIds);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const activeElementId = useSelector(selectActiveElementId);
  const masterCoreElementId = useSelector(selectMasterCoreElementId);
  const masterGroupsElementId = useSelector(selectMasterGroupsElementId);
  const masterCoreChildIds = useSelector(
    selectTreeChildElementsIds(masterCoreElementId),
  );
  const canEdit = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const initialState: State = {
    mouseX: null,
    mouseY: null,
    item: null,
  };

  const isPrototypeMode = useSelector(selectIsPrototypeMode);

  const [state, setState] = useState<State>(initialState);

  const coreElementSelected = useMemo(() => {
    const { item } = state;
    return item
      ? [
          masterCoreElementId,
          masterGroupsElementId,
          ...masterCoreChildIds,
        ].includes(item.id.toString())
      : false;
  }, [masterCoreChildIds, masterCoreElementId, masterGroupsElementId, state]);

  const handleMenuOpen = (
    ev: MouseEvent<HTMLDivElement>,
    item: TreeItemType,
  ) => {
    ev.preventDefault();

    if (!isPrototypeMode) {
      setState({
        mouseX: ev.clientX - 2,
        mouseY: ev.clientY - 4,
        item,
      });
      dispatch(setActiveElement(String(item.id)));
    }
  };

  const handleClose = () => setState(initialState);

  const expandItemParents = useCallback((tree: TreeData, id: string) => {
    // @ts-ignore
    const parentId = tree.items[id]?.parent;
    if (!parentId) return tree;
    if (tree.items[parentId] && !tree.items[parentId].isExpanded) {
      const newTree = mutateTree(tree, parentId, { isExpanded: true });
      return expandItemParents(newTree, parentId);
    }
    return tree;
  }, []);

  const expandedTree = useMemo(
    () => expandItemParents(tree, activeElementId),
    [activeElementId, expandItemParents, tree],
  );

  const [selectedItemId, setSelectedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const expand = useCallback(
    (itemId) =>
      setTree((state) => mutateTree(state, itemId, { isExpanded: true })),
    [setTree],
  );

  const collapse = useCallback(
    (itemId) =>
      setTree((state) => mutateTree(state, itemId, { isExpanded: false })),
    [setTree],
  );

  const select = useCallback(
    (itemId) => {
      if (selectedItemId === itemId) return;
      setSelectedItem(itemId);
      dispatch(setActiveElement(itemId));
    },
    [dispatch, selectedItemId],
  );

  const deselect = () => {
    setSelectedItem(null);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (selectedItemId && !isDragging) {
        if (e.keyCode === KeyCode.UpArrow) {
          e.preventDefault();
          const prevNodeId = findPrevNodeId(tree, selectedItemId);
          select(prevNodeId);
          focusTreeItem(prevNodeId);
        }

        if (e.keyCode === KeyCode.DownArrow) {
          e.preventDefault();
          const nextNodeId = findNextNodeId(tree, selectedItemId);
          focusTreeItem(nextNodeId);
        }

        if (e.keyCode === KeyCode.RightArrow) {
          expand(selectedItemId);
          select(selectedItemId);
        }

        if (e.keyCode === KeyCode.LeftArrow) {
          collapse(selectedItemId);

          select(selectedItemId);
        }

        if (e.keyCode === KeyCode.Space && !coreElementSelected && canEdit) {
          setIsDragging((state) => !state);
        }

        if (
          e.keyCode === KeyCode.C &&
          (e.ctrlKey || e.metaKey) &&
          !coreElementSelected &&
          canEdit
        ) {
          // Ctrl/Cmd + C
          dispatch(copyActiveElement());
        }

        if (
          e.keyCode === KeyCode.V &&
          (e.ctrlKey || e.metaKey) &&
          !coreElementSelected &&
          canEdit
        ) {
          // Ctrl/Cmd + V
          dispatch(pasteCopiedElement({ screenId: currentScreenId }));
        }

        if (
          !isPrototypeMode &&
          (e.keyCode === KeyCode.DeleteKey ||
            (e.keyCode === KeyCode.BackSpace &&
              e.metaKey &&
              !coreElementSelected &&
              canEdit))
        ) {
          // Delete or Cmd + Backspace
          const prevItemId = findPrevNodeId(tree, selectedItemId);
          dispatch(
            deleteElement(selectedItemId, { screenId: currentScreenId }),
          );
          focusTreeItem(prevItemId);
        }

        if (
          e.keyCode === KeyCode.Z &&
          (e.ctrlKey || e.metaKey) &&
          !e.shiftKey
        ) {
          // Ctrl/Cmd + Z
          dispatch(executeUndoActions());
        }

        if (e.keyCode === KeyCode.Z && (e.ctrlKey || e.metaKey) && e.shiftKey) {
          // Ctrl/Cmd + Shift + Z
          dispatch(executeRedoActions());
        }
      }
    },
    [
      canEdit,
      collapse,
      coreElementSelected,
      currentScreenId,
      dispatch,
      expand,
      isDragging,
      select,
      selectedItemId,
      tree,
      isPrototypeMode,
    ],
  );

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
      logger.error(`No element ${newParent.id}`);
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
    const height = 30;

    return (
      <TreeItem
        {...props}
        select={select}
        deselect={deselect}
        offset={OFFSET}
        rulerHeight={getRulerHeight(props.item, expandedTree, height)}
        height={height}
        onContextMenu={handleMenuOpen}
        isActive={selectedElementsIds.includes(String(props.item.id))}
      />
    );
  };

  return (
    <div
      className={classes.tree}
      onKeyDown={handleKeyDown}
      id={ELEMENT_IDS.navigator}
    >
      <Scrollbar
        style={{
          // height: '50vh',
          maxHeight: 'calc(100vh - 56px)',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <AtlasTree
            tree={expandedTree}
            renderItem={renderItem}
            onExpand={expand}
            onCollapse={collapse}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            offsetPerLevel={OFFSET}
            isDragEnabled={(item) =>
              !NOT_DRAGGABLE_COMPONENTS.includes(item.data.type) && canEdit
            }
            isNestingEnabled
          />
        </div>
      </Scrollbar>

      {state.item && !coreElementSelected && canEdit && (
        <>
          <ContextMenu
            open={state?.mouseY !== null}
            anchorPosition={
              state.mouseY !== null && state.mouseX !== null
                ? { top: state.mouseY, left: state.mouseX }
                : undefined
            }
            onClose={handleClose}
            item={state.item}
          />
        </>
      )}
    </div>
  );
};

export default memo(Tree);
