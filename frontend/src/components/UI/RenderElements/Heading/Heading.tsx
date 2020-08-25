import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { HeadingRendererProps } from '../types';

const styles = require('../styles.scss');

const Heading: React.FC<HeadingRendererProps> = ({
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

  const { headingType, textContent } = params;
  const HeadingTag = headingType || 'h3';

  return (
    <HeadingTag
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
      {textContent}
    </HeadingTag>
  );
};

export default Heading;
