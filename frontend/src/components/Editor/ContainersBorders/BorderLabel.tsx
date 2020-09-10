import React from 'react';
import cn from 'classnames';

import { BorderedItem } from './Border';

const styles = require('./BorderLabel.scss');

type Props = {
  item: BorderedItem;
};

const BorderLabel = ({ item }) => {
  const labelClasses = cn(styles.borderLabel, styles.borderLabel_active);

  const {
    borderDom: { coordinates },
  } = item;

  return (
    <span
      data-label-id={item.id}
      data-element-name={item.name}
      className={labelClasses}
      style={{
        top: coordinates.top,
        right: 'auto',
        left: coordinates.left,
      }}
    >
      {item.name}
    </span>
  );
};

export default BorderLabel;
