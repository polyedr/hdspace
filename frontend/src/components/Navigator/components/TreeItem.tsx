import React from 'react';
import { RenderItemParams } from '@atlaskit/tree';
import cn from 'classnames';
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

const TreeItem: React.FC<Props> = ({
  item,
  onExpand,
  onCollapse,
  provided,
  select,
  selectedItemId,
  snapshot,
}) => {
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
        styles.treeItem,
        snapshot.isDragging ? styles.isDragging : '',
      )}
      id={`treeitem-${item.id}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
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
    </div>
  );
};

export default TreeItem;
