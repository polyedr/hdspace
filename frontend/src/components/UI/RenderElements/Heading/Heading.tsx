import React from 'react';
import cn from 'classnames';

import { HeadingRendererProps } from '../types';
const styles = require('../styles.scss');

const Heading = (props: HeadingRendererProps) => {
  const { id, style, params, sortableId, isDisabled, className, elementRef } = props;
  const { headingType, textContent } = params;
  const HeadingTag = headingType || 'h3';

  return (
    <HeadingTag
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem)}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {textContent}
    </HeadingTag>
  );
};

export { Heading };
