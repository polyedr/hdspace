// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ListRendererProps } from '../types';

const styles = require('../styles.scss');

const List: React.FC<ListRendererProps> = React.forwardRef(
  (
    {
      id,
      entityStyles,
      groupStyles,
      ownStyles,
      params,
      sortableId,
      className,
      children,
    },
    ref,
  ) => {
    const { isOrdered } = params;

    const ListTag = isOrdered ? 'ol' : 'ul';

    const classes = makeStyles({
      entityStyles: {
        ...entityStyles,
        ...(isOrdered && { 'list-style-type': 'decimal' }),
      },

      groupStyles: {
        ...groupStyles,
        ...(isOrdered && { 'list-style-type': 'decimal' }),
      },

      ownStyles: {
        ...ownStyles,
        ...(isOrdered && { 'list-style-type': 'decimal' }),
      },
    })();

    return (
      <ListTag
        ref={ref}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        className={cn(
          className,
          styles.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      >
        {children}
      </ListTag>
    );
  },
);

export default List;
