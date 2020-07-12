import React from 'react';
import cn from 'classnames';

import { ListRendererProps } from '../types';
const styles = require('../styles.scss');

const List = (props: ListRendererProps) => {
  const { id, style, params, sortableId, isDisabled, className, elementRef, children } = props;
  const { isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  return (
    <ListTag
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedElem,
      )}
      style={{ ...style, ...(isOrdered && { "list-style-type": "decimal" }) }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </ListTag>
  );
};

export { List };
