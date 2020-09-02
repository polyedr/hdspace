import React, { MouseEvent, useState } from 'react';
import { RenderItemParams } from '@atlaskit/tree';
import cn from 'classnames';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';
import { focusTreeItem } from '$components/Navigator/utils';
import {
  copyActiveItem,
  deleteItem,
  pasteCopiedItem,
  setIsAddElementsModalOpened,
} from '$redux/project/actions';
import {
  selectActiveItem,
  selectCurrentScreenId,
} from '$redux/project/selectors';
import { canElementHaveChildren } from '$utils/AvailableChildrenHelper';

const styles = require('../Navigator.scss');

const GroupIcon = ({ onClick, icon }) => (
  <button
    tabIndex={-1}
    onClick={onClick}
    className={styles.iconButton}
    type="button"
  >
    {icon}
  </button>
);

const getIcon = (item, expand, collapse) => {
  if (item.children?.length > 0) {
    return item.isExpanded ? (
      <GroupIcon icon={<ChevronDown />} onClick={() => collapse(item.id)} />
    ) : (
      <GroupIcon icon={<ChevronRight />} onClick={() => expand(item.id)} />
    );
  }
  return <span className={styles.iconButton} />;
};

type Props = RenderItemParams & {
  select: (itemId: string) => void;
  selectedItemId: string | null;
};

type State = {
  mouseX: number | null;
  mouseY: number | null;
};

const StyledMenu = withStyles({
  paper: {
    borderRadius: 0,
    backgroundColor: '#2f4050',
    color: 'white',
  },
  list: {
    padding: 0,
    '& li': {
      padding: '2px 5px',
      fontSize: '.9em',
      '&:hover': {
        backgroundColor: '#52616e',
      },
    },
  },
})((props: MenuProps) => <Menu {...props} />);

const TreeItem: React.FC<Props> = ({
  item,
  onExpand,
  onCollapse,
  provided,
  select,
  selectedItemId,
  snapshot,
}) => {
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const { itemType: activeItemType } = useSelector(selectActiveItem);

  const initialState = {
    mouseX: null,
    mouseY: null,
  };

  const [state, setState] = useState<State>(initialState);
  const isParent = item.children.length;
  const canHaveChildren = canElementHaveChildren(activeItemType);

  const handleDoubleClick = () =>
    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);

  const handleClick = () => {
    focusTreeItem(item.id);
  };

  const handleFocus = () => select(item.id as string);

  const handleContextMenu = (ev: MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();

    setState({
      mouseX: ev.clientX - 2,
      mouseY: ev.clientY - 4,
    });
  };

  const handleClose = () => setState(initialState);

  const handleAddNew = () => {
    dispatch(setIsAddElementsModalOpened(true));
    handleClose();
  };

  const handleCopy = () => {
    dispatch(copyActiveItem());
    handleClose();
  };

  const handlePaste = () => {
    dispatch(pasteCopiedItem({ screenId: currentScreenId }));
    handleClose();
  };

  const handleDelete = () => {
    if (!selectedItemId) return;
    dispatch(deleteItem(selectedItemId, { screenId: currentScreenId }));
    handleClose();
  };

  return (
    <div
      className={cn(
        styles.treeItem,
        snapshot.isDragging ? styles.isDragging : '',
      )}
      id={`treeitem-${item.id}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onFocus={handleFocus}
      aria-selected={item.id === selectedItemId}
      {...(isParent
        ? { role: 'group', 'aria-expanded': item.isExpanded }
        : { role: 'treeitem' })}
    >
      <span>{getIcon(item, onExpand, onCollapse)}</span>
      <span>{item.data ? item.data.title : ''}</span>

      <StyledMenu
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem disabled={canHaveChildren} onClick={handleAddNew}>
          Add new...
        </MenuItem>

        <MenuItem onClick={handleCopy}>Copy</MenuItem>

        <MenuItem disabled={canHaveChildren} onClick={handlePaste}>
          Paste
        </MenuItem>

        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </StyledMenu>
    </div>
  );
};

export default TreeItem;
