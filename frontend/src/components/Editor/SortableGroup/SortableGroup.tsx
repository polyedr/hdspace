import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { SortableOptions } from 'sortablejs';

// @ts-ignore
import Sortable from '../Sortable/Sortable';
import sharedClasses from '../../../styles/sharedClasses';
import { Indices } from '../../../redux/project/types';
import { selectActiveItem } from '../../../redux/project/selectors';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';

const styles = require('./SortableGroup.scss');

type Props = {
  elementRenderer: React.FunctionComponent;
  disableSortable: boolean;
  isPutItem: boolean | string[];
  group: string;
  children?: any;
  align?: string;
  isSomeItemBeingDragged: boolean;
  isSomeItemResizable?: boolean;
  id: string;
  onChange(indices: Indices, parentId: string, isRemote?: boolean): void;
  onChoose(itemIndex: number, target?: React.SyntheticEvent): void;
};

const SortableGroup: React.FC<Props> = ({
  elementRenderer,
  disableSortable,
  isPutItem,
  group,
  children,
  onChoose,
  onChange,
  align,
  isSomeItemBeingDragged,
  isSomeItemResizable,
  ...elementProps
}) => {
  const { id } = elementProps;
  const activeItem = useSelector(selectActiveItem);
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const isActive = !disableInteractions && id === activeItem.itemId;

  const handleChoose = useCallback(
    (evt) => {
      onChoose(evt.oldIndex);
    },
    [onChoose],
  );

  const handlePositionChange = useCallback(
    (evt, isRemote) => {
      const { newIndex, oldIndex } = evt;
      onChange({ newIndex, oldIndex }, id, isRemote);
    },
    [id, onChange],
  );

  const handleDragEnter = useCallback((evt) => {
    const container = evt.target.closest('.sortable-group');

    if (container && !isSomeItemResizable) {
      container.classList.add('hovered');
    }
  }, []);

  const handleDragLeave = useCallback((evt) => {
    const container = evt.target.closest('.sortable-group');

    if (
      container &&
      !container.contains(evt.relatedTarget) &&
      !isSomeItemResizable
    ) {
      // when dragging over element with drag resizers, they stop dragging process by firing 'dragleave' event
      container.classList.remove('hovered');
    }
  }, []);
  // prevent items from hovering in Workspace’s mouse handlers when sorting items
  const handleSortableMouseOver = useCallback(
    (event: React.MouseEvent) =>
      isSomeItemBeingDragged && event.stopPropagation(),
    [],
  );

  const handleSortableMouseOut = useCallback(
    (event: React.MouseEvent) =>
      isSomeItemBeingDragged && event.stopPropagation(),
    [],
  );

  const className =
    id === 'root'
      ? !disableSortable && styles.moving
      : cn(
          sharedClasses.lsItem,
          sharedClasses.sortableGroup,
          isActive && sharedClasses.activated,
          !disableSortable && styles.moving,
        );

  return (
    <Sortable
      className={className}
      options={
        {
          filter: '.unsortable',
          swapThreshold: 0.9, // Threshold of the swap zone
          animation: 750,
          group: {
            name: group,
            // pull: 'clone', // «вытаскивать» элементы при перемещении
            put: true, // принять элемент из другой группы, массив разрешенных групп.
          },
          onChoose: handleChoose,
        } as SortableOptions
      }
      ref={(c: any) => {
        if (c) {
          c.sortable.option('disabled', disableSortable);
          c.sortable.option('group', { put: isPutItem, name: group });
        }
      }}
      elementRenderer={elementRenderer}
      onChange={handlePositionChange}
      onChoose={handleChoose}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onMouseOver={handleSortableMouseOver}
      onMouseOut={handleSortableMouseOut}
      {...elementProps}
    >
      {children}
    </Sortable>
  );
};

export default SortableGroup;
