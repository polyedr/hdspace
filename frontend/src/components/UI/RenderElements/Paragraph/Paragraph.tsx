import React from 'react';
import cn from 'classnames';

import { ParagraphRendererProps } from '../types';
const styles = require('../styles.scss');

const Paragraph = (props: ParagraphRendererProps) => {
  const { id, style, params, sortableId, isDisabled, className, elementRef } = props;

  return (
    <p
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
    </p>
  );
};

export { Paragraph };
