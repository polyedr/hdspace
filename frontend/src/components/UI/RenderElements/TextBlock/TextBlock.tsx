import React from 'react';
import cn from 'classnames';

import { TextBlockRendererProps } from '../types';
const styles = require('../styles.scss');

const TextBlock = (props: TextBlockRendererProps) => {
  const { id, style, params, sortableId, isDisabled, className, elementRef } = props;

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem)}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </div>
  );
};

export { TextBlock };
