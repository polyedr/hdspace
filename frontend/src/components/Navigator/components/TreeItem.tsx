import React, { MouseEvent, useState } from 'react';
import { RenderItemParams } from '@atlaskit/tree';
import cn from 'classnames';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';
import { focusTreeItem } from '$components/Navigator/utils';

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
  const initialState = {
    mouseX: null,
    mouseY: null,
  };

  const [state, setState] = useState<State>(initialState);
  const isParent = item.children.length;

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
        <MenuItem>first</MenuItem>
        <MenuItem>second</MenuItem>
        <MenuItem>third</MenuItem>
      </StyledMenu>
    </div>
  );
};

export default TreeItem;
