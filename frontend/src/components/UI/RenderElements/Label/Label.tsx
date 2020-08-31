/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { LabelRendererProps } from '../types';

const styles = require('../styles.scss');

const Label: React.FC<LabelRendererProps> = ({
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
  const { labelFor, textContent } = params;

  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
      wordBreak: 'break-word',
      cursor: isDisabled ? 'default' : 'pointer',
    },

    groupStyles: {
      ...groupStyles,
      wordBreak: 'break-word',
      cursor: isDisabled ? 'default' : 'pointer',
    },

    ownStyles: {
      ...ownStyles,
      wordBreak: 'break-word',
      cursor: isDisabled ? 'default' : 'pointer',
    },
  })();

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
      className={cn(
        className,
        styles.addedElem,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
      onClick={(event) => isDisabled && event.preventDefault()}
    >
      {textContent}
    </label>
  );
};

export default Label;
