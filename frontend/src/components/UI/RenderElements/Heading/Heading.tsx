// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { HeadingRendererProps } from '../types';

const styles = require('../styles.scss');

const Heading: React.FC<HeadingRendererProps> = React.forwardRef(
  ({ id, entityStyles, groupStyles, ownStyles, params, className }, ref) => {
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
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
      >
        {textContent}
      </HeadingTag>
    );
  },
);

export default Heading;
