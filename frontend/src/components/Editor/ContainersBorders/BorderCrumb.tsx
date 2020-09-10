import React from 'react';
import cn from 'classnames';

import { BorderedItem } from './Border';

const styles = require('./BorderCrumb.scss');

type Props = {
  item: BorderedItem;
  children?: any[];
};

const BorderCrumb = ({ item, children }) => {
  const labelClasses = cn(styles.borderCrumb, styles.borderCrumb_active);

  const {
    borderDom: { coordinates },
  } = item;

  return (
    <div
      className={labelClasses}
      style={{
        top: coordinates.top,
        right: 'auto',
        left: coordinates.left,
      }}
    >
      <span
        className={cn(styles.borderLabel)}
        data-label-id={item.id}
        data-element-name={item.name}
      >
        {item.name}
      </span>
      {children}
    </div>
  );
};

export default BorderCrumb;
