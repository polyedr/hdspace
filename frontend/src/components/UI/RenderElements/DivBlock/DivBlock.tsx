import React from 'react';
import cn from 'classnames';

import { DivBlockRendererProps } from '../types';
const styles = require('../styles.scss');

export const DivBlockRenderer = (props: DivBlockRendererProps) => {
  const { id, sortableId, style, isDisabled, children, className, elementRef } = props;

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </div>
  );
}
