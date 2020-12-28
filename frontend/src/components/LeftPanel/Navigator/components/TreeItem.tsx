import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { RenderItemParams, TreeItem as TreeItemType } from '@atlaskit/tree';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lighten } from '@material-ui/core';
import { selectIsElementActive } from '@Redux/project/selectors/element';
import { splitWords } from '@Utils/stringHelper';
import { ICONS } from '@Domain/libraryElements/libraryElements';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';
import { focusTreeItem } from '../utils';

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
      color: 'white',
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
    // minHeight: '2em',
    height: ({ height }: Props) => height,
    padding: '0.25em',
    outline: 'none',
    whiteSpace: 'nowrap',
    textTransform: 'capitalize',
    '& button': {
      padding: 0,
      border: 'none',
      appearance: 'none',
      boxShadow: 'none',
      outline: 'none',
      background: 'none',
    },

    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.3),
    },

    '&[aria-selected="true"]': {
      backgroundColor: lighten(palette.panel.main, 0.2),
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
    marginRight: '0.3em',
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
  } = props;

  const isActive = useSelector(selectIsElementActive(item.id.toString()));

  const classes = useStyles(props);
  const ElementIcon = ICONS[item.data.type];

  const isParent = item.children.length;

  const handleDoubleClick = () =>
    item.isExpanded ? onCollapse(item.id) : onExpand(item.id);

  const handleClick = () => {
    focusTreeItem(item.id);
  };

  const handleFocus = () => select(item.id as string);

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
      onFocus={handleFocus}
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

      <span>{splitWords(item.data?.title)}</span>
    </div>
  );
};

export default TreeItem;
