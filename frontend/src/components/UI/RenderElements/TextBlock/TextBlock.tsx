/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { TextBlockRendererProps } from '../types';

const styles = require('../styles.scss');

const TextBlock: React.FC<TextBlockRendererProps> = ({
  id,
  entityStyles,
  groupStyles,
  ownStyles,
  params,
  sortableId,
  isDisabled,
  className,
  elementRef,
}) => {
  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
      wordBreak: 'break-word',
    },

    groupStyles: {
      ...groupStyles,
      wordBreak: 'break-word',
    },

    ownStyles: {
      ...ownStyles,
      wordBreak: 'break-word',
    },
  })();

  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedElem,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </div>
  );
};

export { TextBlock };
