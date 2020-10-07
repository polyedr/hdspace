// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { ParagraphRendererProps } from '../types';

const styles = require('../styles.scss');

const Paragraph: React.FC<ParagraphRendererProps> = React.forwardRef(
  ({ id, entityStyles, groupStyles, ownStyles, params, className }, ref) => {
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
        style={{ wordBreak: 'break-word' }}
      >
        {params.textContent}
      </p>
    );
  },
);

export default Paragraph;
