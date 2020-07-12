import React from 'react';
import cn from 'classnames';

import { LabelRendererProps } from '../types';
const styles = require('../styles.scss');

const Label = (props: LabelRendererProps) => {
  const { id, style, params, sortableId, isDisabled, className, elementRef } = props;
  const { labelFor, textContent } = params;

  return (
    <label
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      {...labelFor !== 'no for attribute' && { htmlFor: labelFor }}
      className={cn(className, styles.addedElem)}
      style={{ ...style, wordBreak: 'break-word', cursor: isDisabled ? 'default' : 'pointer' }}
      tabIndex={isDisabled ? 0 : -1}
      onClick={event => isDisabled && event.preventDefault()}
    >
      {textContent}
    </label>
  );
};

export { Label };
