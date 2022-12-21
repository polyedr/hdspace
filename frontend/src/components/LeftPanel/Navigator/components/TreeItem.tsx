import React, { memo, MouseEvent, useCallback } from 'react';
import { RenderItemParams, TreeItem as TreeItemType } from '@atlaskit/tree';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { splitWords } from '@Utils/stringHelper';
import { ICONS } from '@Domain/libraryElements/libraryElements';
import { useDispatch } from 'react-redux';
import { toggleSelectedElement } from '@Redux/project/actions';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';

const useIndicatorStyles = makeStyles({
  iconButton: {
    padding: 0,
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '1em',
    '&:empty': {
      boxSizing: 'border-box',
      display: 'inline-block',
      width: '1em',
    },
    '& svg': {
      color: 'black',
      width: '1em',
      height: '1em',
      display: 'inline-block',
      verticalAlign: 'middle',
      pointerEvents: 'none',
    },
  },
});

const useStyles = makeStyles(({ palette }) => ({
  treeItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: ({ height }: Props) => height,
    outline: 'none',
    whiteSpace: 'nowrap',
    textTransform: 'capitalize',
    '& button': {
      padding: 0,
      color: '#000000',
      border: 'none',
      appearance: 'none',
      boxShadow: 'none',
      outline: 'none',
      background: 'none',
    },

    '&:hover': {
      backgroundColor: '#F3F4F6',
    },

    '&[aria-selected="true"]': {
      backgroundColor: '#F3F4F6',
    },

    '&:before': {
      content: '""',
      zIndex: 10,
      position: 'absolute',
      top: '100%',
      left: ({ depth, offset }: Props) =>
        `calc(${depth} * ${offset}px + 1em/2 + 1px)`,
      width: 0.5,
      height: ({ rulerHeight }: Props) => rulerHeight,
      display: 'block',
      backgroundColor: palette.grey.A200,
    },
  },
  isDragging: {
    boxShadow:
      '0 4px 8px -2px rgba(147, 151, 159, 0.31), 0 0 1px rgba(147, 151, 159, 0.31)',
    outline: '1px solid #5b5f67',
  },
  icon: {
    fontSize: '1.2em',
  },
  text: {
    padding: '5px',
    fontSize: 11,
  },
}));

type ExpandIndicatorProps = {
  hasChildren: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

const ExpandIndicator: React.FC<ExpandIndicatorProps> = ({
  hasChildren,
  isExpanded,
  onExpand,
  onCollapse,
}) => {
  const { iconButton } = useIndicatorStyles();

  if (hasChildren) {
    return (
      <button
        tabIndex={-1}
        onClick={isExpanded ? onCollapse : onExpand}
        className={iconButton}
        type="button"
      >
        {isExpanded ? <ChevronDown /> : <ChevronRight />}
      </button>
    );
  }
  return <span className={iconButton} />;
};

type Props = RenderItemParams & {
  select: (itemId: string) => void;
  deselect: (itemId: string) => void;
  offset: number;
  rulerHeight: number;
  height: number;
  onContextMenu: (ev: MouseEvent<HTMLDivElement>, item: TreeItemType) => void;
  isActive: boolean;
};

const TreeItem: React.FC<Props> = (props) => {
  const {
    item,
    onExpand,
    onCollapse,
    provided,
    select,
    snapshot,
    onContextMenu,
    isActive,
  } = props;
  const dispatch = useDispatch();

  const classes = useStyles(props);
  const ElementIcon = ICONS[item.data.type];

  const isParent = item.children.length;

  const handleDoubleClick = useCallback(
    () => (item.isExpanded ? onCollapse(item.id) : onExpand(item.id)),
    [item.id, item.isExpanded, onCollapse, onExpand],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (event.ctrlKey || event.metaKey) {
        dispatch(toggleSelectedElement(String(item.id)));
      } else {
        select(item.id as string);
      }
    },
    [item.id, select, dispatch],
  );

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
      onContextMenu={(ev) => onContextMenu(ev, item)}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      aria-selected={isActive}
      {...(isParent
        ? { role: 'group', 'aria-expanded': item.isExpanded }
        : { role: 'treeitem' })}
    >
      <span>
        <ExpandIndicator
          isExpanded={!!item.isExpanded}
          hasChildren={!!item.children.length}
          onCollapse={() => onCollapse(item.id)}
          onExpand={() => onExpand(item.id)}
        />
      </span>

      {ElementIcon && <ElementIcon className={classes.icon} />}

      <span className={classes.text}>{splitWords(item.data?.title)}</span>
    </div>
  );
};

export default memo(TreeItem);
