// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';

import { ListRendererProps } from '../types';

const useStyles = makeComponentStyles({
  list: ({ params: { isOrdered } }) => ({
    ...(isOrdered && { 'list-style-type': 'decimal' }),
  }),
});

const List: React.FC<ListRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, className, children } = props;
  const { isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  const classes = useStyles(props);

  return (
    <ListTag
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(
        className,
        classes.addedElem,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
    >
      {children}
    </ListTag>
  );
});

export default List;
