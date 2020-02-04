import React, { useCallback } from 'react';
import classNames from 'classnames';
import { SortableOptions } from 'sortablejs';

// @ts-ignore
import { Sortable } from '$components/Editor/Sortable/Sortable';

const styles = require('./SortableGroup.scss');

type Props = {
  disableSortable: boolean,
  isPutItem: boolean,
  parent: string,
  group: string,
  children?: any,
  stylesToInherit: React.CSSProperties,
  align?: string,
  isSomeItemBeingDragged: boolean,
  onChange: (index: number, items: string[], parentId: string) => void,
  onChoose: (itemIndex: string, target?: React.SyntheticEvent) => void,

};

export const SortableGroup: React.FC<Props> = (props) => {
  const {
    disableSortable,
    isPutItem,
    parent,
    group,
    stylesToInherit,
    children,
    onChoose,
    onChange,
    align,
    isSomeItemBeingDragged,
  } = props;

  const handleChoose = useCallback((evt) => {
    onChoose(evt.oldIndex);
  }, [onChoose]);

  const handlePositionChange = useCallback((itemsInCurrentSortableGroup: string[], _, evt) => {
    const draggedItemPositionInCurrentSortableGroup = evt.newIndex;
    onChange(draggedItemPositionInCurrentSortableGroup, itemsInCurrentSortableGroup, parent);
  }, [parent, onChange]);
  // const handleChoose = (ent) => {
  //   onChoose(ent.oldIndex);
  // };
  //
  // const handlePositionChange = (items: string[], sortable, evt) => {
  //   onChange(items, evt.newIndex);
  // };

  // useEffect(() => {
  //   if (!ref || !ref.forceUpdate) return;
  //
  //   console.log('update');
  //
  //   ref.forceUpdate();
  // }, [handleChoose, ref]);

  const handleDragEnter = useCallback((el) => {
    el.parentElement.classList.add('hovered');
  }, [])

  const handleDragLeave = useCallback((el) => {
    el.parentElement.classList.remove('hovered');
  }, [])

  const handleSortableMouseOver = useCallback((event: React.MouseEvent) => {
    isSomeItemBeingDragged && event.stopPropagation();
  }, []);

  const handleSortableMouseOut = useCallback((event: React.MouseEvent) => {
    isSomeItemBeingDragged && event.stopPropagation();
  }, []);


  return (
    <Sortable
      id={parent}
      style={stylesToInherit}
      className={classNames(
        parent !== 'root' && 'sortable-group',
        // styles[group],
        align && styles[`align_${align}`],
        disableSortable && styles.moving,
      )}
      // tag="ul" Defaults to "div"
      options={{
        swapThreshold: 0.9, // Threshold of the swap zone
        animation: 750,
        // filter: [] // Selectors that do not lead to dragging (String or Function)
        // draggable: '.block, .group, ...', // which items inside the element should be draggable
        // dragoverBubble: true,
        group: {
          name: group, // название группы;
          // pull: 'clone', // «вытаскивать» элементы при перемещении
          put: true, // принять элемент из другой группы, массив разрешенных групп.
        },
        onChoose: handleChoose,
        // onAdd: this.onUpdate,
        // onRemove: this.onUpdate,
        // onUpdate: this.onUpdate,
        // fallbackOnBody: true,
        // removeCloneOnHide: true,
        // scroll — включить авто-прокрутку;
        // scrollSensitivity — на сколько нужно приблизится к краю для активации прокрутки;
        // scrollSpeed — скорость прокрутки в `px`;
      } as SortableOptions}
      ref={(c: any) => {
        if (c) {
          // this.sortable = c.sortable;
          c.sortable.option('disabled', disableSortable);
          c.sortable.option('group', { put: isPutItem, name: group });
          // c.sortable.option('draggable', listNotDragging); // Specifies which items inside the element should be draggable
          // let style = window.getComputedStyle(c.node, null);
        }
      }}
      onChange={handlePositionChange}
      onChoose={handleChoose}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onMouseOver={handleSortableMouseOver}
      onMouseOut={handleSortableMouseOut}
    >
      {children}
    </Sortable >
  );
};
