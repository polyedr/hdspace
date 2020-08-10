import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ParagraphRendererProps } from '../types';
const styles = require('../styles.scss');

const Paragraph = (props: ParagraphRendererProps) => {
  const { id, entityStyles, groupStyles, ownStyles, params, sortableId, isDisabled, className, elementRef } = props;

  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
  })();

  return (
    <p
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem, classes.entityStyles, classes.groupStyles, classes.ownStyles)}
      style={{ wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </p>
  );
};

export { Paragraph };
