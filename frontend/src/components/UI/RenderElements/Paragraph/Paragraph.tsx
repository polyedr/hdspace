import React from 'react';
import cn from 'classnames';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Paragraph: Renderer = (props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;

  return (
    <p
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </p>
  );
};

export { Paragraph };
