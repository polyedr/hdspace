import React, { useEffect } from 'react';
import ChevronDown from './Icons/chevron-down';
import ChevronRight from './Icons/chevron-right';

const styles = require('../Navigator.scss');

const GroupIcon = ({ onClick, icon }) => (
  <button tabIndex={-1} onClick={onClick} className={styles.icon} type="button">
    {icon}
  </button>
);

const getIcon = (item, expand, collapse) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <GroupIcon icon={<ChevronDown />} onClick={() => collapse(item.id)} />
    ) : (
      <GroupIcon icon={<ChevronRight />} onClick={() => expand(item.id)} />
    );
  }
  return <span className={styles.icon} />;
};

const TreeItem: React.FC<any> = ({
  item,
  onExpand,
  onCollapse,
  provided,
  select,
  selectedItem,
}) => {
  const isParent = item.children.length;

  useEffect(() => {
    /* if (selectedItem === item.id) {
      const elem = document.querySelector(
        `#treeitem-${item.id}`,
      ) as HTMLElement;
      elem?.focus();
    } */
  }, [item.id, selectedItem]);

  return (
    <div
      id={`treeitem-${item.id}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => select(item.id)}
      onFocus={() => select(item.id)}
      aria-selected={item.id === selectedItem}
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
