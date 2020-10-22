// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { TextBlockRendererProps } from '../types';

const styles = require('../styles.scss');

const TextBlock: React.FC<TextBlockRendererProps> = React.forwardRef(
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

    return (
      <div
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
        {params.textContent}
      </div>
    );
  },
);

export default TextBlock;
