import React from 'react';
import cn from 'classnames';

import { Renderer } from '../types';
const styles = require('../styles.scss');

const Label: Renderer = (props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;
  const { labelFor, textContent } = params;

  return (
    <label
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      {...labelFor !== 'no for attribute' && { htmlFor: labelFor }}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, wordBreak: 'break-word', cursor: isDisabled ? 'default' : 'pointer' }}
      tabIndex={isDisabled ? 0 : -1}
      onClick={event => isDisabled && event.preventDefault()}
    >
      {textContent}
    </label>
  );
};

export { Label };
