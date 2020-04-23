import React from 'react';
import cn from 'classnames';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Heading: Renderer = (props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;
  const { headingType } = params;
  const HeadingTag = headingType || 'h1';

  return (
    <HeadingTag
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </HeadingTag>
  );
};

export { Heading };
