import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';

import { TextBlockRendererProps } from '../types';
const styles = require('../styles.scss');

const TextBlock = (props: TextBlockRendererProps) => {
  const { id, style, params, active, sortableId, isDisabled } = props;

  return (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(sharedClasses.lsItem, styles.addedElem, active && sharedClasses.activated)}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </div>
  );
};

export { TextBlock };
