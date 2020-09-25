import React, { MouseEvent, useState } from 'react';
import { RenderItemParams } from '@atlaskit/tree';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lighten } from '@material-ui/core';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';
import { focusTreeItem } from '../utils';
import ContextMenu from './ContextMenu';

const useStyles = makeStyles({
  iconButton: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: 20,
    '&:empty': {
      boxSizing: 'border-box',
      display: 'inline-block',
      width: 20,
    },
    '& svg': {
      color: 'white',
      width: '1.25em',
      height: '1.25em',
      display: 'inline-block',
      verticalAlign: 'middle',
      pointerEvents: 'none',
    },
  },
  treeItem: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    minHeight: '2em',
    padding: '0.25em',
    outline: 'none',
    whiteSpace: 'nowrap',
    '& button': {
      border: 'none',
      appearance: 'none',
      boxShadow: 'none',
      outline: 'none',
      background: 'none',
    },

    '&:hover': {
      backgroundColor: lighten('#2F4050', 0.05),
    },

    '&[aria-selected="true"]': {
      backgroundColor: 'hsl(204, 80%, 50%)',
    },
  },
  isDragging: {
    boxShadow:
      '0 4px 8px -2px rgba(147, 151, 159, 0.31), 0 0 1px rgba(147, 151, 159, 0.31)',
    outline: '1px solid #5b5f67',
  },
});

const GroupIcon = ({ onClick, icon }) => {
  const classes = useStyles();
  return (
    <button
      tabIndex={-1}
      onClick={onClick}
      className={classes.iconButton}
      type="button"
    >
      {icon}
    </button>
  );
};

const getIcon = (item, expand, collapse) => {
  const classes = useStyles();

  if (item.children?.length > 0) {
    return item.isExpanded ? (
      <GroupIcon icon={<ChevronDown />} onClick={() => collapse(item.id)} />
    ) : (
      <GroupIcon icon={<ChevronRight />} onClick={() => expand(item.id)} />
    );
  }
  return <span className={classes.iconButton} />;
};

type Props = RenderItemParams & {
  select: (itemId: string) => void;
  selectedItemId: string | null;
};

type State = {
  mouseX: number | null;
  mouseY: number | null;
};

const TreeItem: React.FC<Props> = ({
  item,
  onExpand,
  onCollapse,
  provided,
  select,
  selectedItemId,
  snapshot,
}) => {
  const classes = useStyles();

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
        classes.treeItem,
        snapshot.isDragging ? classes.isDragging : '',
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

      <ContextMenu
        open={state.mouseY !== null}
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
        onClose={handleClose}
      />
    </div>
  );
};

export default TreeItem;
