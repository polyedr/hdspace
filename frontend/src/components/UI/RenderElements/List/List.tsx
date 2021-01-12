// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ListRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  list: ({ params: { isOrdered } }) => ({
    listStylePosition: 'inside',
    ...(isOrdered && { 'list-style-type': 'decimal' }),
  }),
});

const List: React.FC<ListRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className, children, entityClass, groupClass } = props;
  const { isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <ListTag
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        className,
        classes.list,
        entityClass,
        groupClass,
        classes.addedElem,
        classes.ownStyles,
      )}
      {...eventHandlers}
    >
      {children}
    </ListTag>
  );
});

export default List;
